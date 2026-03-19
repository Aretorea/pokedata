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
        }
    ]
};

// 根据稀有度获取卡牌
function getCardsByRarity(rarity) {
    return CARDS_DATA.obtainable.filter(card => card.rarity === rarity);
}

// 获取随机卡牌奖励
function getRandomCardRewards(count = 3, options = {}) {
    const { excludeRarity = [], minRarity = 'common' } = options;
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

    const minIndex = rarityOrder.indexOf(minRarity);
    const availableCards = CARDS_DATA.obtainable.filter(card => {
        const cardIndex = rarityOrder.indexOf(card.rarity);
        return cardIndex >= minIndex && !excludeRarity.includes(card.rarity);
    });

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
