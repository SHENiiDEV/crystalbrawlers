import React, { useEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { io } from 'socket.io-client';
import { Heart, Coins, Swords, ArrowLeft, RotateCcw, Skull, Crown, Zap } from 'lucide-react';
import {
    WORLD, styleWithSkin, drawHero, drawBot, drawProjectile, drawSlash,
    drawFloatingText, drawNameplate, Particles, clamp, lerp, hashString, roundRect, OUTLINE,
} from '../game/toon';
import { createGround, drawAnimatedDecor } from '../game/map';

const ATTACK_MS = 300;
const EFFECT_MS = 260;

export default function Arena({ hero, calculatedStats, playerSession, wsUrl = 'http://localhost:3001' }) {
    const { auth, skinPalettes = {} } = usePage().props;
    const user = auth?.user;
    const palettesRef = useRef(skinPalettes);
    palettesRef.current = skinPalettes;

    const canvasRef = useRef(null);
    const socketRef = useRef(null);

    // --- live data kept in refs so the render loop never restarts ---
    const stateRef = useRef({ players: [], bots: [], projectiles: [], damageTexts: [] });
    const selfIdRef = useRef(null);
    const viewsRef = useRef(new Map());
    const effectsRef = useRef([]);
    const attacksRef = useRef(new Map());
    const seenTextsRef = useRef(new Set());
    const particlesRef = useRef(new Particles(500));
    const cameraRef = useRef({ x: WORLD.width / 2, y: WORLD.height / 2 });
    const groundRef = useRef(null);
    const shakeRef = useRef(0);
    const keysPressed = useRef({ up: false, down: false, left: false, right: false });
    const mousePos = useRef({ x: 0, y: 0 });
    const angleRef = useRef(0);

    // --- HUD state (refreshed on a slow timer) ---
    const [connected, setConnected] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hud, setHud] = useState({
        name: playerSession?.userName || user?.name || 'Gladiator',
        heroClass: playerSession?.heroClass || hero?.id || 'knight',
        hp: calculatedStats?.hp || 100,
        maxHp: calculatedStats?.hp || 100,
        kills: 0, score: 0, coins: 0, alive: true,
        playersOnline: 0, botsAlive: 0, top: [],
    });

    const joinPayload = () => ({
        userId: playerSession?.userId || user?.id,
        userName: playerSession?.userName || user?.name || 'Gladiator',
        heroClass: playerSession?.heroClass || user?.selected_hero_class || 'knight',
        skin: playerSession?.skin || user?.equipped_skin || 'default',
        calculatedHp: calculatedStats?.hp,
        calculatedDamage: calculatedStats?.damage,
        calculatedSpeed: calculatedStats?.speed,
    });

    /* ------------------------------------------------------------------ *
     * Networking + input
     * ------------------------------------------------------------------ */
    useEffect(() => {
        const socket = io(wsUrl, { transports: ['websocket', 'polling'], reconnectionAttempts: 5 });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            selfIdRef.current = socket.id;
            socket.emit('join_arena', joinPayload());
        });

        socket.on('arena_init', (initData) => {
            selfIdRef.current = initData.selfId;
            if (initData.player) {
                cameraRef.current = { x: initData.player.x, y: initData.player.y };
            }
        });

        socket.on('arena_state', (state) => { stateRef.current = state; });

        socket.on('attack_effect', (effect) => {
            effectsRef.current.push({ ...effect, start: performance.now() });
            if (effect.id) attacksRef.current.set(effect.id, performance.now());
            if (effect.id === selfIdRef.current) shakeRef.current = Math.min(shakeRef.current + 3, 8);
        });

        socket.on('player_defeated', (result) => {
            setMatchResult(result);
            shakeRef.current = 16;
        });

        socket.on('chat_message', (msg) => setMessages((prev) => [...prev.slice(-4), msg]));
        socket.on('disconnect', () => setConnected(false));

        const handleKeyDown = (e) => {
            let changed = false;
            if (e.code === 'KeyW' || e.code === 'ArrowUp') { keysPressed.current.up = true; changed = true; }
            if (e.code === 'KeyS' || e.code === 'ArrowDown') { keysPressed.current.down = true; changed = true; }
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') { keysPressed.current.left = true; changed = true; }
            if (e.code === 'KeyD' || e.code === 'ArrowRight') { keysPressed.current.right = true; changed = true; }
            if (e.code === 'Space') { e.preventDefault(); handleAttack(); }
            if (changed) sendInputUpdate();
        };

        const handleKeyUp = (e) => {
            let changed = false;
            if (e.code === 'KeyW' || e.code === 'ArrowUp') { keysPressed.current.up = false; changed = true; }
            if (e.code === 'KeyS' || e.code === 'ArrowDown') { keysPressed.current.down = false; changed = true; }
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') { keysPressed.current.left = false; changed = true; }
            if (e.code === 'KeyD' || e.code === 'ArrowRight') { keysPressed.current.right = false; changed = true; }
            if (changed) sendInputUpdate();
        };

        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            angleRef.current = Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2);
            sendInputUpdate();
        };

        const handleMouseDown = (e) => { if (e.button === 0) handleAttack(); };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);

        // HUD ticker — keeps React renders cheap while the canvas runs at 60 FPS
        const hudTimer = setInterval(() => {
            const state = stateRef.current;
            const me = state.players?.find((p) => p.id === selfIdRef.current);
            const top = [...(state.players || [])]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            setHud((prev) => ({
                name: me?.userName || prev.name,
                heroClass: me?.heroClass || prev.heroClass,
                hp: me ? Math.max(0, me.hp) : prev.hp,
                maxHp: me?.maxHp || prev.maxHp,
                kills: me?.kills ?? prev.kills,
                score: me?.score ?? prev.score,
                coins: me?.coinsEarned ?? prev.coins,
                alive: me ? !me.isDead : prev.alive,
                playersOnline: state.players?.length || 0,
                botsAlive: state.bots?.length || 0,
                top,
            }));
        }, 140);

        return () => {
            clearInterval(hudTimer);
            socket.disconnect();
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const sendInputUpdate = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('player_input', { keys: keysPressed.current, angle: angleRef.current });
    };

    const handleAttack = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('player_attack', {});
        if (selfIdRef.current) attacksRef.current.set(selfIdRef.current, performance.now());
    };

    const handleLeaveArena = () => {
        if (socketRef.current) {
            socketRef.current.emit('leave_arena');
            socketRef.current.disconnect();
        }
        router.visit('/garage');
    };

    const handleRespawn = () => {
        setMatchResult(null);
        socketRef.current?.emit('join_arena', joinPayload());
    };

    /* ------------------------------------------------------------------ *
     * Canvas render loop — mounted once
     * ------------------------------------------------------------------ */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        groundRef.current = createGround();

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        const viewFor = (entity, isPlayer) => {
            const views = viewsRef.current;
            let v = views.get(entity.id);
            if (!v) {
                v = { x: entity.x, y: entity.y, angle: entity.angle, moving: false, phase: hashString(entity.id) % 100 };
                views.set(entity.id, v);
            }
            const speed = Math.hypot(entity.x - v.x, entity.y - v.y);
            v.moving = speed > 0.8;
            const k = isPlayer && entity.id === selfIdRef.current ? 0.42 : 0.28;
            v.x = lerp(v.x, entity.x, k);
            v.y = lerp(v.y, entity.y, k);
            let da = entity.angle - v.angle;
            while (da > Math.PI) da -= Math.PI * 2;
            while (da < -Math.PI) da += Math.PI * 2;
            v.angle += da * 0.35;
            return v;
        };

        const render = (now) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const state = stateRef.current || {};
            const particles = particlesRef.current;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = '#0d1b12';
            ctx.fillRect(0, 0, w, h);

            // --- camera ---
            const scale = clamp(Math.min(w / 1280, h / 720) * 1.18, 0.62, 2.1);
            const viewW = w / scale;
            const viewH = h / scale;
            const me = state.players?.find((p) => p.id === selfIdRef.current);
            const meView = me ? viewFor(me, true) : null;
            const cam = cameraRef.current;
            if (meView) {
                const aheadX = Math.cos(angleRef.current) * 55;
                const aheadY = Math.sin(angleRef.current) * 55;
                cam.x = lerp(cam.x, meView.x + aheadX, 0.12);
                cam.y = lerp(cam.y, meView.y + aheadY, 0.12);
            }
            const camX = viewW >= WORLD.width ? WORLD.width / 2 : clamp(cam.x, viewW / 2, WORLD.width - viewW / 2);
            const camY = viewH >= WORLD.height ? WORLD.height / 2 : clamp(cam.y, viewH / 2, WORLD.height - viewH / 2);

            shakeRef.current *= 0.88;
            const shake = shakeRef.current;
            const sx = (Math.random() - 0.5) * shake;
            const sy = (Math.random() - 0.5) * shake;

            ctx.save();
            ctx.translate(w / 2 + sx, h / 2 + sy);
            ctx.scale(scale, scale);
            ctx.translate(-camX, -camY);

            // --- ground ---
            if (groundRef.current) ctx.drawImage(groundRef.current, 0, 0);
            drawAnimatedDecor(ctx, now);

            // --- attack effects (under characters) ---
            effectsRef.current = effectsRef.current.filter((fx) => now - fx.start < EFFECT_MS);
            effectsRef.current.forEach((fx) => {
                const progress = (now - fx.start) / EFFECT_MS;
                if (fx.type === 'slash') drawSlash(ctx, fx, progress);
            });

            // --- entities sorted back-to-front ---
            const drawables = [];
            (state.bots || []).forEach((b) => {
                const v = viewFor(b, false);
                drawables.push({ y: v.y, kind: 'bot', e: b, v });
            });
            (state.players || []).forEach((p) => {
                if (p.isDead) return;
                const v = viewFor(p, true);
                drawables.push({ y: v.y, kind: 'player', e: p, v });
            });
            drawables.sort((a, b) => a.y - b.y);

            drawables.forEach(({ kind, e, v }) => {
                const started = attacksRef.current.get(e.id);
                const attack = started && now - started < ATTACK_MS ? (now - started) / ATTACK_MS : 0;

                if (v.moving && Math.random() > 0.72) particles.dust(v.x, v.y);

                if (kind === 'bot') {
                    drawBot(ctx, { x: v.x, y: v.y, angle: v.angle, time: now, seed: hashString(e.id), attack });
                    drawNameplate(ctx, {
                        x: v.x, y: v.y - 38, name: e.name, hp: e.hp, maxHp: e.maxHp,
                        color: '#a3e635', width: 54,
                    });
                } else {
                    const mine = e.id === selfIdRef.current;
                    drawHero(ctx, {
                        x: v.x, y: v.y, angle: v.angle, heroClass: e.heroClass, time: now,
                        moving: v.moving, isSelf: mine, attack, phase: v.phase,
                        palette: palettesRef.current?.[e.skin] || null,
                    });
                    drawNameplate(ctx, {
                        x: v.x, y: v.y - 46,
                        name: mine ? `${e.userName} (you)` : e.userName,
                        hp: e.hp, maxHp: e.maxHp,
                        color: mine ? '#4ade80' : '#fb7185',
                        mine, width: 68,
                    });
                }
            });

            // --- projectiles ---
            (state.projectiles || []).forEach((proj) => {
                drawProjectile(ctx, proj, now);
                if (Math.random() > 0.55) {
                    particles.push({
                        x: proj.x, y: proj.y, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
                        life: 1, decay: 0.08, size: 3, color: proj.color || '#7dd3fc', gravity: 0,
                    });
                }
            });

            // --- cast flashes over everything ---
            effectsRef.current.forEach((fx) => {
                if (fx.type !== 'cast') return;
                const progress = (now - fx.start) / EFFECT_MS;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = 1 - progress;
                const cx = fx.x + Math.cos(fx.angle) * 26;
                const cy = fx.y + Math.sin(fx.angle) * 26;
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 + progress * 30);
                g.addColorStop(0, fx.color || '#7dd3fc');
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(cx, cy, 40 + progress * 30, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // --- particles ---
            particles.update();
            particles.draw(ctx);

            // --- floating damage / reward text ---
            (state.damageTexts || []).forEach((t) => {
                if (!seenTextsRef.current.has(t.id)) {
                    seenTextsRef.current.add(t.id);
                    particles.burst(t.x, t.y + 16, t.color || '#ffe27a', 8, 3.4);
                }
                const alpha = clamp(t.duration / 18, 0, 1);
                const pop = t.duration > 20 ? 1.25 : 1;
                drawFloatingText(ctx, t.text, t.x, t.y, t.color || '#ffe27a', 22 * pop, alpha);
            });
            if (seenTextsRef.current.size > 600) seenTextsRef.current.clear();

            ctx.restore();

            // --- vignette ---
            const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.78);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(6,4,16,0.42)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, w, h);

            // --- minimap ---
            drawMinimap(ctx, w, h, state, meView);

            frame = requestAnimationFrame(render);
        };

        frame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frame);
        };
    }, []);

    const drawMinimap = (ctx, w, h, state, meView) => {
        const mw = 168;
        const mh = Math.round(mw * (WORLD.height / WORLD.width));
        const mx = w - mw - 20;
        const my = h - mh - 20;
        const sx = mw / WORLD.width;
        const sy = mh / WORLD.height;

        ctx.save();
        roundRect(ctx, mx, my, mw, mh, 14);
        ctx.fillStyle = 'rgba(8,10,24,0.78)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(125,211,252,0.55)';
        ctx.stroke();
        ctx.clip();

        (state.bots || []).forEach((b) => {
            ctx.beginPath();
            ctx.arc(mx + b.x * sx, my + b.y * sy, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#a3e635';
            ctx.fill();
        });
        (state.players || []).forEach((p) => {
            if (p.isDead) return;
            const mine = p.id === selfIdRef.current;
            ctx.beginPath();
            ctx.arc(mx + p.x * sx, my + p.y * sy, mine ? 4.2 : 3.2, 0, Math.PI * 2);
            ctx.fillStyle = mine ? '#fde047' : '#fb7185';
            ctx.fill();
            if (mine) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255,255,255,0.9)';
                ctx.stroke();
            }
        });
        ctx.restore();
    };

    const style = styleWithSkin(hud.heroClass, skinPalettes?.[user?.equipped_skin] || null);
    const hpPct = hud.maxHp ? clamp((hud.hp / hud.maxHp) * 100, 0, 100) : 0;

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#0d1b12] select-none">
            <Head title="Arena • Crystal Brawlers" />

            <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />

            {/* ---------------- TOP LEFT: player panel ---------------- */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 w-[300px] max-w-[calc(100vw-2rem)]">
                <div className="toon-panel p-3.5">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-2xl border-[3px] border-[#16102b] flex items-center justify-center shrink-0"
                            style={{ background: `linear-gradient(160deg, ${style.body}, ${style.bodyDark})` }}
                        >
                            <Swords className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-display text-base leading-none text-white truncate">{hud.name}</p>
                            <p className="text-[11px] font-bold uppercase tracking-wider mt-1" style={{ color: style.glow }}>
                                {style.label}
                            </p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase border-2 border-[#16102b] ${connected ? 'bg-lime-400 text-lime-950' : 'bg-rose-500 text-white'}`}>
                            {connected ? 'Live' : 'Off'}
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wide mb-1">
                            <span className="flex items-center gap-1 text-rose-300">
                                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Health
                            </span>
                            <span className="text-white">{Math.round(hud.hp)} / {hud.maxHp}</span>
                        </div>
                        <div className="h-4 rounded-full bg-[#1a1330] border-[3px] border-[#16102b] overflow-hidden p-[2px]">
                            <div
                                className="h-full rounded-full transition-all duration-200"
                                style={{
                                    width: `${hpPct}%`,
                                    background: hpPct > 45
                                        ? 'linear-gradient(90deg,#4ade80,#a3e635)'
                                        : hpPct > 20
                                            ? 'linear-gradient(90deg,#fbbf24,#fb923c)'
                                            : 'linear-gradient(90deg,#f43f5e,#fb7185)',
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <Stat label="Kills" value={hud.kills} color="text-rose-300" />
                        <Stat label="Score" value={hud.score} color="text-white" />
                        <Stat label="Coins" value={`+${hud.coins}`} color="text-amber-300" />
                    </div>
                </div>

                {messages.length > 0 && (
                    <div className="space-y-1.5">
                        {messages.map((m, idx) => (
                            <div key={idx} className="toon-chip text-[11px] text-slate-100">{m.text}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------------- TOP RIGHT: scoreboard ---------------- */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                    <div className="toon-chip flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-slate-100">
                        <Zap className="w-3.5 h-3.5 text-amber-300" /> {hud.playersOnline} players · {hud.botsAlive} mobs
                    </div>
                    <button onClick={handleLeaveArena} className="toon-btn toon-btn-ghost text-[11px] px-3 py-2">
                        <ArrowLeft className="w-4 h-4" /> Leave
                    </button>
                </div>

                {hud.top.length > 0 && (
                    <div className="toon-panel p-3 w-[220px]">
                        <p className="font-display text-xs text-amber-300 flex items-center gap-1.5 mb-2">
                            <Crown className="w-4 h-4" /> Top gladiators
                        </p>
                        <ul className="space-y-1">
                            {hud.top.map((p, i) => (
                                <li key={p.id} className={`flex items-center justify-between text-[11px] font-bold ${p.id === selfIdRef.current ? 'text-amber-300' : 'text-slate-200'}`}>
                                    <span className="truncate flex items-center gap-1.5">
                                        <span className="w-4 text-slate-500">{i + 1}.</span>{p.userName}
                                    </span>
                                    <span>{p.score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* ---------------- BOTTOM LEFT: controls ---------------- */}
            <div className="absolute bottom-5 left-4 z-20 hidden md:flex items-center gap-2 toon-chip text-[11px] font-bold text-slate-200">
                <Key>W A S D</Key> move
                <span className="text-slate-600">•</span>
                <Key>Mouse</Key> aim
                <span className="text-slate-600">•</span>
                <Key>Click / Space</Key> attack
            </div>

            {/* ---------------- DEFEAT MODAL ---------------- */}
            {matchResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0718]/85 backdrop-blur-md">
                    <div className="toon-panel max-w-md w-full p-8 text-center space-y-5 animate-pop">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 border-[4px] border-[#16102b] flex items-center justify-center -mt-16 shadow-xl">
                            <Skull className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="font-display text-3xl text-white">Defeated!</h2>
                            <p className="text-xs text-slate-300 mt-1">
                                Taken down by <strong className="text-rose-300">{matchResult.killerName}</strong>
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Stat label="Kills" value={matchResult.kills} color="text-rose-300" big />
                            <Stat label="Score" value={matchResult.score} color="text-white" big />
                            <Stat label="Coins" value={`+${matchResult.coinsEarned}`} color="text-amber-300" big />
                        </div>

                        <p className="text-[11px] font-bold text-lime-300 flex items-center justify-center gap-1.5">
                            <Coins className="w-4 h-4" /> {matchResult.coinsEarned} gold added to your wallet
                        </p>

                        <div className="flex gap-3 pt-1">
                            <button onClick={handleRespawn} className="toon-btn toon-btn-primary flex-1 justify-center">
                                <RotateCcw className="w-4 h-4" /> Respawn
                            </button>
                            <button onClick={handleLeaveArena} className="toon-btn toon-btn-ghost flex-1 justify-center">
                                Garage
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({ label, value, color, big = false }) {
    return (
        <div className="rounded-xl bg-[#1a1330] border-[3px] border-[#16102b] py-1.5 text-center">
            <p className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">{label}</p>
            <p className={`font-display ${big ? 'text-xl' : 'text-base'} leading-tight ${color}`}>{value}</p>
        </div>
    );
}

function Key({ children }) {
    return (
        <kbd className="px-2 py-0.5 rounded-md bg-[#1a1330] border-2 border-[#16102b] text-cyan-200 font-extrabold text-[10px] uppercase">
            {children}
        </kbd>
    );
}
