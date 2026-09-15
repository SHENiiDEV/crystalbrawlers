/**
 * Toon arena map — a pre-rendered ground layer plus animated top-layer decor.
 */
import { OUTLINE, WORLD, mulberry32, roundRect, dropShadow } from './toon';

const GRASS_A = '#4fa83d';
const GRASS_B = '#57b544';
const GRASS_EDGE = '#3c8a2e';
const SAND = '#e8c37a';
const SAND_DARK = '#d1a95c';
const STONE = '#8d93a8';
const STONE_DARK = '#5f6479';

export const LAKE = { x: 150, y: 820, w: 620, h: 540, r: 90 };
export const PLAZA = { x: 900, y: 560, r: 300 };

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

/* Deterministic decor so every client sees the same arena */
export function buildProps() {
    const rand = mulberry32(20260915);
    const props = [];
    const fixed = [
        ['bush', 320, 260], ['bush', 430, 205], ['tree', 700, 240], ['tree', 1850, 330],
        ['tree', 2160, 900], ['tree', 380, 1420], ['tree', 1500, 1480], ['tree', 120, 420],
        ['rock', 1180, 300], ['rock', 1950, 1250], ['rock', 640, 1180],
        ['crate', 980, 720], ['crate', 1030, 760], ['barrel', 520, 1120], ['barrel', 556, 1148],
        ['torch', 620, 560], ['torch', 1180, 560], ['torch', 620, 1000], ['torch', 1180, 1000],
        ['crystal', 1500, 820], ['crystal', 2120, 460], ['crystal', 260, 640],
        ['banner', 900, 180], ['banner', 1500, 180],
    ];
    fixed.forEach(([type, x, y]) => props.push({ type, x, y, seed: Math.floor(rand() * 1e6) }));

    for (let i = 0; i < 46; i++) {
        const x = 90 + rand() * (WORLD.width - 180);
        const y = 90 + rand() * (WORLD.height - 180);
        const inLake = x > LAKE.x - 40 && x < LAKE.x + LAKE.w + 40 && y > LAKE.y - 40 && y < LAKE.y + LAKE.h + 40;
        if (inLake) continue;
        props.push({ type: rand() > 0.45 ? 'tuft' : 'flower', x, y, seed: Math.floor(rand() * 1e6) });
    }
    return props.sort((a, b) => a.y - b.y);
}

export const PROPS = buildProps();

function drawTuft(ctx, x, y, seed) {
    const r = mulberry32(seed);
    ctx.save();
    ctx.strokeStyle = GRASS_EDGE;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
        const dx = (i - 1.5) * 5;
        ctx.beginPath();
        ctx.moveTo(x + dx, y);
        ctx.quadraticCurveTo(x + dx + (r() - 0.5) * 8, y - 9, x + dx + (r() - 0.5) * 14, y - 15);
        ctx.stroke();
    }
    ctx.restore();
}

function drawFlower(ctx, x, y, seed) {
    const r = mulberry32(seed);
    const colors = ['#ff8fab', '#ffd166', '#c084fc', '#7dd3fc'];
    const c = colors[Math.floor(r() * colors.length)];
    ctx.save();
    ctx.strokeStyle = GRASS_EDGE;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x, y - 10);
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * 4, y - 12 + Math.sin(a) * 4, 3.2, 0, Math.PI * 2);
        ink(ctx, c, 1.8);
    }
    ctx.beginPath();
    ctx.arc(x, y - 12, 2.6, 0, Math.PI * 2);
    ink(ctx, '#fff7cc', 1.4);
    ctx.restore();
}

function drawBush(ctx, x, y) {
    dropShadow(ctx, x, y + 12, 30, 10, 0.24);
    ctx.beginPath();
    ctx.moveTo(x - 16 + 18, y); ctx.arc(x - 16, y, 18, 0, Math.PI * 2);
    ctx.moveTo(x + 16 + 16, y + 2); ctx.arc(x + 16, y + 2, 16, 0, Math.PI * 2);
    ctx.moveTo(x + 22, y - 10); ctx.arc(x, y - 10, 22, 0, Math.PI * 2);
    ink(ctx, '#236b2b', 4);
    ctx.beginPath();
    ctx.arc(x - 6, y - 14, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#3d9c42';
    ctx.fill();
}

function drawTree(ctx, x, y) {
    dropShadow(ctx, x, y + 26, 40, 14, 0.28);
    roundRect(ctx, x - 11, y - 6, 22, 34, 8);
    ink(ctx, '#8b5a2b', 4);
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 22); ctx.arc(x - 28, y - 22, 26, 0, Math.PI * 2);
    ctx.moveTo(x + 52, y - 18); ctx.arc(x + 28, y - 18, 24, 0, Math.PI * 2);
    ctx.moveTo(x + 34, y - 48); ctx.arc(x, y - 48, 34, 0, Math.PI * 2);
    ctx.moveTo(x + 30, y - 16); ctx.arc(x, y - 16, 30, 0, Math.PI * 2);
    ink(ctx, '#236b2b', 4.5);
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 52); ctx.arc(x - 12, y - 52, 14, 0, Math.PI * 2);
    ctx.moveTo(x + 23, y - 34); ctx.arc(x + 14, y - 34, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#3d9c42';
    ctx.fill();
}

