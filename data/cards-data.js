// 卡牌数据
const CARD_TYPES = {
    attack: '攻击',
    skill: '技能',
    defense: '防御',
    energy: '能量'
};

const CARD_RARITY = {
    common: '普通',
    uncommon: '罕见',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
};

// 基础卡牌库
const CARDS_DATA = {
    // 初始牌组卡牌
    starter: [
        {
            id: 'scratch',
            name: '抓',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            description: '造成 4 点伤害。',
            effects: [{ type: 'damage', value: 4 }]
        },
        {
            id: 'defend',
            name: '防御',
            type: 'defense',
            cost: 1,
            rarity: 'common',
            description: '获得 4 点护盾。',
            effects: [{ type: 'block', value: 4 }]
        },
        {
            id: 'tackle',
            name: '撞击',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            description: '造成 5 点伤害。',
            effects: [{ type: 'damage', value: 5 }]
        }
    ],

    // 可获取卡牌
    obtainable: [
        // ====== 攻击卡 ======
        {
            id: 'ember',
            name: '火花',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'fire',
            description: '造成 6 点伤害。有 50% 概率使敌人灼伤。',
            effects: [
                { type: 'damage', value: 6 },
                { type: 'applyStatus', status: 'burn', chance: 0.5 }
            ]
        },
        {
            id: 'water-gun',
            name: '水枪',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'water',
            description: '造成 5 点伤害。',
            effects: [{ type: 'damage', value: 5, attackType: 'water' }]
        },
        {
            id: 'vine-whip',
            name: '藤鞭',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'grass',
            description: '造成 5 点伤害。',
            effects: [{ type: 'damage', value: 5, attackType: 'grass' }]
        },
        {
            id: 'thunder-shock',
            name: '电击',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'electric',
            description: '造成 4 点伤害。有 25% 概率使敌人麻痹。',
            effects: [
                { type: 'damage', value: 4 },
                { type: 'applyStatus', status: 'paralysis', chance: 0.25 }
            ]
        },
        {
            id: 'bite',
            name: '咬住',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            description: '造成 6 点伤害。',
            effects: [{ type: 'damage', value: 6 }]
        },
        {
            id: 'slash',
            name: '劈开',
            type: 'attack',
            cost: 2,
            rarity: 'uncommon',
            description: '造成 12 点伤害。',
            effects: [{ type: 'damage', value: 12 }]
        },
        {
            id: 'flamethrower',
            name: '火焰放射',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'fire',
            description: '造成 10 点伤害。使敌人灼伤。',
            effects: [
                { type: 'damage', value: 10, attackType: 'fire' },
                { type: 'applyStatus', status: 'burn' }
            ]
        },
        {
            id: 'hydro-pump',
            name: '水炮',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'water',
            description: '造成 15 点伤害。',
            effects: [{ type: 'damage', value: 15, attackType: 'water' }]
        },
        {
            id: 'razor-leaf',
            name: '飞叶快刀',
            type: 'attack',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'grass',
            description: '造成 8 点伤害。',
            effects: [{ type: 'damage', value: 8, attackType: 'grass' }]
        },
        {
            id: 'thunderbolt',
            name: '十万伏特',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'electric',
            description: '造成 12 点伤害。有 50% 概率使敌人麻痹。',
            effects: [
                { type: 'damage', value: 12, attackType: 'electric' },
                { type: 'applyStatus', status: 'paralysis', chance: 0.5 }
            ]
        },
        {
            id: 'psychic-attack',
            name: '精神强念',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '造成 10 点伤害。抽一张牌。',
            effects: [
                { type: 'damage', value: 10, attackType: 'psychic' },
                { type: 'draw', value: 1 }
            ]
        },
        {
            id: 'shadow-ball',
            name: '暗影球',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'ghost',
            description: '造成 13 点伤害。',
            effects: [{ type: 'damage', value: 13, attackType: 'ghost' }]
        },
        {
            id: 'stone-edge',
            name: '尖石攻击',
            type: 'attack',
            cost: 2,
            rarity: 'uncommon',
            pokemonType: 'rock',
            description: '造成 10 点伤害。暴击几率高。',
            effects: [{ type: 'damage', value: 15, attackType: 'rock', critChance: 0.3 }]
        },
        {
            id: 'earthquake',
            name: '地震',
            type: 'attack',
            cost: 3,
            rarity: 'epic',
            pokemonType: 'ground',
            description: '造成 25 点伤害。',
            effects: [{ type: 'damage', value: 25, attackType: 'ground' }]
        },

        // ====== 防御卡 ======
        {
            id: 'protect',
            name: '保护',
            type: 'defense',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '获得 6 点护盾。',
            effects: [{ type: 'block', value: 6 }]
        },
        {
            id: 'iron-defense',
            name: '铁壁',
            type: 'defense',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'steel',
            description: '获得 12 点护盾。',
            effects: [{ type: 'block', value: 12 }]
        },
        {
            id: 'withdraw',
            name: '缩入壳中',
            type: 'defense',
            cost: 1,
            rarity: 'common',
            pokemonType: 'water',
            description: '获得 5 点护盾。',
            effects: [{ type: 'block', value: 5 }]
        },
        {
            id: 'harden',
            name: '变硬',
            type: 'defense',
            cost: 1,
            rarity: 'common',
            pokemonType: 'normal',
            description: '获得 4 点护盾。',
            effects: [{ type: 'block', value: 4 }]
        },

        // ====== 技能卡 ======
        {
            id: 'potion',
            name: '伤药',
            type: 'skill',
            cost: 1,
            rarity: 'common',
            description: '恢复 6 点HP。',
            effects: [{ type: 'heal', value: 6 }]
        },
        {
            id: 'super-potion',
            name: '好伤药',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            description: '恢复 12 点HP。',
            effects: [{ type: 'heal', value: 12 }]
        },
        {
            id: 'full-heal',
            name: '全复药',
            type: 'skill',
            cost: 0,
            rarity: 'uncommon',
            description: '治愈所有状态异常。',
            effects: [{ type: 'cureStatus' }]
        },
        {
            id: 'quick-draw',
            name: '快速抽牌',
            type: 'skill',
            cost: 0,
            rarity: 'common',
            description: '抽 2 张牌。',
            effects: [{ type: 'draw', value: 2 }]
        },
        {
            id: 'focus-energy',
            name: '聚气',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            description: '下张攻击牌伤害翻倍。',
            effects: [{ type: 'buff', buff: 'doubleDamage', duration: 1 }]
        },
        {
            id: 'leech-seed',
            name: '寄生种子',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'grass',
            description: '造成 3 点伤害并恢复等量HP。',
            effects: [
                { type: 'damage', value: 3, attackType: 'grass' },
                { type: 'heal', value: 3 }
            ]
        },
        {
            id: 'toxic',
            name: '剧毒',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'poison',
            description: '使敌人中毒，每回合伤害递增。',
            effects: [{ type: 'applyStatus', status: 'toxic' }]
        },
        {
            id: 'hypnosis',
            name: '催眠术',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '使敌人睡眠 2 回合。',
            effects: [{ type: 'applyStatus', status: 'sleep', duration: 2 }]
        },
        {
            id: 'sing',
            name: '唱歌',
            type: 'skill',
            cost: 0,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '有 50% 概率使敌人睡眠。',
            effects: [{ type: 'applyStatus', status: 'sleep', chance: 0.5 }]
        },

        // ====== 能量卡 ======
        {
            id: 'energy-attach',
            name: '能量贴附',
            type: 'energy',
            cost: 0,
            rarity: 'common',
            description: '获得 1 点能量。',
            effects: [{ type: 'gainEnergy', value: 1 }]
        },
        {
            id: 'energy-boost',
            name: '能量强化',
            type: 'energy',
            cost: 0,
            rarity: 'uncommon',
            description: '获得 2 点能量。',
            effects: [{ type: 'gainEnergy', value: 2 }]
        },
        {
            id: 'energy-transfer',
            name: '能量转移',
            type: 'energy',
            cost: 0,
            rarity: 'rare',
            description: '本回合能量上限 +2。',
            effects: [{ type: 'maxEnergyUp', value: 2 }]
        },

        // ====== 特殊卡 ======
        {
            id: 'double-edge',
            name: '舍身冲撞',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            description: '造成 18 点伤害，自己受到 4 点伤害。',
            effects: [
                { type: 'damage', value: 18 },
                { type: 'selfDamage', value: 4 }
            ]
        },
        {
            id: 'rest',
            name: '睡觉',
            type: 'skill',
            cost: 0,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '恢复所有HP，但睡眠 2 回合。',
            effects: [
                { type: 'fullHeal' },
                { type: 'selfStatus', status: 'sleep', duration: 2 }
            ]
        },
        {
            id: 'substitute',
            name: '替身',
            type: 'skill',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'normal',
            description: '消耗 5 HP，获得一个替身（吸收 10 点伤害）。',
            effects: [
                { type: 'selfDamage', value: 5 },
                { type: 'substitute', value: 10 }
            ]
        },
        {
            id: 'metronome',
            name: '摇手指',
            type: 'skill',
            cost: 2,
            rarity: 'legendary',
            pokemonType: 'normal',
            description: '随机使用一张稀有或更高稀有度的卡牌。',
            effects: [{ type: 'randomCard', rarity: ['rare', 'epic', 'legendary'] }]
        },

        // ====== 更多攻击卡 ======
        {
            id: 'dragon-claw',
            name: '龙爪',
            type: 'attack',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'dragon',
            description: '造成 7 点伤害。',
            effects: [{ type: 'damage', value: 7, attackType: 'dragon' }]
        },
        {
            id: 'ice-beam',
            name: '冰冻光束',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'ice',
            description: '造成 10 点伤害。有 30% 概率使敌人冰冻。',
            effects: [
                { type: 'damage', value: 10, attackType: 'ice' },
                { type: 'applyStatus', status: 'freeze', chance: 0.3 }
            ]
        },
        {
            id: 'fire-blast',
            name: '大字爆炎',
            type: 'attack',
            cost: 3,
            rarity: 'epic',
            pokemonType: 'fire',
            description: '造成 20 点伤害。必定使敌人灼伤。',
            effects: [
                { type: 'damage', value: 20, attackType: 'fire' },
                { type: 'applyStatus', status: 'burn' }
            ]
        },
        {
            id: 'thunder',
            name: '打雷',
            type: 'attack',
            cost: 3,
            rarity: 'epic',
            pokemonType: 'electric',
            description: '造成 18 点伤害。有 50% 概率使敌人麻痹。',
            effects: [
                { type: 'damage', value: 18, attackType: 'electric' },
                { type: 'applyStatus', status: 'paralysis', chance: 0.5 }
            ]
        },
        {
            id: 'hyper-beam',
            name: '破坏光线',
            type: 'attack',
            cost: 4,
            rarity: 'legendary',
            pokemonType: 'normal',
            description: '造成 35 点伤害。',
            effects: [{ type: 'damage', value: 35 }]
        },
        {
            id: 'shadow-sneak',
            name: '影子偷袭',
            type: 'attack',
            cost: 0,
            rarity: 'uncommon',
            pokemonType: 'ghost',
            description: '造成 3 点伤害。无视护盾。',
            effects: [{ type: 'damage', value: 3, attackType: 'ghost', ignoreShield: true }]
        },
        {
            id: 'rock-slide',
            name: '岩石崩塌',
            type: 'attack',
            cost: 2,
            rarity: 'uncommon',
            pokemonType: 'rock',
            description: '造成 4 点伤害，3次。',
            effects: [{ type: 'damage', value: 4, attackType: 'rock', hits: 3 }]
        },

        // ====== 更多防御卡 ======
        {
            id: 'light-screen',
            name: '光墙',
            type: 'defense',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '获得 8 点护盾。抽一张牌。',
            effects: [
                { type: 'block', value: 8 },
                { type: 'draw', value: 1 }
            ]
        },
        {
            id: 'reflect',
            name: '反射壁',
            type: 'defense',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '获得 15 点护盾。',
            effects: [{ type: 'block', value: 15 }]
        },
        {
            id: 'aurora-veil',
            name: '极光幕',
            type: 'defense',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'ice',
            description: '获得 10 点护盾。本回合受到的伤害-30%。',
            effects: [
                { type: 'block', value: 10 },
                { type: 'buff', buff: 'damageReduction', value: 0.3, duration: 1 }
            ]
        },

        // ====== 更多技能卡 ======
        {
            id: 'swords-dance',
            name: '剑舞',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '本回合攻击牌伤害翻倍。',
            effects: [{ type: 'buff', buff: 'doubleDamage', duration: 1 }]
        },
        {
            id: 'agility',
            name: '高速移动',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'psychic',
            description: '抽 2 张牌。',
            effects: [{ type: 'draw', value: 2 }]
        },
        {
            id: 'recover',
            name: '自我再生',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '恢复 15 点HP。',
            effects: [{ type: 'heal', value: 15 }]
        },
        {
            id: 'baton-pass',
            name: '接棒',
            type: 'skill',
            cost: 0,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '抽 3 张牌，然后结束回合。',
            effects: [
                { type: 'draw', value: 3 },
                { type: 'endTurn' }
            ]
        },
        {
            id: 'destiny-bond',
            name: '同命',
            type: 'skill',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'ghost',
            description: '当你受到致命伤害时，敌人也会受到相同伤害。',
            effects: [{ type: 'buff', buff: 'destinyBond', duration: 99 }]
        },

        // ====== 新增攻击卡 ======
        {
            id: 'bug-buzz',
            name: '虫鸣',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'bug',
            description: '造成 10 点伤害。有 30% 概率使敌人混乱。',
            effects: [
                { type: 'damage', value: 10, attackType: 'bug' },
                { type: 'applyStatus', status: 'confusion', chance: 0.3 }
            ]
        },
        {
            id: 'poison-jab',
            name: '毒击',
            type: 'attack',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'poison',
            description: '造成 5 点伤害。有 40% 概率使敌人中毒。',
            effects: [
                { type: 'damage', value: 5, attackType: 'poison' },
                { type: 'applyStatus', status: 'poison', chance: 0.4 }
            ]
        },
        {
            id: 'aqua-jet',
            name: '水流喷射',
            type: 'attack',
            cost: 0,
            rarity: 'uncommon',
            pokemonType: 'water',
            description: '造成 3 点伤害。',
            effects: [{ type: 'damage', value: 3, attackType: 'water' }]
        },
        {
            id: 'flare-blitz',
            name: '闪焰冲锋',
            type: 'attack',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'fire',
            description: '造成 20 点伤害，自己受到 5 点伤害。使敌人灼伤。',
            effects: [
                { type: 'damage', value: 20, attackType: 'fire' },
                { type: 'selfDamage', value: 5 },
                { type: 'applyStatus', status: 'burn' }
            ]
        },
        {
            id: 'leaf-storm',
            name: '飞叶风暴',
            type: 'attack',
            cost: 3,
            rarity: 'epic',
            pokemonType: 'grass',
            description: '造成 22 点伤害。',
            effects: [{ type: 'damage', value: 22, attackType: 'grass' }]
        },
        {
            id: 'wild-charge',
            name: '狂野伏特',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'electric',
            description: '造成 16 点伤害，自己受到 3 点伤害。',
            effects: [
                { type: 'damage', value: 16, attackType: 'electric' },
                { type: 'selfDamage', value: 3 }
            ]
        },
        {
            id: 'close-combat',
            name: '近身战',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'fighting',
            description: '造成 18 点伤害。本回合护盾效果-50%。',
            effects: [
                { type: 'damage', value: 18, attackType: 'fighting' },
                { type: 'debuff', debuff: 'weakenShield', value: 0.5, duration: 1 }
            ]
        },
        {
            id: 'dark-pulse',
            name: '恶之波动',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'dark',
            description: '造成 12 点伤害。有 20% 概率使敌人畏缩。',
            effects: [
                { type: 'damage', value: 12, attackType: 'dark' },
                { type: 'applyStatus', status: 'flinch', chance: 0.2 }
            ]
        },
        {
            id: 'fairy-wind',
            name: '妖精之风',
            type: 'attack',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'fairy',
            description: '造成 7 点伤害。',
            effects: [{ type: 'damage', value: 7, attackType: 'fairy' }]
        },
        {
            id: 'moonblast',
            name: '月亮之力',
            type: 'attack',
            cost: 3,
            rarity: 'epic',
            pokemonType: 'fairy',
            description: '造成 18 点伤害。有 30% 概率降低敌人攻击。',
            effects: [
                { type: 'damage', value: 18, attackType: 'fairy' },
                { type: 'debuff', debuff: 'weaken', chance: 0.3, duration: 2 }
            ]
        },

        // ====== 新增防御卡 ======
        {
            id: 'acid-armor',
            name: '溶解液',
            type: 'defense',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'poison',
            description: '获得 10 点护盾。抽一张牌。',
            effects: [
                { type: 'block', value: 10 },
                { type: 'draw', value: 1 }
            ]
        },
        {
            id: 'cotton-guard',
            name: '棉花防守',
            type: 'defense',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'grass',
            description: '获得 16 点护盾。',
            effects: [{ type: 'block', value: 16 }]
        },
        {
            id: 'bulk-up',
            name: '健美',
            type: 'defense',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'fighting',
            description: '获得 6 点护盾。下张攻击牌伤害+3。',
            effects: [
                { type: 'block', value: 6 },
                { type: 'buff', buff: 'damageBonus', value: 3, duration: 1 }
            ]
        },

        // ====== 新增技能卡 ======
        {
            id: 'heal-bell',
            name: '治愈铃声',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '恢复 10 HP。治愈所有状态异常。',
            effects: [
                { type: 'heal', value: 10 },
                { type: 'cureStatus' }
            ]
        },
        {
            id: 'tail-whip',
            name: '摇尾巴',
            type: 'skill',
            cost: 0,
            rarity: 'common',
            pokemonType: 'normal',
            description: '使敌人防御降低，增加受到的伤害。',
            effects: [{ type: 'debuff', debuff: 'vulnerable', duration: 2 }]
        },
        {
            id: 'growl',
            name: '叫声',
            type: 'skill',
            cost: 0,
            rarity: 'common',
            pokemonType: 'normal',
            description: '使敌人攻击降低。',
            effects: [{ type: 'debuff', debuff: 'weaken', duration: 2 }]
        },
        {
            id: 'screech',
            name: '刺耳声',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '使敌人防御大幅降低。',
            effects: [{ type: 'debuff', debuff: 'vulnerable', value: 2, duration: 2 }]
        },
        {
            id: 'will-o-wisp',
            name: '鬼火',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'fire',
            description: '使敌人灼伤。',
            effects: [{ type: 'applyStatus', status: 'burn' }]
        },
        {
            id: 'thunder-wave',
            name: '电磁波',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'electric',
            description: '使敌人麻痹。',
            effects: [{ type: 'applyStatus', status: 'paralysis' }]
        },
        {
            id: 'spore',
            name: '蘑菇孢子',
            type: 'skill',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'grass',
            description: '使敌人睡眠 3 回合。',
            effects: [{ type: 'applyStatus', status: 'sleep', duration: 3 }]
        },
        {
            id: 'recover',
            name: '自我再生',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '恢复 15 点HP。',
            effects: [{ type: 'heal', value: 15 }]
        },
        {
            id: 'soft-boiled',
            name: '生蛋',
            type: 'skill',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'normal',
            description: '恢复 20 HP。',
            effects: [{ type: 'heal', value: 20 }]
        },
        {
            id: 'nasty-plot',
            name: '诡计',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'dark',
            description: '特攻提升2级。',
            effects: [{ type: 'statBoost', stat: 'spAttack', stages: 2 }]
        },
        {
            id: 'swords-dance',
            name: '剑舞',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '物攻提升2级。',
            effects: [{ type: 'statBoost', stat: 'attack', stages: 2 }]
        },
        {
            id: 'iron-defense',
            name: '铁壁',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'steel',
            description: '物防提升2级。',
            effects: [{ type: 'statBoost', stat: 'defense', stages: 2 }]
        },
        {
            id: 'agility',
            name: '高速移动',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'psychic',
            description: '闪避率提升2级。',
            effects: [{ type: 'statBoost', stat: 'evasion', stages: 2 }]
        },
        {
            id: 'focus-energy',
            name: '聚气',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '暴击率提升2级。',
            effects: [{ type: 'statBoost', stat: 'critRate', stages: 2 }]
        },
        
        // ====== 盾反流卡牌 ======
        {
            id: 'counter',
            name: '反击',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'fighting',
            description: '获得5护盾。下回合攻击时，造成等于护盾值2倍的伤害。',
            effects: [
                { type: 'block', value: 5 },
                { type: 'counterSetup', multiplier: 2 }
            ]
        },
        {
            id: 'mirror-coat',
            name: '镜面反射',
            type: 'skill',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'psychic',
            description: '获得10护盾。受到特殊攻击时反弹50%伤害。',
            effects: [
                { type: 'block', value: 10 },
                { type: 'reflectSetup', multiplier: 0.5 }
            ]
        },
        {
            id: 'protect',
            name: '守住',
            type: 'skill',
            cost: 0,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '获得15护盾。本回合免疫所有伤害。',
            effects: [
                { type: 'block', value: 15 },
                { type: 'invulnerable', duration: 1 }
            ]
        },
        {
            id: 'bide',
            name: '忍耐',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '获得8护盾。下回合造成累计受到伤害的2倍。',
            effects: [
                { type: 'block', value: 8 },
                { type: 'bideSetup' }
            ]
        },
        
        // ====== 连击流卡牌 ======
        {
            id: 'double-slap',
            name: '连环巴掌',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'normal',
            description: '造成3点伤害，攻击2次。',
            effects: [
                { type: 'damage', value: 3, hits: 2 }
            ]
        },
        {
            id: 'furys-wipe',
            name: '愤怒之拳',
            type: 'attack',
            cost: 2,
            rarity: 'uncommon',
            pokemonType: 'ghost',
            description: '造成4点伤害，攻击3次。每击杀一个敌人伤害+1。',
            effects: [
                { type: 'damage', value: 4, hits: 3 }
            ]
        },
        {
            id: 'bullet-seed',
            name: '种子机关枪',
            type: 'attack',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'grass',
            description: '造成2点伤害，攻击4次。',
            effects: [
                { type: 'damage', value: 2, hits: 4 }
            ]
        },
        {
            id: 'tail-slap',
            name: '尾巴打',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'normal',
            description: '造成3点伤害，攻击2次。有20%概率眩晕敌人。',
            effects: [
                { type: 'damage', value: 3, hits: 2 },
                { type: 'applyStatus', status: 'flinch', chance: 0.2 }
            ]
        },
        {
            id: 'bonemerang',
            name: '骨头回旋镖',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'ground',
            description: '造成8点伤害，攻击2次。无视护盾。',
            effects: [
                { type: 'damage', value: 8, hits: 2, ignoreShield: true }
            ]
        },
        
        // ====== 多次行动流卡牌 ======
        {
            id: 'extreme-speed',
            name: '神速',
            type: 'attack',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '造成8点伤害。本回合可再使用一张攻击牌。',
            effects: [
                { type: 'damage', value: 8 },
                { type: 'extraAction', type: 'attack', count: 1 }
            ]
        },
        {
            id: 'quick-attack',
            name: '电光一闪',
            type: 'attack',
            cost: 0,
            rarity: 'common',
            pokemonType: 'normal',
            description: '造成4点伤害。本回合可再使用一张技能牌。',
            effects: [
                { type: 'damage', value: 4 },
                { type: 'extraAction', type: 'skill', count: 1 }
            ]
        },
        {
            id: 'fake-out',
            name: '佯攻',
            type: 'attack',
            cost: 0,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '造成3点伤害。使敌人畏缩。',
            effects: [
                { type: 'damage', value: 3 },
                { type: 'applyStatus', status: 'flinch' }
            ],
            firstTurnOnly: true
        },
        
        // ====== 行动滞后卡牌 ======
        {
            id: 'focus-punch',
            name: '聚气拳',
            type: 'attack',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'fighting',
            description: '本回合不攻击。下回合造成30点伤害。被打断则失败。',
            effects: [
                { type: 'delayedAttack', value: 30, delayTurns: 1 }
            ]
        },
        {
            id: 'solar-beam',
            name: '阳光烈焰',
            type: 'attack',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'grass',
            description: '本回合蓄力。下回合造成25点伤害。',
            effects: [
                { type: 'delayedAttack', value: 25, delayTurns: 1, chargeFirst: true }
            ]
        },
        {
            id: 'sky-attack',
            name: '神鸟猛击',
            type: 'attack',
            cost: 2,
            rarity: 'epic',
            pokemonType: 'flying',
            description: '本回合蓄力，获得10护盾。下回合造成20点伤害，暴击率+30%。',
            effects: [
                { type: 'block', value: 10 },
                { type: 'delayedAttack', value: 20, delayTurns: 1, critBonus: 0.3 }
            ]
        },
        
        // ====== 暴击相关卡牌 ======
        {
            id: 'slash-crit',
            name: '劈开',
            type: 'attack',
            cost: 1,
            rarity: 'common',
            pokemonType: 'normal',
            description: '造成6点伤害。暴击率+20%。',
            effects: [
                { type: 'damage', value: 6, critChance: 0.2 }
            ]
        },
        {
            id: 'night-slash',
            name: '暗袭',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'dark',
            description: '造成10点伤害。暴击率+30%。暴击时伤害翻倍。',
            effects: [
                { type: 'damage', value: 10, critChance: 0.3, critMultiplier: 2.0 }
            ]
        },
        {
            id: 'cross-chop',
            name: '十字劈',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'fighting',
            description: '造成12点伤害。暴击率+25%。',
            effects: [
                { type: 'damage', value: 12, critChance: 0.25 }
            ]
        },
        {
            id: 'drill-run',
            name: '直冲钻',
            type: 'attack',
            cost: 2,
            rarity: 'uncommon',
            pokemonType: 'ground',
            description: '造成10点伤害。暴击率+30%。',
            effects: [
                { type: 'damage', value: 10, critChance: 0.3 }
            ]
        },
        {
            id: 'stone-edge-2',
            name: '尖石攻击',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'rock',
            description: '造成12点伤害。暴击率+35%。',
            effects: [
                { type: 'damage', value: 12, critChance: 0.35 }
            ]
        },
        
        // ====== 闪避相关卡牌 ======
        {
            id: 'double-team',
            name: '影子分身',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '闪避率提升2级。获得5护盾。',
            effects: [
                { type: 'statBoost', stat: 'evasion', stages: 2 },
                { type: 'block', value: 5 }
            ]
        },
        {
            id: 'minimize',
            name: '变小',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'normal',
            description: '闪避率提升3级。',
            effects: [
                { type: 'statBoost', stat: 'evasion', stages: 3 }
            ]
        },
        {
            id: 'detect',
            name: '看穿',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'fighting',
            description: '闪避率提升2级。下回合获得先手。',
            effects: [
                { type: 'statBoost', stat: 'evasion', stages: 2 },
                { type: 'priority', nextTurn: true }
            ]
        },
        {
            id: 'phantom-force',
            name: '潜灵奇袭',
            type: 'attack',
            cost: 2,
            rarity: 'rare',
            pokemonType: 'ghost',
            description: '造成15点伤害。本回合免疫所有攻击。',
            effects: [
                { type: 'damage', value: 15 },
                { type: 'untouchable', duration: 1 }
            ]
        }
    ]
};
            name: '诡计',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'dark',
            description: '下张攻击牌伤害+15。',
            effects: [{ type: 'buff', buff: 'damageBonus', value: 15, duration: 1 }]
        },
        {
            id: 'calm-mind',
            name: '冥想',
            type: 'skill',
            cost: 1,
            rarity: 'uncommon',
            pokemonType: 'psychic',
            description: '获得 5 点护盾。抽一张牌。',
            effects: [
                { type: 'block', value: 5 },
                { type: 'draw', value: 1 }
            ]
        },
        {
            id: 'wish',
            name: '祈愿',
            type: 'skill',
            cost: 1,
            rarity: 'rare',
            pokemonType: 'normal',
            description: '下回合开始时恢复 12 HP。',
            effects: [{ type: 'buff', buff: 'wish', value: 12, duration: 2 }]
        },

        // ====== 传说卡牌 ======
        {
            id: 'judgment',
            name: '审判',
            type: 'attack',
            cost: 5,
            rarity: 'legendary',
            pokemonType: 'normal',
            description: '造成 50 点伤害。',
            effects: [{ type: 'damage', value: 50 }]
        },
        {
            id: 'geomancy',
            name: '大地掌控',
            type: 'skill',
            cost: 2,
            rarity: 'legendary',
            pokemonType: 'fairy',
            description: '获得 3 点能量。本回合攻击牌伤害翻倍。',
            effects: [
                { type: 'gainEnergy', value: 3 },
                { type: 'buff', buff: 'doubleDamage', duration: 1 }
            ]
        },
        {
            id: 'nature-s-madness',
            name: '自然之怒',
            type: 'attack',
            cost: 3,
            rarity: 'legendary',
            pokemonType: 'grass',
            description: '造成敌人当前HP 50%的伤害。',
            effects: [{ type: 'damage', attackType: 'grass', percentDamage: 0.5 }]
        }
    ]
};

