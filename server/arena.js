import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3001;
const ARENA_SECRET = process.env.ARENA_SERVER_SECRET || 'crystal-brawlers-super-secret-key';
const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000';

// Map Dimensions
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1600;

// Game State
const players = new Map();
const bots = new Map();
const projectiles = [];
const damageTexts = [];
let nextProjectileId = 1;
let nextTextId = 1;

// Bot Configuration
const MAX_BOTS = 10;
const BOT_NAMES = ['Goblin Marauder', 'Skeleton Archer', 'Orc Berserker', 'Cave Troll', 'Dark Cultist', 'Feral Wolf', 'Rogue Initiate', 'Dungeon Demon'];

// Class Attributes base configurations
const CLASS_PROFILES = {
    knight: { hp: 220, damage: 25, speed: 4.2, attackRange: 95, attackCooldown: 450, attackType: 'melee', color: '#06b6d4' },
    rogue: { hp: 130, damage: 20, speed: 5.4, attackRange: 75, attackCooldown: 260, attackType: 'melee', color: '#d946ef' },
    mage: { hp: 100, damage: 35, speed: 4.4, attackRange: 420, attackCooldown: 500, attackType: 'ranged', projectileSpeed: 9, color: '#10b981' },
    hunter: { hp: 130, damage: 28, speed: 4.8, attackRange: 460, attackCooldown: 420, attackType: 'ranged', projectileSpeed: 11, color: '#f59e0b' },
    berserker: { hp: 190, damage: 40, speed: 4.0, attackRange: 105, attackCooldown: 550, attackType: 'melee', color: '#ef4444' },
    cleric: { hp: 170, damage: 22, speed: 4.5, attackRange: 300, attackCooldown: 400, attackType: 'ranged', projectileSpeed: 8, color: '#38bdf8' },
};

// Spawn an AI Bot
function spawnBot(id) {
    const randomName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    const randomType = Math.random() > 0.4 ? 'melee' : 'ranged';
    
    return {
        id: `bot_${id}`,
        name: randomName,
        isBot: true,
        x: Math.random() * (MAP_WIDTH - 200) + 100,
        y: Math.random() * (MAP_HEIGHT - 200) + 100,
        angle: Math.random() * Math.PI * 2,
        hp: 75,
        maxHp: 75,
        damage: 8,
        speed: 2.2 + Math.random() * 0.8,
        attackRange: randomType === 'melee' ? 65 : 300,
        attackType: randomType,
        attackCooldown: 800,
        lastAttackTime: 0,
        targetPlayerId: null,
        changeDirectionTime: 0,
        color: '#a855f7',
    };
}

// Initialize initial bots
for (let i = 1; i <= MAX_BOTS; i++) {
    bots.set(`bot_${i}`, spawnBot(i));
}

// Check collision between two circles
function checkCircleCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return (dx * dx + dy * dy) <= (r1 + r2) * (r1 + r2);
}

// Distance helper
function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

// Send secure reward to Laravel backend
async function sendRewardToLaravel(userId, score, kills, coinsEarned, durationSeconds, heroClass, result) {
    try {
        const dataToSign = `${userId}:${score}:${kills}:${coinsEarned}:${durationSeconds}`;
        const signature = crypto.createHmac('sha256', ARENA_SECRET).update(dataToSign).digest('hex');

        const response = await fetch(`${LARAVEL_API_URL}/api/arena/reward`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Arena-Signature': signature,
            },
            body: JSON.stringify({
                user_id: userId,
                score,
                kills,
                coins_earned: coinsEarned,
                duration_seconds: durationSeconds,
                hero_class: heroClass,
                result,
            }),
        });

        const resData = await response.json();
        console.log(`[ARENA] Reward sent for User #${userId}:`, resData);
    } catch (err) {
        console.error(`[ARENA] Error calling Laravel reward API for User #${userId}:`, err.message);
    }
}