function drawRock(ctx, x, y, seed) {
    const r = mulberry32(seed);
    dropShadow(ctx, x, y + 14, 28, 9, 0.26);
    ctx.beginPath();
    ctx.moveTo(x - 26, y + 12);
    ctx.lineTo(x - 18, y - 12 - r() * 6);
    ctx.lineTo(x + 2, y - 22);
    ctx.lineTo(x + 22, y - 8);
    ctx.lineTo(x + 26, y + 12);
    ctx.closePath();
    ink(ctx, STONE, 4);
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 8); ctx.lineTo(x + 2, y - 17); ctx.lineTo(x + 10, y - 4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();
}

function drawCrate(ctx, x, y) {
    dropShadow(ctx, x, y + 20, 24, 8, 0.26);
    roundRect(ctx, x - 22, y - 22, 44, 44, 8);
    ink(ctx, '#b4762e', 4);
    ctx.beginPath();
    ctx.moveTo(x - 18, y - 18); ctx.lineTo(x + 18, y + 18);
    ctx.moveTo(x + 18, y - 18); ctx.lineTo(x - 18, y + 18);
    ctx.lineWidth = 4; ctx.strokeStyle = '#8b5a2b'; ctx.stroke();
}

function drawBarrel(ctx, x, y) {
    dropShadow(ctx, x, y + 20, 20, 7, 0.26);
    roundRect(ctx, x - 17, y - 22, 34, 44, 12);
    ink(ctx, '#a35a25', 4);
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 6); ctx.lineTo(x + 16, y - 6);
    ctx.moveTo(x - 16, y + 8); ctx.lineTo(x + 16, y + 8);
    ctx.lineWidth = 4; ctx.strokeStyle = '#6b3a12'; ctx.stroke();
}

function drawBanner(ctx, x, y) {
    dropShadow(ctx, x, y + 40, 16, 6, 0.24);
    roundRect(ctx, x - 4, y - 10, 8, 52, 4);
    ink(ctx, '#7c4a03', 3.4);
    ctx.beginPath();
    ctx.moveTo(x - 26, y - 34);
    ctx.lineTo(x + 26, y - 34);
    ctx.lineTo(x + 26, y + 6);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x - 26, y + 6);
    ctx.closePath();
    ink(ctx, '#e0397a', 4);
    ctx.beginPath();
    ctx.arc(x, y - 18, 9, 0, Math.PI * 2);
    ink(ctx, '#ffd25e', 3);
}

/* Ground layer, rendered once into an offscreen canvas */
export function createGround() {
    const c = document.createElement('canvas');
    c.width = WORLD.width;
    c.height = WORLD.height;
    const ctx = c.getContext('2d');
    const rand = mulberry32(777);

    // checkerboard grass
    const TILE = 120;
    for (let y = 0; y < WORLD.height; y += TILE) {
        for (let x = 0; x < WORLD.width; x += TILE) {
            ctx.fillStyle = ((x / TILE) + (y / TILE)) % 2 === 0 ? GRASS_A : GRASS_B;
            ctx.fillRect(x, y, TILE, TILE);
        }
    }

    // subtle noise speckles
    for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        const s = 2 + rand() * 5;
        ctx.fillRect(rand() * WORLD.width, rand() * WORLD.height, s, s);
    }

    // sand roads
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const roads = [
        [[380, 0], [380, 520], [1180, 520], [1180, 1600]],
        [[0, 760], [900, 760], [1400, 460], [2400, 460]],
        [[1700, 1600], [1700, 1000], [2400, 1000]],
    ];
    roads.forEach((pts) => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
        ctx.lineWidth = 132; ctx.strokeStyle = SAND_DARK; ctx.stroke();
        ctx.lineWidth = 116; ctx.strokeStyle = SAND; ctx.stroke();
    });

    // central plaza
    ctx.beginPath();
    ctx.arc(PLAZA.x, PLAZA.y, PLAZA.r, 0, Math.PI * 2);
    ctx.fillStyle = SAND_DARK; ctx.fill();
    ctx.beginPath();
    ctx.arc(PLAZA.x, PLAZA.y, PLAZA.r - 14, 0, Math.PI * 2);
    ctx.fillStyle = SAND; ctx.fill();
    for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.arc(PLAZA.x, PLAZA.y, PLAZA.r - 14 - ring * 62, 0, Math.PI * 2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(160,120,60,0.45)';
        ctx.stroke();
    }
    // plaza rune
    ctx.save();
    ctx.translate(PLAZA.x, PLAZA.y);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * 92;
        const py = Math.sin(a) * 92;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(93, 200, 255, 0.55)';
    ctx.stroke();
    ctx.restore();

    // lake
    roundRect(ctx, LAKE.x - 10, LAKE.y - 10, LAKE.w + 20, LAKE.h + 20, LAKE.r + 8);
    ctx.fillStyle = '#e4d3a0'; ctx.fill();
    roundRect(ctx, LAKE.x, LAKE.y, LAKE.w, LAKE.h, LAKE.r);
    ctx.fillStyle = '#1fa2d8'; ctx.fill();
    roundRect(ctx, LAKE.x + 22, LAKE.y + 22, LAKE.w - 44, LAKE.h - 44, LAKE.r - 18);
    ctx.fillStyle = '#31bfe8'; ctx.fill();

    // arena walls
    ctx.lineWidth = 46;
    ctx.strokeStyle = STONE_DARK;
    ctx.strokeRect(0, 0, WORLD.width, WORLD.height);
    ctx.lineWidth = 26;
    ctx.strokeStyle = STONE;
    ctx.strokeRect(0, 0, WORLD.width, WORLD.height);
    ctx.lineWidth = 6;
    ctx.strokeStyle = OUTLINE;
    ctx.strokeRect(23, 23, WORLD.width - 46, WORLD.height - 46);

    // static props baked into the ground
    PROPS.forEach((p) => {
        switch (p.type) {
            case 'tuft': drawTuft(ctx, p.x, p.y, p.seed); break;
            case 'flower': drawFlower(ctx, p.x, p.y, p.seed); break;
            case 'bush': drawBush(ctx, p.x, p.y); break;
            case 'tree': drawTree(ctx, p.x, p.y); break;
            case 'rock': drawRock(ctx, p.x, p.y, p.seed); break;
            case 'crate': drawCrate(ctx, p.x, p.y); break;
            case 'barrel': drawBarrel(ctx, p.x, p.y); break;
            case 'banner': drawBanner(ctx, p.x, p.y); break;
            default: break;
        }
    });

    return c;
}

