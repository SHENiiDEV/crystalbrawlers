import React, { useEffect, useRef } from 'react';
import { drawHero, styleWithSkin } from '../game/toon';

/**
 * A single idle hero drawn with the in-game toon renderer,
 * so the site and the arena always look like the same product.
 */
export default function HeroPortrait({ heroClass = 'knight', size = 160, className = '', aim = 0.25, scale = 1.35, palette = null }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        let frame;
        let attackAt = performance.now() + 1200 + Math.random() * 2000;

        const loop = (now) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, size, size);
            let attack = 0;
            if (now > attackAt) {
                const p = (now - attackAt) / 320;
                if (p >= 1) attackAt = now + 1800 + Math.random() * 2200;
                else attack = p;
            }
            ctx.save();
            ctx.translate(size / 2, size * 0.66);
            drawHero(ctx, {
                x: 0, y: 0, angle: aim, heroClass, time: now, palette,
                moving: false, attack, scale, phase: heroClass.length * 7,
            });
            ctx.restore();
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [heroClass, size, aim, scale, palette]);

    const st = styleWithSkin(heroClass, palette);

    return (
        <canvas
            ref={ref}
            style={{ width: size, height: size, filter: `drop-shadow(0 6px 18px ${st.glow}55)` }}
            className={className}
        />
    );
}
