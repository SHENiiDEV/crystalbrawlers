<?php

namespace Database\Seeders;

use App\Models\Skin;
use Illuminate\Database\Seeder;

class SkinSeeder extends Seeder
{
    /**
     * 24 skins — four per hero class (common / rare / epic / legendary).
     * Each palette is consumed by the canvas renderer, so a skin really
     * changes how the gladiator looks in the arena.
     */
    public function run(): void
    {
        foreach ($this->skins() as $skin) {
            Skin::updateOrCreate(['slug' => $skin['slug']], $skin);
        }
    }

    private function palette(string $body, string $dark, string $trim, string $cape, string $hair, string $glow, string $blade, bool $aura = false): array
    {
        return compact('body', 'dark', 'trim', 'cape', 'hair', 'glow', 'blade', 'aura');
    }

    private function skins(): array
    {
        return [
            /* ----------------------------- KNIGHT ----------------------------- */
            [
                'slug' => 'default-knight', 'name' => 'Royal Defender', 'hero_class' => 'knight', 'rarity' => 'common',
                'description' => 'Standard enchanted steel plate forged in the Citadel armoury.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#4aa8ff',
                'palette' => $this->palette('#4aa8ff', '#1f5fd0', '#ffd25e', '#ff5470', '#f6d365', '#7dd3fc', '#e6f4ff'),
                'weapon_type' => 'Broadsword & Kite Shield', 'bonus_stats' => ['hp' => 20, 'damage' => 5], 'is_featured' => false,
            ],
            [
                'slug' => 'frost-sentinel', 'name' => 'Frost Sentinel', 'hero_class' => 'knight', 'rarity' => 'rare',
                'description' => 'Glacier-forged plate that leaves a trail of frost in the sand.',
                'price_coins' => 7500, 'price_crystals' => 260, 'accent_color' => '#7dd3fc',
                'palette' => $this->palette('#a5e8ff', '#3b82c4', '#e0f7ff', '#1e5f8f', '#e2f6ff', '#bae6fd', '#ffffff'),
                'weapon_type' => 'Glacier Longsword', 'bonus_stats' => ['hp' => 35, 'damage' => 10], 'is_featured' => false,
            ],
            [
                'slug' => 'crimson-paladin', 'name' => 'Crimson Paladin', 'hero_class' => 'knight', 'rarity' => 'epic',
                'description' => 'Heavy runic plate infused with ruby dragon flame.',
                'price_coins' => 12000, 'price_crystals' => 450, 'accent_color' => '#f43f5e',
                'palette' => $this->palette('#f4566e', '#a01230', '#ffd25e', '#7f1d1d', '#fde68a', '#fda4af', '#fff1f2'),
                'weapon_type' => 'Flaming Greatsword', 'bonus_stats' => ['hp' => 50, 'damage' => 25], 'is_featured' => true,
            ],
            [
                'slug' => 'dragon-monarch', 'name' => 'Dragon Monarch', 'hero_class' => 'knight', 'rarity' => 'legendary',
                'description' => 'Scale-gold regalia of the last wyrm-riding king. Radiates molten light.',
                'price_coins' => 24000, 'price_crystals' => 1000, 'accent_color' => '#fbbf24',
                'palette' => $this->palette('#ffc531', '#b45309', '#fff3b0', '#166534', '#fde68a', '#fde047', '#fffbeb', true),
                'weapon_type' => 'Wyrmfang Claymore', 'bonus_stats' => ['hp' => 70, 'damage' => 35], 'is_featured' => true,
            ],

            /* ------------------------------ ROGUE ----------------------------- */
            [
                'slug' => 'default-rogue', 'name' => 'Alley Cutthroat', 'hero_class' => 'rogue', 'rarity' => 'common',
                'description' => 'Patched leathers and a pair of well-used street knives.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#b45cff',
                'palette' => $this->palette('#b45cff', '#6b21cc', '#ffe27a', '#3b0f6b', '#2b1055', '#e879f9', '#f0abfc'),
                'weapon_type' => 'Twin Street Knives', 'bonus_stats' => ['speed' => 8], 'is_featured' => false,
            ],
            [
                'slug' => 'shadow-assassin', 'name' => 'Shadow Stalker', 'hero_class' => 'rogue', 'rarity' => 'rare',
                'description' => 'Cloaked in midnight silks with poisoned serrated blades.',
                'price_coins' => 8500, 'price_crystals' => 300, 'accent_color' => '#8b5cf6',
                'palette' => $this->palette('#7c5cff', '#3b1f8f', '#c4b5fd', '#1e1b4b', '#1e1b4b', '#a78bfa', '#ddd6fe'),
                'weapon_type' => 'Dual Venom Daggers', 'bonus_stats' => ['speed' => 15, 'damage' => 20], 'is_featured' => false,
            ],
            [
                'slug' => 'venom-trickster', 'name' => 'Venom Trickster', 'hero_class' => 'rogue', 'rarity' => 'epic',
                'description' => 'Acid-green silks, a grin you never see coming and blades that hiss.',
                'price_coins' => 13500, 'price_crystals' => 480, 'accent_color' => '#22c55e',
                'palette' => $this->palette('#4ade80', '#15803d', '#d9f99d', '#14532d', '#166534', '#86efac', '#bbf7d0'),
                'weapon_type' => 'Hissing Fang Blades', 'bonus_stats' => ['speed' => 22, 'damage' => 28], 'is_featured' => true,
            ],
            [
                'slug' => 'phantom-sovereign', 'name' => 'Phantom Sovereign', 'hero_class' => 'rogue', 'rarity' => 'legendary',
                'description' => 'Half-there royalty of the between-place. Leaves after-images when it strikes.',
                'price_coins' => 25000, 'price_crystals' => 1050, 'accent_color' => '#e879f9',
                'palette' => $this->palette('#e879f9', '#86198f', '#fdf4ff', '#4a044e', '#701a75', '#f5d0fe', '#ffffff', true),
                'weapon_type' => 'Twin Rift Shivs', 'bonus_stats' => ['speed' => 30, 'damage' => 35], 'is_featured' => true,
            ],

            /* ------------------------------- MAGE ----------------------------- */
            [
                'slug' => 'default-mage', 'name' => 'Coil Apprentice', 'hero_class' => 'mage', 'rarity' => 'common',
                'description' => 'First robes, first staff, first spectacular misfire.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#2fd4a4',
                'palette' => $this->palette('#2fd4a4', '#11836a', '#7df9ff', '#0f766e', '#d9f99d', '#5eead4', '#a7f3d0'),
                'weapon_type' => 'Oak Focus Staff', 'bonus_stats' => ['damage' => 10], 'is_featured' => false,
            ],
            [
                'slug' => 'ember-conjurer', 'name' => 'Ember Conjurer', 'hero_class' => 'mage', 'rarity' => 'rare',
                'description' => 'Robes that smoulder at the hem and a staff burning with a caged sun.',
                'price_coins' => 8000, 'price_crystals' => 280, 'accent_color' => '#fb923c',
                'palette' => $this->palette('#fb923c', '#c2410c', '#fed7aa', '#7c2d12', '#fdba74', '#fdba74', '#ffedd5'),
                'weapon_type' => 'Cinder Rod', 'bonus_stats' => ['damage' => 25], 'is_featured' => false,
            ],
            [
                'slug' => 'tide-weaver', 'name' => 'Tide Weaver', 'hero_class' => 'mage', 'rarity' => 'epic',
                'description' => 'Bends the arena lake into spears of living water.',
                'price_coins' => 13000, 'price_crystals' => 460, 'accent_color' => '#38bdf8',
                'palette' => $this->palette('#38bdf8', '#0369a1', '#e0f2fe', '#075985', '#bae6fd', '#7dd3fc', '#f0f9ff'),
                'weapon_type' => 'Coral Tide Staff', 'bonus_stats' => ['damage' => 32, 'hp' => 15], 'is_featured' => true,
            ],
            [
                'slug' => 'void-mage', 'name' => 'Archmage of the Void', 'hero_class' => 'mage', 'rarity' => 'legendary',
                'description' => 'Wields cosmic energy torn from shattered astral rifts.',
                'price_coins' => 20000, 'price_crystals' => 800, 'accent_color' => '#a855f7',
                'palette' => $this->palette('#a855f7', '#581c87', '#f0abfc', '#1e1b4b', '#c4b5fd', '#d8b4fe', '#faf5ff', true),
                'weapon_type' => 'Astral Staff of Runes', 'bonus_stats' => ['damage' => 45, 'range' => 20], 'is_featured' => true,
            ],

            /* ------------------------------ HUNTER ---------------------------- */
            [
                'slug' => 'default-hunter', 'name' => 'Woodland Scout', 'hero_class' => 'hunter', 'rarity' => 'common',
                'description' => 'Practical greens, a yew bow and a quiver that is always two arrows short.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#ffb02e',
                'palette' => $this->palette('#ffb02e', '#c96a10', '#fff1a8', '#7c4a03', '#7c2d12', '#fcd34d', '#fde68a'),
                'weapon_type' => 'Yew Shortbow', 'bonus_stats' => ['speed' => 6], 'is_featured' => false,
            ],
            [
                'slug' => 'storm-fletcher', 'name' => 'Storm Fletcher', 'hero_class' => 'hunter', 'rarity' => 'rare',
                'description' => 'Every arrow carries a fragment of the thunderhead it was cut from.',
                'price_coins' => 7800, 'price_crystals' => 270, 'accent_color' => '#60a5fa',
                'palette' => $this->palette('#60a5fa', '#1d4ed8', '#dbeafe', '#1e3a8a', '#93c5fd', '#93c5fd', '#eff6ff'),
                'weapon_type' => 'Thunderhead Recurve', 'bonus_stats' => ['damage' => 22, 'speed' => 8], 'is_featured' => false,
            ],
            [
                'slug' => 'emerald-ranger', 'name' => 'Sylvan Marksman', 'hero_class' => 'hunter', 'rarity' => 'epic',
                'description' => 'Deep-forest camo and neon-fletched arrows that curve around cover.',
                'price_coins' => 11000, 'price_crystals' => 400, 'accent_color' => '#10b981',
                'palette' => $this->palette('#34d399', '#047857', '#d1fae5', '#064e3b', '#a7f3d0', '#6ee7b7', '#ecfdf5'),
                'weapon_type' => 'Elven Composite Bow', 'bonus_stats' => ['damage' => 30, 'speed' => 10], 'is_featured' => true,
            ],
            [
                'slug' => 'celestial-sniper', 'name' => 'Celestial Sniper', 'hero_class' => 'hunter', 'rarity' => 'legendary',
                'description' => 'Star-iron bow that draws light instead of string. One shot, one constellation.',
                'price_coins' => 23000, 'price_crystals' => 980, 'accent_color' => '#e2e8f0',
                'palette' => $this->palette('#e2e8f0', '#64748b', '#fef9c3', '#312e81', '#fde68a', '#fef08a', '#ffffff', true),
                'weapon_type' => 'Star-Iron Longbow', 'bonus_stats' => ['damage' => 42, 'speed' => 14], 'is_featured' => true,
            ],

            /* ---------------------------- BERSERKER --------------------------- */
            [
                'slug' => 'default-berserker', 'name' => 'Pit Brawler', 'hero_class' => 'berserker', 'rarity' => 'common',
                'description' => 'No armour worth the name, just scars and a very large axe.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#ff5a48',
                'palette' => $this->palette('#ff5a48', '#a81d16', '#ffd25e', '#7f1d1d', '#fb923c', '#fca5a5', '#e2e8f0'),
                'weapon_type' => 'Chipped Battleaxe', 'bonus_stats' => ['hp' => 15], 'is_featured' => false,
            ],
            [
                'slug' => 'ashen-brute', 'name' => 'Ashen Brute', 'hero_class' => 'berserker', 'rarity' => 'rare',
                'description' => 'Came back from the burnt provinces covered in soot and very bad manners.',
                'price_coins' => 8200, 'price_crystals' => 290, 'accent_color' => '#94a3b8',
                'palette' => $this->palette('#94a3b8', '#475569', '#fbbf24', '#1e293b', '#cbd5e1', '#cbd5e1', '#f1f5f9'),
                'weapon_type' => 'Soot-Caked Cleaver', 'bonus_stats' => ['hp' => 25, 'damage' => 18], 'is_featured' => false,
            ],
            [
                'slug' => 'thunder-reaver', 'name' => 'Thunder Reaver', 'hero_class' => 'berserker', 'rarity' => 'epic',
                'description' => 'Swings hard enough that the air claps back at him.',
                'price_coins' => 14000, 'price_crystals' => 500, 'accent_color' => '#818cf8',
                'palette' => $this->palette('#818cf8', '#3730a3', '#fef08a', '#1e1b4b', '#c7d2fe', '#a5b4fc', '#eef2ff'),
                'weapon_type' => 'Stormcall Greataxe', 'bonus_stats' => ['damage' => 38, 'hp' => 25], 'is_featured' => true,
            ],
            [
                'slug' => 'blood-berserker', 'name' => 'Raging Warlord', 'hero_class' => 'berserker', 'rarity' => 'legendary',
                'description' => 'Fuelled by battle fury, wielding a massive molten battleaxe.',
                'price_coins' => 22000, 'price_crystals' => 950, 'accent_color' => '#ef4444',
                'palette' => $this->palette('#ef4444', '#7f1d1d', '#ffd25e', '#450a0a', '#f97316', '#fca5a5', '#fff7ed', true),
                'weapon_type' => 'Double-Headed Molten Axe', 'bonus_stats' => ['damage' => 50, 'hp' => 35], 'is_featured' => true,
            ],

            /* ------------------------------ CLERIC ---------------------------- */
            [
                'slug' => 'default-cleric', 'name' => 'Chapel Acolyte', 'hero_class' => 'cleric', 'rarity' => 'common',
                'description' => 'Plain vestments, a heavy prayer book and an even heavier mace.',
                'price_coins' => 0, 'price_crystals' => 0, 'accent_color' => '#5ec8ff',
                'palette' => $this->palette('#5ec8ff', '#2472c8', '#fff4c2', '#1e3a8a', '#fde68a', '#bae6fd', '#cbd5e1'),
                'weapon_type' => 'Oak Prayer Mace', 'bonus_stats' => ['hp' => 18], 'is_featured' => false,
            ],
            [
                'slug' => 'radiant-cleric', 'name' => 'High Sun Inquisitor', 'hero_class' => 'cleric', 'rarity' => 'rare',
                'description' => 'Blessed by the dawn light to smite shadows and mend allies.',
                'price_coins' => 9000, 'price_crystals' => 350, 'accent_color' => '#facc15',
                'palette' => $this->palette('#fde047', '#ca8a04', '#fffbeb', '#b45309', '#fef3c7', '#fef08a', '#fffbeb'),
                'weapon_type' => 'Holy Radiance Scepter', 'bonus_stats' => ['hp' => 40, 'damage' => 15], 'is_featured' => false,
            ],
            [
                'slug' => 'moonlit-oracle', 'name' => 'Moonlit Oracle', 'hero_class' => 'cleric', 'rarity' => 'epic',
                'description' => 'Reads the next thirty seconds of the fight in a bowl of silver water.',
                'price_coins' => 12500, 'price_crystals' => 470, 'accent_color' => '#c084fc',
                'palette' => $this->palette('#c4b5fd', '#6d28d9', '#ede9fe', '#2e1065', '#ddd6fe', '#ddd6fe', '#f5f3ff'),
                'weapon_type' => 'Silverwater Censer', 'bonus_stats' => ['hp' => 50, 'damage' => 22], 'is_featured' => true,
            ],
            [
                'slug' => 'seraph-judge', 'name' => 'Seraph Judge', 'hero_class' => 'cleric', 'rarity' => 'legendary',
                'description' => 'Six wings of light, zero patience for appeals.',
                'price_coins' => 21000, 'price_crystals' => 900, 'accent_color' => '#f8fafc',
                'palette' => $this->palette('#f8fafc', '#94a3b8', '#fde047', '#eab308', '#fef9c3', '#fef9c3', '#ffffff', true),
                'weapon_type' => 'Gavel of the Choir', 'bonus_stats' => ['hp' => 60, 'damage' => 30], 'is_featured' => true,
            ],
        ];
    }
}
