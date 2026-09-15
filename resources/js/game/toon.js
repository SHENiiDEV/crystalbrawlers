/**
 * Crystal Brawlers — toon canvas renderer.
 * Shared by the live Arena screen and the landing page battle preview.
 * Everything is drawn procedurally: no sprite sheets, no external assets.
 */

export const OUTLINE = '#16102b';
export const WORLD = { width: 2400, height: 1600 };

/* ------------------------------------------------------------------ *
 * Class visual identity
 * ------------------------------------------------------------------ */
export const CLASS_STYLE = {
    knight: {
        label: 'Knight',
        body: '#4aa8ff', bodyDark: '#1f5fd0', trim: '#ffd25e',
        cape: '#ff5470', hair: '#f6d365', weapon: 'sword', glow: '#7dd3fc', blade: '#e6f4ff',
    },
    rogue: {
        label: 'Rogue',
        body: '#b45cff', bodyDark: '#6b21cc', trim: '#ffe27a',
        cape: '#3b0f6b', hair: '#2b1055', weapon: 'daggers', glow: '#e879f9', blade: '#f0abfc',
    },
    mage: {
        label: 'Mage',
        body: '#2fd4a4', bodyDark: '#11836a', trim: '#7df9ff',
        cape: '#0f766e', hair: '#d9f99d', weapon: 'staff', glow: '#5eead4', blade: '#a7f3d0',
    },
    hunter: {
        label: 'Hunter',
        body: '#ffb02e', bodyDark: '#c96a10', trim: '#fff1a8',
        cape: '#7c4a03', hair: '#7c2d12', weapon: 'bow', glow: '#fcd34d', blade: '#fde68a',
    },
    berserker: {
        label: 'Berserker',
        body: '#ff5a48', bodyDark: '#a81d16', trim: '#ffd25e',
        cape: '#7f1d1d', hair: '#fb923c', weapon: 'axe', glow: '#fca5a5', blade: '#d7dfe8',
    },
    cleric: {
        label: 'Cleric',
        body: '#5ec8ff', bodyDark: '#2472c8', trim: '#fff4c2',
        cape: '#1e3a8a', hair: '#fde68a', weapon: 'mace', glow: '#bae6fd', blade: '#cbd5e1',
    },
};

export const styleFor = (heroClass) => CLASS_STYLE[(heroClass || 'knight').toLowerCase()] || CLASS_STYLE.knight;

/**
 * Merge a skin palette (as stored on the skins table) over the base class look.
 * The weapon SHAPE always comes from the class; the skin only repaints it.
 */
export function styleWithSkin(heroClass, palette) {
    const base = styleFor(heroClass);
    if (!palette) return base;
    return {
        ...base,
        body: palette.body || base.body,
        bodyDark: palette.dark || base.bodyDark,
        trim: palette.trim || base.trim,
        cape: palette.cape || base.cape,
        hair: palette.hair || base.hair,
        glow: palette.glow || base.glow,
        blade: palette.blade || base.blade,
        aura: !!palette.aura,
    };
}

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
        h ^= String(str).charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

export function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}

function ink(ctx, fill, lw = 3) {
    ctx.fillStyle = fill;
    ctx.fill();
    if (lw > 0) {
        ctx.lineWidth = lw;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = OUTLINE;
        ctx.stroke();
    }
}