// Socket Connection Handling
io.on('connection', (socket) => {
    console.log(`[ARENA] Player socket connected: ${socket.id}`);

    // Handshake & Join Arena
    socket.on('join_arena', (authData) => {
        const heroClass = authData.heroClass || 'knight';
        const classProfile = CLASS_PROFILES[heroClass] || CLASS_PROFILES.knight;

        // Apply upgraded stats if provided from server session
        const maxHp = authData.calculatedHp || classProfile.hp;
        const damage = authData.calculatedDamage || classProfile.damage;
        const speed = (classProfile.speed * ((authData.calculatedSpeed || 100) / 100));

        const newPlayer = {
            id: socket.id,
            userId: authData.userId || 0,
            userName: authData.userName || 'Gladiator',
            heroClass: heroClass,
            skin: authData.skin || 'default',
            x: Math.random() * (MAP_WIDTH - 400) + 200,
            y: Math.random() * (MAP_HEIGHT - 400) + 200,
            angle: 0,
            hp: maxHp,
            maxHp: maxHp,
            damage: damage,
            speed: speed,
            attackRange: classProfile.attackRange,
            attackCooldown: classProfile.attackCooldown,
            attackType: classProfile.attackType,
            projectileSpeed: classProfile.projectileSpeed || 10,
            color: classProfile.color,
            inputs: { up: false, down: false, left: false, right: false },
            score: 0,
            kills: 0,
            coinsEarned: 0,
            lastAttackTime: 0,
            startTime: Date.now(),
            isDead: false,
        };

        players.set(socket.id, newPlayer);

        socket.emit('arena_init', {
            mapWidth: MAP_WIDTH,
            mapHeight: MAP_HEIGHT,
            selfId: socket.id,
            player: newPlayer,
        });

        io.emit('chat_message', {
            sender: 'SYSTEM',
            text: `${newPlayer.userName} (${newPlayer.heroClass.toUpperCase()}) has entered the arena!`,
            color: '#38bdf8',
        });
    });

    // Handle Movement inputs
    socket.on('player_input', (inputData) => {
        const player = players.get(socket.id);
        if (!player || player.isDead) return;

        player.inputs = inputData.keys || player.inputs;
        if (typeof inputData.angle === 'number') {
            player.angle = inputData.angle;
        }
    });

    // Handle Attack input
    socket.on('player_attack', (attackData) => {
        const player = players.get(socket.id);
        if (!player || player.isDead) return;

        const now = Date.now();
        if (now - player.lastAttackTime < player.attackCooldown) return;
        player.lastAttackTime = now;

        if (player.attackType === 'melee') {
            // Melee Arc Hitbox check
            const attackArc = Math.PI / 2; // 90 degree forward cone
            const attackRange = player.attackRange;

            // Check against bots
            bots.forEach((bot) => {
                const dist = getDistance(player.x, player.y, bot.x, bot.y);
                if (dist <= attackRange) {
                    const angleToTarget = Math.atan2(bot.y - player.y, bot.x - player.x);
                    let angleDiff = Math.abs(player.angle - angleToTarget);
                    while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

                    if (angleDiff <= attackArc / 2) {
                        // HIT!
                        bot.hp -= player.damage;
                        damageTexts.push({
                            id: nextTextId++,
                            x: bot.x,
                            y: bot.y - 20,
                            text: `-${player.damage}`,
                            color: '#fbbf24',
                            duration: 25,
                        });

                        if (bot.hp <= 0) {
                            // Defeated Bot
                            player.score += 25;
                            player.kills += 1;
                            const earned = Math.floor(10 + Math.random() * 15);
                            player.coinsEarned += earned;

                            damageTexts.push({
                                id: nextTextId++,
                                x: bot.x,
                                y: bot.y - 40,
                                text: `+${earned} 🪙`,
                                color: '#f59e0b',
                                duration: 35,
                            });

                            // Respawn bot after a short delay
                            bots.set(bot.id, spawnBot(bot.id.split('_')[1]));
                        }
                    }
                }
            });

            // Check against other human players
            players.forEach((other) => {
                if (other.id === player.id || other.isDead) return;
                const dist = getDistance(player.x, player.y, other.x, other.y);
                if (dist <= attackRange) {
                    const angleToTarget = Math.atan2(other.y - player.y, other.x - player.x);
                    let angleDiff = Math.abs(player.angle - angleToTarget);
                    while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

                    if (angleDiff <= attackArc / 2) {
                        other.hp -= player.damage;
                        damageTexts.push({
                            id: nextTextId++,
                            x: other.x,
                            y: other.y - 20,
                            text: `-${player.damage}`,
                            color: '#ef4444',
                            duration: 25,
                        });

                        if (other.hp <= 0) {
                            other.isDead = true;
                            player.score += 150;
                            player.kills += 1;
                            player.coinsEarned += 100;

                            io.to(other.id).emit('player_defeated', {
                                killerName: player.userName,
                                score: other.score,
                                kills: other.kills,
                                coinsEarned: other.coinsEarned,
                            });

                            const duration = Math.floor((Date.now() - other.startTime) / 1000);
                            sendRewardToLaravel(other.userId, other.score, other.kills, other.coinsEarned, duration, other.heroClass, 'defeat');
                        }
                    }
                }
            });

            io.emit('attack_effect', {
                type: 'slash',
                id: player.id,
                heroClass: player.heroClass,
                x: player.x,
                y: player.y,
                angle: player.angle,
                range: player.attackRange,
                color: player.color,
            });

        } else if (player.attackType === 'ranged') {
            // Spawn Projectile
            const proj = {
                id: nextProjectileId++,
                ownerId: player.id,
                ownerType: 'player',
                x: player.x + Math.cos(player.angle) * 25,
                y: player.y + Math.sin(player.angle) * 25,
                vx: Math.cos(player.angle) * player.projectileSpeed,
                vy: Math.sin(player.angle) * player.projectileSpeed,
                damage: player.damage,
                maxDistance: player.attackRange,
                distanceTravelled: 0,
                color: player.color,
                heroClass: player.heroClass,
            };
            projectiles.push(proj);

            io.emit('attack_effect', {
                type: 'cast',
                id: player.id,
                heroClass: player.heroClass,
                x: player.x,
                y: player.y,
                angle: player.angle,
                range: 70,
                color: player.color,
            });
        }
    });

    // Handle Manual Exit Match
    socket.on('leave_arena', () => {
        const player = players.get(socket.id);
        if (player) {
            const duration = Math.floor((Date.now() - player.startTime) / 1000);
            sendRewardToLaravel(player.userId, player.score, player.kills, player.coinsEarned, duration, player.heroClass, 'completed');
            players.delete(socket.id);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        const player = players.get(socket.id);
        if (player) {
            const duration = Math.floor((Date.now() - player.startTime) / 1000);
            sendRewardToLaravel(player.userId, player.score, player.kills, player.coinsEarned, duration, player.heroClass, 'completed');
            players.delete(socket.id);
        }
        console.log(`[ARENA] Player socket disconnected: ${socket.id}`);
    });
});

// 30 TPS Physics & Game Loop
const TICK_RATE = 30;
const TICK_INTERVAL = 1000 / TICK_RATE;

setInterval(() => {
    const now = Date.now();

    // 1. Update Players Movement
    players.forEach((player) => {
        if (player.isDead) return;

        let dx = 0;
        let dy = 0;

        if (player.inputs.up) dy -= 1;
        if (player.inputs.down) dy += 1;
        if (player.inputs.left) dx -= 1;
        if (player.inputs.right) dx += 1;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        player.x = Math.max(30, Math.min(MAP_WIDTH - 30, player.x + dx * player.speed));
        player.y = Math.max(30, Math.min(MAP_HEIGHT - 30, player.y + dy * player.speed));
    });

    // 2. Update Bots AI
    bots.forEach((bot) => {
        if (now > bot.changeDirectionTime) {
            bot.changeDirectionTime = now + 1500 + Math.random() * 2000;
            
            // Find nearest human player within aggro radius (400px)
            let nearestDist = 400;
            let target = null;
            players.forEach((p) => {
                if (!p.isDead) {
                    const d = getDistance(bot.x, bot.y, p.x, p.y);
                    if (d < nearestDist) {
                        nearestDist = d;
                        target = p;
                    }
                }
            });

            if (target) {
                bot.angle = Math.atan2(target.y - bot.y, target.x - bot.x);
                bot.targetPlayerId = target.id;
            } else {
                bot.angle = Math.random() * Math.PI * 2;
                bot.targetPlayerId = null;
            }
        }

        // Move Bot
        bot.x = Math.max(40, Math.min(MAP_WIDTH - 40, bot.x + Math.cos(bot.angle) * bot.speed));
        bot.y = Math.max(40, Math.min(MAP_HEIGHT - 40, bot.y + Math.sin(bot.angle) * bot.speed));

        // Bot Attack Logic if close to target
        if (bot.targetPlayerId && now - bot.lastAttackTime > bot.attackCooldown) {
            const target = players.get(bot.targetPlayerId);
            if (target && !target.isDead) {
                const dist = getDistance(bot.x, bot.y, target.x, target.y);
                if (dist <= bot.attackRange + 20) {
                    bot.lastAttackTime = now;
                    target.hp -= bot.damage;

                    io.emit('attack_effect', {
                        type: bot.attackType === 'melee' ? 'slash' : 'cast',
                        id: bot.id,
                        x: bot.x,
                        y: bot.y,
                        angle: Math.atan2(target.y - bot.y, target.x - bot.x),
                        range: bot.attackRange,
                        color: bot.color,
                    });

                    damageTexts.push({
                        id: nextTextId++,
                        x: target.x,
                        y: target.y - 20,
                        text: `-${bot.damage}`,
                        color: '#f87171',
                        duration: 25,
                    });

                    if (target.hp <= 0) {
                        target.isDead = true;
                        io.to(target.id).emit('player_defeated', {
                            killerName: bot.name,
                            score: target.score,
                            kills: target.kills,
                            coinsEarned: target.coinsEarned,
                        });

                        const duration = Math.floor((Date.now() - target.startTime) / 1000);
                        sendRewardToLaravel(target.userId, target.score, target.kills, target.coinsEarned, duration, target.heroClass, 'defeat');
                    }
                }
            }
        }
    });

    // 3. Update Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.distanceTravelled += Math.hypot(proj.vx, proj.vy);

        let hit = false;

        // Check hit on bots
        bots.forEach((bot) => {
            if (hit) return;
            if (checkCircleCollision(proj.x, proj.y, 10, bot.x, bot.y, 22)) {
                hit = true;
                bot.hp -= proj.damage;

                damageTexts.push({
                    id: nextTextId++,
                    x: bot.x,
                    y: bot.y - 20,
                    text: `-${proj.damage}`,
                    color: '#fbbf24',
                    duration: 25,
                });

                const owner = players.get(proj.ownerId);
                if (bot.hp <= 0 && owner) {
                    owner.score += 25;
                    owner.kills += 1;
                    const earned = Math.floor(10 + Math.random() * 15);
                    owner.coinsEarned += earned;

                    damageTexts.push({
                        id: nextTextId++,
                        x: bot.x,
                        y: bot.y - 40,
                        text: `+${earned} 🪙`,
                        color: '#f59e0b',
                        duration: 35,
                    });

                    bots.set(bot.id, spawnBot(bot.id.split('_')[1]));
                }
            }
        });

        // Check hit on players
        players.forEach((target) => {
            if (hit || target.id === proj.ownerId || target.isDead) return;
            if (checkCircleCollision(proj.x, proj.y, 10, target.x, target.y, 22)) {
                hit = true;
                target.hp -= proj.damage;

                damageTexts.push({
                    id: nextTextId++,
                    x: target.x,
                    y: target.y - 20,
                    text: `-${proj.damage}`,
                    color: '#ef4444',
                    duration: 25,
                });

                if (target.hp <= 0) {
                    target.isDead = true;
                    const killer = players.get(proj.ownerId);
                    if (killer) {
                        killer.score += 150;
                        killer.kills += 1;
                        killer.coinsEarned += 100;
                    }

                    io.to(target.id).emit('player_defeated', {
                        killerName: killer ? killer.userName : 'Enemy Spell',
                        score: target.score,
                        kills: target.kills,
                        coinsEarned: target.coinsEarned,
                    });

                    const duration = Math.floor((Date.now() - target.startTime) / 1000);
                    sendRewardToLaravel(target.userId, target.score, target.kills, target.coinsEarned, duration, target.heroClass, 'defeat');
                }
            }
        });

        if (hit || proj.distanceTravelled >= proj.maxDistance) {
            projectiles.splice(i, 1);
        }
    }

    // 4. Update Damage Texts
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        damageTexts[i].y -= 0.6;
        damageTexts[i].duration -= 1;
        if (damageTexts[i].duration <= 0) {
            damageTexts.splice(i, 1);
        }
    }

    // 5. Broadcast State to all Clients
    const statePayload = {
        players: Array.from(players.values()).map((p) => ({
            id: p.id,
            userName: p.userName,
            heroClass: p.heroClass,
            skin: p.skin,
            x: Math.round(p.x),
            y: Math.round(p.y),
            angle: p.angle,
            hp: p.hp,
            maxHp: p.maxHp,
            score: p.score,
            kills: p.kills,
            isDead: p.isDead,
            color: p.color,
        })),
        bots: Array.from(bots.values()).map((b) => ({
            id: b.id,
            name: b.name,
            x: Math.round(b.x),
            y: Math.round(b.y),
            angle: b.angle,
            hp: b.hp,
            maxHp: b.maxHp,
            color: b.color,
        })),
        projectiles: projectiles.map((pr) => ({
            id: pr.id,
            x: Math.round(pr.x),
            y: Math.round(pr.y),
            color: pr.color,
            heroClass: pr.heroClass,
        })),
        damageTexts: damageTexts,
        serverTime: now,
    };

    io.emit('arena_state', statePayload);

}, TICK_INTERVAL);

server.listen(PORT, () => {
    console.log(`[ARENA] Real-time Game Server running on port ${PORT} at ${TICK_RATE} TPS`);
});