// 根据稀有度获取卡牌
function getCardsByRarity(rarity) {
    return CARDS_DATA.obtainable.filter(card => card.rarity === rarity);
}

// 获取随机卡牌奖励
function getRandomCardRewards(count = 3, options = {}) {
    const { excludeRarity = [], minRarity = 'common', includeItems = false } = options;
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

    const minIndex = rarityOrder.indexOf(minRarity);
    let availableCards = CARDS_DATA.obtainable.filter(card => {
        const cardIndex = rarityOrder.indexOf(card.rarity);
        return cardIndex >= minIndex && !excludeRarity.includes(card.rarity);
    });
    
    // 添加道具卡（较低概率）
    if (includeItems && typeof ITEM_CARDS_DATA !== 'undefined' && Math.random() < 0.3) {
        // 只添加普通和罕见稀有度的道具卡
        const itemCards = ITEM_CARDS_DATA.filter(card => {
            const cardIndex = rarityOrder.indexOf(card.rarity);
            return cardIndex >= minIndex && cardIndex <= 1 && !excludeRarity.includes(card.rarity);
        });
        // 随机选择1-2个道具卡加入池
        const numItems = Math.min(2, Math.floor(Math.random() * 2) + 1);
        const shuffledItems = itemCards.sort(() => Math.random() - 0.5);
        for (let i = 0; i < numItems && i < shuffledItems.length; i++) {
            availableCards.push(shuffledItems[i]);
        }
    }
    
    // 添加宝可梦卡（小概率）
    if (typeof POKEMON_DATA !== 'undefined' && Math.random() < 0.15) {
        const obtainablePokemon = POKEMON_DATA.obtainable.filter(p => !p.isLegendary);
        if (obtainablePokemon.length > 0) {
            const randomPokemon = obtainablePokemon[Math.floor(Math.random() * obtainablePokemon.length)];
            if (typeof createPokemonCard === 'function') {
                const pokemonCard = createPokemonCard(randomPokemon);
                availableCards.push(pokemonCard);
            }
        }
    }

    const selected = [];
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        selected.push({ ...shuffled[i] });
    }

    return selected;
}

// 获取卡牌数据
function getCardById(id) {
    const starter = CARDS_DATA.starter.find(c => c.id === id);
    if (starter) return { ...starter };

    const obtainable = CARDS_DATA.obtainable.find(c => c.id === id);
    if (obtainable) return { ...obtainable };

    return null;
}

// 创建初始牌组
function createStarterDeck() {
    const deck = [];

    // 5张抓
    for (let i = 0; i < 5; i++) {
        deck.push(getCardById('scratch'));
    }
    // 4张防御
    for (let i = 0; i < 4; i++) {
        deck.push(getCardById('defend'));
    }
    // 1张撞击
    deck.push(getCardById('tackle'));

    return deck;
}