export function dropShadow(ctx, x, y, rx, ry, alpha = 0.28) {
    ctx.save();
    ctx.fillStyle = `rgba(10, 8, 22, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Weapons — always drawn pointing along +X, origin at the fist
 * ------------------------------------------------------------------ */
function drawWeapon(ctx, kind, st, charge = 0) {
    switch (kind) {
        case 'sword':
            ctx.save();
            roundRect(ctx, -4, -3.5, 10, 7, 3);
            ink(ctx, '#8b5a2b', 2.4);
            ctx.beginPath();
            ctx.moveTo(6, -9); ctx.lineTo(9, -9); ctx.lineTo(9, 9); ctx.lineTo(6, 9);
            ctx.closePath();
            ink(ctx, st.trim, 2.4);
            ctx.beginPath();
            ctx.moveTo(9, -5); ctx.lineTo(34, -3.2); ctx.lineTo(41, 0); ctx.lineTo(34, 3.2); ctx.lineTo(9, 5);
            ctx.closePath();
            ink(ctx, st.blade || '#e6f4ff', 2.8);
            ctx.beginPath();
            ctx.moveTo(12, -2.4); ctx.lineTo(33, -1.4);
            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.lineWidth = 2; ctx.stroke();
            ctx.restore();
            break;
        case 'axe':
            roundRect(ctx, -6, -3.5, 36, 7, 3.5);
            ink(ctx, '#8b5a2b', 2.6);
            ctx.beginPath();
            ctx.moveTo(20, -7);
            ctx.lineTo(38, -19);
            ctx.quadraticCurveTo(47, 0, 38, 19);
            ctx.lineTo(20, 7);
            ctx.quadraticCurveTo(26, 0, 20, -7);
            ctx.closePath();
            ink(ctx, st.blade || '#d7dfe8', 3);
            ctx.beginPath();
            ctx.moveTo(34, -15); ctx.quadraticCurveTo(42, 0, 34, 15);
            ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2.4; ctx.stroke();
            break;
        case 'staff':
            roundRect(ctx, -6, -3, 34, 6, 3);
            ink(ctx, '#6b4423', 2.6);
            ctx.beginPath();
            ctx.arc(34, 0, 9 + charge * 3, 0, Math.PI * 2);
            ink(ctx, st.glow, 2.8);
            ctx.beginPath();
            ctx.arc(31.5, -2.5, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
            break;
        case 'bow':
            ctx.beginPath();
            ctx.arc(10, 0, 18, -Math.PI * 0.62, Math.PI * 0.62);
            ctx.lineWidth = 5.5; ctx.strokeStyle = OUTLINE; ctx.stroke();
            ctx.lineWidth = 3; ctx.strokeStyle = '#a16207'; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(10 + 18 * Math.cos(-Math.PI * 0.62), 18 * Math.sin(-Math.PI * 0.62));
            ctx.lineTo(4 - charge * 6, 0);
            ctx.lineTo(10 + 18 * Math.cos(Math.PI * 0.62), 18 * Math.sin(Math.PI * 0.62));
            ctx.lineWidth = 1.8; ctx.strokeStyle = '#f8fafc'; ctx.stroke();
            break;
        case 'daggers':
            roundRect(ctx, -4, -3, 11, 6, 3);
            ink(ctx, '#3b0764', 2.4);
            ctx.beginPath();
            ctx.moveTo(7, -6.5); ctx.lineTo(26, -4); ctx.lineTo(34, 0); ctx.lineTo(26, 4); ctx.lineTo(7, 6.5);
            ctx.closePath();
            ink(ctx, st.blade || '#f0abfc', 2.8);
            ctx.beginPath();
            ctx.moveTo(10, -3); ctx.lineTo(25, -1.6);
            ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.8; ctx.stroke();
            break;
        case 'mace':
            roundRect(ctx, -5, -3, 26, 6, 3);
            ink(ctx, '#7c4a03', 2.4);
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(26 + Math.cos(a) * 7, Math.sin(a) * 7);
                ctx.lineTo(26 + Math.cos(a) * 14, Math.sin(a) * 14);
                ctx.lineWidth = 5; ctx.lineCap = 'round';
                ctx.strokeStyle = OUTLINE; ctx.stroke();
                ctx.lineWidth = 2.6; ctx.strokeStyle = '#94a3b8'; ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(26, 0, 9, 0, Math.PI * 2);
            ink(ctx, st.blade || '#cbd5e1', 2.8);
            ctx.beginPath();
            ctx.arc(23.5, -2.5, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
            break;
        default:
            break;
    }
}

/* ------------------------------------------------------------------ *
 * Hero sprite
 * ------------------------------------------------------------------ */
export function drawHero(ctx, o) {
    const {
        x, y, angle = 0, heroClass = 'knight', time = 0, moving = false,
        isSelf = false, attack = 0, scale = 1, phase = 0, dead = false, palette = null,
    } = o;
    if (dead) return;

    const st = styleWithSkin(heroClass, palette);
    const face = Math.cos(angle) >= 0 ? 1 : -1;
    const stride = moving ? Math.sin(time * 0.016 + phase) : Math.sin(time * 0.004 + phase) * 0.35;
    const bob = moving ? Math.abs(Math.sin(time * 0.016 + phase)) * 4 : Math.sin(time * 0.004 + phase) * 2;
    const squash = moving ? 1 + Math.sin(time * 0.032 + phase) * 0.035 : 1;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    dropShadow(ctx, 0, 20, 20 - bob * 0.25, 8 - bob * 0.12, 0.38);

    // Legendary skins glow and throw off sparks
    if (st.aura) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const halo = ctx.createRadialGradient(0, -6, 4, 0, -6, 46);
        halo.addColorStop(0, `${st.glow}66`);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, -6, 46, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 4; i++) {
            const a = time * 0.0016 + (i / 4) * Math.PI * 2 + phase;
            const r = 30 + Math.sin(time * 0.004 + i) * 4;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * r, -6 + Math.sin(a) * r * 0.45, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = st.trim;
            ctx.fill();
        }
        ctx.restore();
    }

    if (isSelf) {
        ctx.save();
        const pulse = 1 + Math.sin(time * 0.006) * 0.06;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.ellipse(0, 20, 27 * pulse, 10 * pulse, 0, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = st.glow;
        ctx.stroke();
        ctx.restore();
    }

    ctx.translate(0, -bob);

    // Back arm + weapon when the hero aims away from the camera
    const weaponBehind = Math.sin(angle) < -0.15;
    const swing = attack > 0 ? Math.sin(attack * Math.PI) : 0;

    const paintOffHand = () => {
        ctx.save();
        ctx.rotate(angle + 0.9);
        // arm
        roundRect(ctx, 4, -1, 15, 8.5, 4.2);
        ink(ctx, st.bodyDark, 2.8);
        if (st.weapon === 'sword') {
            ctx.translate(22, -4);
            ctx.beginPath();
            ctx.moveTo(-9, -15);
            ctx.lineTo(9, -13);
            ctx.quadraticCurveTo(15, 0, 7, 16);
            ctx.lineTo(-9, 15);
            ctx.closePath();
            ink(ctx, st.bodyDark, 3.2);
            ctx.beginPath();
            ctx.moveTo(-4, -9); ctx.lineTo(6, -8); ctx.quadraticCurveTo(9, 0, 4, 9); ctx.lineTo(-4, 9);
            ctx.closePath();
            ink(ctx, st.body, 2.2);
            ctx.beginPath();
            ctx.arc(1, 0, 4.5, 0, Math.PI * 2);
            ink(ctx, st.trim, 2.2);
        } else {
            ctx.beginPath();
            ctx.arc(21, 0, 5, 0, Math.PI * 2);
            ink(ctx, '#ffd9b0', 2.4);
        }
        ctx.restore();
    };

    const paintWeapon = () => {
        ctx.save();
        ctx.rotate(angle - 0.5 + swing * 1.5);
        // arm
        roundRect(ctx, 3, 0, 16, 8.5, 4.2);
        ink(ctx, st.body, 2.8);
        // fist
        ctx.beginPath();
        ctx.arc(18, 4.2, 5, 0, Math.PI * 2);
        ink(ctx, '#ffd9b0', 2.4);
        ctx.translate(16, 4);
        drawWeapon(ctx, st.weapon, st, attack > 0 ? 1 - attack : 0);
        ctx.restore();
    };

    if (weaponBehind) paintWeapon();

    // Cape
    ctx.save();
    ctx.scale(face, 1);
    ctx.beginPath();
    ctx.moveTo(-3, -8);
    ctx.quadraticCurveTo(-20 - stride * 3, 0, -13 - stride * 4, 20);
    ctx.quadraticCurveTo(-4, 15, 3, 18);
    ctx.closePath();
    ink(ctx, st.cape, 3);
    ctx.restore();

    // Legs
    ctx.save();
    ctx.scale(face, 1);
    roundRect(ctx, -9, 8 + stride * 2.5, 8, 13, 4);
    ink(ctx, st.bodyDark, 3);
    roundRect(ctx, 1, 8 - stride * 2.5, 8, 13, 4);
    ink(ctx, st.bodyDark, 3);
    ctx.restore();

    // Torso
    ctx.save();
    ctx.scale(face * squash, 1 / squash);
    const grad = ctx.createLinearGradient(0, -14, 0, 14);
    grad.addColorStop(0, st.body);
    grad.addColorStop(1, st.bodyDark);
    roundRect(ctx, -13, -12, 26, 25, 10);
    ink(ctx, grad, 3.4);
    // chest emblem
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(6, 0); ctx.lineTo(0, 7); ctx.lineTo(-6, 0);
    ctx.closePath();
    ink(ctx, st.trim, 2.2);
    ctx.restore();

    paintOffHand();

    // Head
    ctx.save();
    ctx.scale(face, 1);
    ctx.translate(0, -22);
    ctx.beginPath();
    ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
    ink(ctx, '#ffd9b0', 3.4);
    // hair / hood cap
    ctx.beginPath();
    ctx.arc(0, -1.5, 13.5, Math.PI * 1.02, Math.PI * 2.02);
    ctx.lineTo(12, 1);
    ctx.quadraticCurveTo(0, -6, -12, 1);
    ctx.closePath();
    ink(ctx, st.hair, 3);
    // eyes
    ctx.beginPath();
    ctx.ellipse(4.5, 2.5, 3.4, 4.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = OUTLINE; ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-3.5, 2.5, 3.2, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = OUTLINE; ctx.stroke();
    const lookX = clamp(Math.cos(angle) * face * 1.6, -1.6, 1.6);
    const lookY = clamp(Math.sin(angle) * 1.6, -1.6, 1.6);
    ctx.beginPath();
    ctx.arc(4.5 + lookX, 2.6 + lookY, 1.9, 0, Math.PI * 2);
    ctx.arc(-3.5 + lookX, 2.6 + lookY, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = OUTLINE; ctx.fill();

    // class headgear
    if (st.weapon === 'staff') {
        ctx.beginPath();
        ctx.moveTo(-15, -6); ctx.lineTo(0, -30); ctx.lineTo(15, -6);
        ctx.closePath();
        ink(ctx, st.bodyDark, 3);
        ctx.beginPath();
        ctx.arc(0, -30, 3.4, 0, Math.PI * 2);
        ink(ctx, st.trim, 2);
    } else if (st.weapon === 'sword') {
        roundRect(ctx, -14, -12, 28, 9, 4);
        ink(ctx, '#cbd5e1', 3);
        ctx.beginPath();
        ctx.moveTo(-3, -12); ctx.quadraticCurveTo(0, -26, 9, -22);
        ctx.quadraticCurveTo(4, -14, 3, -12);
        ctx.closePath();
        ink(ctx, '#ff5470', 2.6);
    } else if (st.weapon === 'axe') {
        roundRect(ctx, -14, -11, 28, 8, 4);
        ink(ctx, '#7f1d1d', 3);
        ctx.beginPath();
        ctx.moveTo(-12, -9); ctx.quadraticCurveTo(-22, -22, -8, -20);
        ctx.closePath();
        ink(ctx, '#fde68a', 2.4);
        ctx.beginPath();
        ctx.moveTo(12, -9); ctx.quadraticCurveTo(22, -22, 8, -20);
        ctx.closePath();
        ink(ctx, '#fde68a', 2.4);
    } else if (st.weapon === 'daggers') {
        ctx.beginPath();
        ctx.moveTo(-14, -2); ctx.quadraticCurveTo(0, -24, 14, -2);
        ctx.quadraticCurveTo(0, -12, -14, -2);
        ctx.closePath();
        ink(ctx, st.cape, 3);
    } else if (st.weapon === 'mace') {
        ctx.beginPath();
        ctx.ellipse(0, -20, 10, 3.4, 0, 0, Math.PI * 2);
        ctx.lineWidth = 2.6; ctx.strokeStyle = st.trim; ctx.stroke();
    } else if (st.weapon === 'bow') {
        roundRect(ctx, -14, -13, 28, 8, 4);
        ink(ctx, '#166534', 3);
        ctx.beginPath();
        ctx.moveTo(6, -13); ctx.quadraticCurveTo(16, -26, 18, -12);
        ctx.closePath();
        ink(ctx, '#fca5a5', 2.2);
    }
    ctx.restore();

    if (!weaponBehind) paintWeapon();

    ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Bot sprite — goblin grunts
 * ------------------------------------------------------------------ */
export function drawBot(ctx, o) {
    const { x, y, angle = 0, time = 0, scale = 1, seed = 1, attack = 0 } = o;
    const rand = mulberry32(seed);
    const hue = 95 + Math.floor(rand() * 60);
    const body = `hsl(${hue}, 55%, 46%)`;
    const bodyDark = `hsl(${hue}, 58%, 32%)`;
    const face = Math.cos(angle) >= 0 ? 1 : -1;
    const phase = seed % 10;
    const bob = Math.abs(Math.sin(time * 0.012 + phase)) * 3;
    const swing = attack > 0 ? Math.sin(attack * Math.PI) : 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    dropShadow(ctx, 0, 17, 16, 6, 0.3);
    ctx.translate(0, -bob);
    ctx.scale(face, 1);

    // club
    ctx.save();
    ctx.rotate(-0.4 + swing * 1.4);
    roundRect(ctx, 8, -3, 22, 6, 3);
    ink(ctx, '#7c4a03', 2.4);
    ctx.beginPath();
    ctx.arc(31, 0, 7, 0, Math.PI * 2);
    ink(ctx, '#92400e', 2.4);
    ctx.restore();

    // legs
    roundRect(ctx, -8, 6, 7, 11, 3.5);
    ink(ctx, bodyDark, 2.8);
    roundRect(ctx, 1, 6, 7, 11, 3.5);
    ink(ctx, bodyDark, 2.8);

    // body
    roundRect(ctx, -11, -10, 22, 20, 9);
    ink(ctx, body, 3.2);
    roundRect(ctx, -7, -2, 14, 9, 4);
    ink(ctx, 'rgba(0,0,0,0.18)', 0);

    // head
    ctx.save();
    ctx.translate(0, -18);
    ctx.beginPath();
    ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
    ink(ctx, body, 3.2);
    // ears
    ctx.beginPath();
    ctx.moveTo(-9, -2); ctx.lineTo(-20, -8); ctx.lineTo(-8, 4);
    ctx.closePath();
    ink(ctx, bodyDark, 2.6);
    ctx.beginPath();
    ctx.moveTo(9, -2); ctx.lineTo(20, -8); ctx.lineTo(8, 4);
    ctx.closePath();
    ink(ctx, bodyDark, 2.6);
    // angry eyes
    ctx.beginPath();
    ctx.ellipse(4, 1, 3, 3.4, 0, 0, Math.PI * 2);
    ctx.ellipse(-4, 1, 3, 3.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = OUTLINE; ctx.stroke();
    ctx.beginPath();
    ctx.arc(4.6, 1.4, 1.5, 0, Math.PI * 2);
    ctx.arc(-3.4, 1.4, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = OUTLINE; ctx.fill();
    // brow
    ctx.beginPath();
    ctx.moveTo(-8, -4); ctx.lineTo(-1, -1.5);
    ctx.moveTo(8, -4); ctx.lineTo(1, -1.5);
    ctx.lineWidth = 2.2; ctx.strokeStyle = OUTLINE; ctx.stroke();
    // tusks
    ctx.beginPath();
    ctx.moveTo(-3.5, 7); ctx.lineTo(-2, 11); ctx.lineTo(-0.5, 7);
    ctx.closePath();
    ink(ctx, '#fff7ed', 1.6);
    ctx.beginPath();
    ctx.moveTo(3.5, 7); ctx.lineTo(2, 11); ctx.lineTo(0.5, 7);
    ctx.closePath();
    ink(ctx, '#fff7ed', 1.6);
    ctx.restore();

    ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Projectiles, slashes, floating text
 * ------------------------------------------------------------------ */
export function drawProjectile(ctx, p, time) {
    const st = styleFor(p.heroClass);
    const color = p.color || st.glow;
    const pulse = 1 + Math.sin(time * 0.02 + (p.id || 0)) * 0.12;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22 * pulse);
    g.addColorStop(0, color);
    g.addColorStop(0.35, `${color}88`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 22 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(0, 0, 7 * pulse, 0, Math.PI * 2);
    ink(ctx, '#ffffff', 2.4);
    ctx.beginPath();
    ctx.arc(0, 0, 4 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
}

export function drawSlash(ctx, fx, progress) {
    const range = (fx.range || 90) * 0.85;
    const color = fx.color || '#ffffff';
    const spread = Math.PI / 2.1;

    ctx.save();
    ctx.translate(fx.x, fx.y);
    ctx.rotate(fx.angle);
    ctx.globalAlpha = (1 - progress) * 0.9;
    ctx.globalCompositeOperation = 'lighter';

    const start = -spread / 2 + progress * spread * 0.55;
    ctx.beginPath();
    ctx.arc(0, 0, range, start, start + spread * 0.7);
    ctx.arc(0, 0, range * 0.45, start + spread * 0.7, start, true);
    ctx.closePath();
    const g = ctx.createRadialGradient(0, 0, range * 0.4, 0, 0, range);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.6, `${color}aa`);
    g.addColorStop(1, 'rgba(255,255,255,0.95)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
}

export function drawFloatingText(ctx, text, x, y, color = '#ffe27a', size = 22, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = `800 ${size}px Fredoka, Rajdhani, sans-serif`;
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = OUTLINE;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
}

export function drawNameplate(ctx, o) {
    const { x, y, name, hp, maxHp, color = '#4aa8ff', mine = false, width = 62 } = o;
    const pct = clamp(maxHp ? hp / maxHp : 0, 0, 1);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 13px Fredoka, Rajdhani, sans-serif';
    ctx.lineWidth = 4.5;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = OUTLINE;
    ctx.strokeText(name, x, y - 14);
    ctx.fillStyle = mine ? '#fde68a' : '#ffffff';
    ctx.fillText(name, x, y - 14);

    roundRect(ctx, x - width / 2, y - 8, width, 9, 4.5);
    ink(ctx, 'rgba(12,10,26,0.85)', 2.4);
    if (pct > 0) {
        roundRect(ctx, x - width / 2 + 2, y - 6, (width - 4) * pct, 5, 2.5);
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Particles
 * ------------------------------------------------------------------ */
export class Particles {
    constructor(limit = 400) {
        this.items = [];
        this.limit = limit;
    }

    push(p) {
        if (this.items.length > this.limit) this.items.shift();
        this.items.push(p);
    }

    burst(x, y, color, count = 10, power = 4) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = power * (0.4 + Math.random());
            this.push({
                x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1,
                life: 1, decay: 0.03 + Math.random() * 0.03,
                size: 2 + Math.random() * 4, color, gravity: 0.16,
            });
        }
    }

    dust(x, y) {
        this.push({
            x: x + (Math.random() - 0.5) * 10, y: y + 16,
            vx: (Math.random() - 0.5) * 0.8, vy: -0.4 - Math.random() * 0.5,
            life: 1, decay: 0.05, size: 3 + Math.random() * 3,
            color: 'rgba(255,255,255,0.55)', gravity: -0.02,
        });
    }

    update() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const p = this.items[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.96;
            p.life -= p.decay;
            if (p.life <= 0) this.items.splice(i, 1);
        }
    }

    draw(ctx) {
        ctx.save();
        for (const p of this.items) {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