/* Animated overlay: water shimmer, torch flames, floating crystals */
export function drawAnimatedDecor(ctx, time) {
    // water sparkle lines
    ctx.save();
    roundRect(ctx, LAKE.x, LAKE.y, LAKE.w, LAKE.h, LAKE.r);
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) {
        const y = LAKE.y + 60 + i * 56;
        const off = Math.sin(time * 0.0016 + i) * 42;
        ctx.beginPath();
        ctx.moveTo(LAKE.x + 70 + off, y);
        ctx.lineTo(LAKE.x + 70 + off + 70, y);
        ctx.stroke();
    }
    ctx.restore();

    PROPS.forEach((p) => {
        if (p.type === 'torch') {
            dropShadow(ctx, p.x, p.y + 22, 14, 5, 0.26);
            roundRect(ctx, p.x - 5, p.y - 14, 10, 38, 5);
            ctx.fillStyle = '#7c4a03'; ctx.fill();
            ctx.lineWidth = 3; ctx.strokeStyle = OUTLINE; ctx.stroke();
            const f = 1 + Math.sin(time * 0.012 + p.x) * 0.16;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const g = ctx.createRadialGradient(p.x, p.y - 26, 0, p.x, p.y - 26, 70 * f);
            g.addColorStop(0, 'rgba(255,190,80,0.55)');
            g.addColorStop(1, 'rgba(255,140,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y - 26, 70 * f, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.beginPath();
            ctx.moveTo(p.x - 8, p.y - 18);
            ctx.quadraticCurveTo(p.x, p.y - 44 * f, p.x + 8, p.y - 18);
            ctx.quadraticCurveTo(p.x, p.y - 10, p.x - 8, p.y - 18);
            ctx.closePath();
            ctx.fillStyle = '#ff9f1c'; ctx.fill();
            ctx.lineWidth = 2.6; ctx.strokeStyle = OUTLINE; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.x - 4, p.y - 19);
            ctx.quadraticCurveTo(p.x, p.y - 34 * f, p.x + 4, p.y - 19);
            ctx.closePath();
            ctx.fillStyle = '#ffe27a'; ctx.fill();
        }

        if (p.type === 'crystal') {
            const hover = Math.sin(time * 0.0025 + p.x) * 7;
            dropShadow(ctx, p.x, p.y + 24, 20 - hover * 0.4, 7, 0.26);
            ctx.save();
            ctx.translate(p.x, p.y + hover);
            ctx.globalCompositeOperation = 'lighter';
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 56);
            g.addColorStop(0, 'rgba(125,211,252,0.45)');
            g.addColorStop(1, 'rgba(125,211,252,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(0, 0, 56, 0, Math.PI * 2); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.moveTo(0, -26); ctx.lineTo(15, -4); ctx.lineTo(0, 24); ctx.lineTo(-15, -4);
            ctx.closePath();
            ctx.fillStyle = '#7dd3fc'; ctx.fill();
            ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = OUTLINE; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -26); ctx.lineTo(-15, -4); ctx.lineTo(0, 24);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
            ctx.restore();
        }
    });
}
