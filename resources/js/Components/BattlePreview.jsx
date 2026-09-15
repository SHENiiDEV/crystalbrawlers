import React, { useEffect, useRef } from 'react';
import {
    drawHero, drawBot, drawProjectile, drawSlash, drawFloatingText, drawNameplate,
    Particles, OUTLINE, roundRect, clamp, mulberry32,
} from '../game/toon';

const W = 760;
const H = 440;

/** A looping, self-contained toon skirmish — the exact renderer the arena uses. */
export default function BattlePreview({ className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        const particles = new Particles(260);
        let frame;

        const ground = document.createElement('canvas');
        ground.width = W; ground.height = H;
        (function paintGround() {
            const g = ground.getContext('2d');
            const rand = mulberry32(4242);
            const TILE = 76;
            for (let y = 0; y < H; y += TILE) {
                for (let x = 0; x < W; x += TILE) {
                    g.fillStyle = ((x / TILE) + (y / TILE)) % 2 === 0 ? '#4fa83d' : '#57b544';
                    g.fillRect(x, y, TILE, TILE);
                }
            }
            for (let i = 0; i < 700; i++) {
                g.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                g.fillRect(rand() * W, rand() * H, 2 + rand() * 4, 2 + rand() * 4);
            }
            // sandy plaza
            g.beginPath();
            g.arc(W / 2, H / 2 + 10, 190, 0, Math.PI * 2);
            g.fillStyle = '#d1a95c'; g.fill();
            g.beginPath();
            g.arc(W / 2, H / 2 + 10, 176, 0, Math.PI * 2);
            g.fillStyle = '#e8c37a'; g.fill();
            g.beginPath();
            g.arc(W / 2, H / 2 + 10, 96, 0, Math.PI * 2);
            g.lineWidth = 7; g.strokeStyle = 'rgba(93,200,255,0.5)'; g.stroke();
            // bushes
            [[70, 90], [690, 120], [120, 370], [660, 350]].forEach(([bx, by]) => {
                g.beginPath();
                g.moveTo(bx + 2, by); g.arc(bx - 14, by, 16, 0, Math.PI * 2);
                g.moveTo(bx + 28, by + 2); g.arc(bx + 14, by + 2, 14, 0, Math.PI * 2);
                g.moveTo(bx + 19, by - 9); g.arc(bx, by - 9, 19, 0, Math.PI * 2);
                g.fillStyle = '#236b2b'; g.fill();
                g.lineWidth = 4; g.lineJoin = 'round'; g.strokeStyle = OUTLINE; g.stroke();
            });
            g.lineWidth = 26; g.strokeStyle = '#5f6479'; g.strokeRect(0, 0, W, H);
            g.lineWidth = 14; g.strokeStyle = '#8d93a8'; g.strokeRect(0, 0, W, H);
        })();

        const actors = [
            { kind: 'hero', heroClass: 'knight', name: 'Ragnar', x: 250, y: 250, hp: 220, maxHp: 220, t: 0, speed: 1.5, ranged: false },
            { kind: 'hero', heroClass: 'mage', name: 'Elowen', x: 540, y: 180, hp: 100, maxHp: 100, t: 2, speed: 1.2, ranged: true },
            { kind: 'hero', heroClass: 'berserker', name: 'Kraven', x: 430, y: 330, hp: 190, maxHp: 190, t: 4, speed: 1.3, ranged: false },
            { kind: 'bot', name: 'Goblin', x: 160, y: 160, hp: 75, maxHp: 75, t: 1, speed: 1.1, seed: 11 },
            { kind: 'bot', name: 'Troll', x: 620, y: 320, hp: 75, maxHp: 75, t: 3, speed: 1.0, seed: 27 },
        ];
        actors.forEach((a) => {
            a.angle = Math.random() * Math.PI * 2;
            a.attackAt = performance.now() + 700 + Math.random() * 2200;
            a.attack = 0;
            a.phase = Math.random() * 100;
            a.homeX = a.x; a.homeY = a.y;
        });

        const slashes = [];
        const shots = [];
        const texts = [];

        const loop = (now) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.drawImage(ground, 0, 0);

            // --- movement: lazy orbits around a home point ---
            actors.forEach((a, i) => {
                const r = 60 + i * 12;
                const speed = 0.00042 * a.speed * 1000 * 0.001;
                a.t += speed;
                const nx = a.homeX + Math.cos(a.t + i) * r;
                const ny = a.homeY + Math.sin(a.t * 1.3 + i) * r * 0.55;
                a.angle = Math.atan2(ny - a.y, nx - a.x);
                a.moving = Math.hypot(nx - a.x, ny - a.y) > 0.6;
                a.x = clamp(nx, 60, W - 60);
                a.y = clamp(ny, 70, H - 40);
                if (a.moving && Math.random() > 0.8) particles.dust(a.x, a.y);

                if (now > a.attackAt) {
                    const p = (now - a.attackAt) / 320;
                    if (p >= 1) {
                        a.attack = 0;
                        a.attackAt = now + 1400 + Math.random() * 1800;
                    } else {
                        if (a.attack === 0) {
                            // fire once at the start of the swing
                            const target = actors[(i + 2) % actors.length];
                            a.angle = Math.atan2(target.y - a.y, target.x - a.x);
                            if (a.ranged) {
                                shots.push({
                                    x: a.x, y: a.y, id: Math.random(),
                                    vx: Math.cos(a.angle) * 5.2, vy: Math.sin(a.angle) * 5.2,
                                    heroClass: a.heroClass, life: 90, tx: target,
                                });
                            } else {
                                slashes.push({ x: a.x, y: a.y, angle: a.angle, range: 95, color: '#ffffff', start: now });
                                if (Math.hypot(target.x - a.x, target.y - a.y) < 150) {
                                    const dmg = 12 + Math.floor(Math.random() * 20);
                                    texts.push({ x: target.x, y: target.y - 34, text: `-${dmg}`, color: '#ffe27a', life: 42 });
                                    particles.burst(target.x, target.y - 10, '#ffe27a', 9, 3.4);
                                }
                            }
                        }
                        a.attack = Math.max(p, 0.01);
                    }
                }
            });

            // --- slashes ---
            for (let i = slashes.length - 1; i >= 0; i--) {
                const p = (now - slashes[i].start) / 260;
                if (p >= 1) { slashes.splice(i, 1); continue; }
                drawSlash(ctx, slashes[i], p);
            }

            // --- entities ---
            [...actors].sort((a, b) => a.y - b.y).forEach((a) => {
                if (a.kind === 'bot') {
                    drawBot(ctx, { x: a.x, y: a.y, angle: a.angle, time: now, seed: a.seed, attack: a.attack, scale: 1.15 });
                    drawNameplate(ctx, { x: a.x, y: a.y - 36, name: a.name, hp: a.hp, maxHp: a.maxHp, color: '#a3e635', width: 52 });
                } else {
                    drawHero(ctx, {
                        x: a.x, y: a.y, angle: a.angle, heroClass: a.heroClass, time: now,
                        moving: a.moving, attack: a.attack, phase: a.phase, scale: 1.15,
                    });
                    drawNameplate(ctx, { x: a.x, y: a.y - 46, name: a.name, hp: a.hp, maxHp: a.maxHp, color: '#fb7185', width: 66 });
                }
            });

            // --- projectiles ---
            for (let i = shots.length - 1; i >= 0; i--) {
                const s = shots[i];
                s.x += s.vx; s.y += s.vy; s.life -= 1;
                drawProjectile(ctx, s, now);
                const hit = Math.hypot(s.x - s.tx.x, s.y - s.tx.y) < 26;
                if (hit || s.life <= 0 || s.x < 20 || s.x > W - 20 || s.y < 20 || s.y > H - 20) {
                    if (hit) {
                        const dmg = 18 + Math.floor(Math.random() * 22);
                        texts.push({ x: s.tx.x, y: s.tx.y - 34, text: `-${dmg}`, color: '#7dd3fc', life: 42 });
                        particles.burst(s.x, s.y, '#7dd3fc', 12, 4);
                    }
                    shots.splice(i, 1);
                }
            }

            particles.update();
            particles.draw(ctx);

            for (let i = texts.length - 1; i >= 0; i--) {
                const t = texts[i];
                t.y -= 0.7; t.life -= 1;
                if (t.life <= 0) { texts.splice(i, 1); continue; }
                drawFloatingText(ctx, t.text, t.x, t.y, t.color, 22, clamp(t.life / 22, 0, 1));
            }

            // soft vignette so the frame reads as a screen
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.55, W / 2, H / 2, W * 0.8);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(10,6,26,0.28)');
            ctx.fillStyle = vg;
            roundRect(ctx, 0, 0, W, H, 8);
            ctx.fill();

            frame = requestAnimationFrame(loop);
        };

        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, []);

    return <canvas ref={ref} className={className} style={{ width: '100%', height: 'auto', display: 'block' }} />;
}
