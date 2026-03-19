// 宝可梦数据
const POKEMON_DATA = {
    // 初始宝可梦（角色选择用）
    starters: [
        {
            id: 'charmander',
            name: '小火龙',
            types: ['fire'],
            hp: 80,
            maxHp: 80,
            sprite: '🔥',
            skills: [
                { name: '火花', damage: 6, energy: 1, type: 'fire' },
                { name: '火焰旋涡', damage: 8, energy: 2, type: 'fire', effect: 'burn' }
            ]
        },
        {
            id: 'squirtle',
            name: '杰尼龟',
            types: ['water'],
            hp: 90,
            maxHp: 90,
            sprite: '💧',
            skills: [
                { name: '水枪', damage: 5, energy: 1, type: 'water' },
                { name: '缩入壳中', block: 6, energy: 1, type: 'water' }
            ]
        },
        {
            id: 'bulbasaur',
            name: '妙蛙种子',
            types: ['grass'],
            hp: 85,
            maxHp: 85,
            sprite: '🌿',
            skills: [
                { name: '藤鞭', damage: 5, energy: 1, type: 'grass' },
                { name: '寄生种子', damage: 3, energy: 1, type: 'grass', effect: 'heal', healAmount: 3 }
            ]
        },
        {
            id: 'pikachu',
            name: '皮卡丘',
            types: ['electric'],
            hp: 70,
            maxHp: 70,
            sprite: '⚡',
            skills: [
                { name: '电击', damage: 4, energy: 1, type: 'electric' },
                { name: '十万伏特', damage: 10, energy: 2, type: 'electric', effect: 'paralysis' }
            ]
        }
    ],

    // 可获取的宝可梦（奖励/商店）
    obtainable: [
        {
            id: 'charmeleon',
            name: '火恐龙',
            types: ['fire'],
            hp: 100,
            maxHp: 100,
            sprite: '🔥',
            evolvesFrom: 'charmander',
            skills: [
                { name: '火焰牙', damage: 8, energy: 1, type: 'fire' },
                { name: '火焰放射', damage: 15, energy: 2, type: 'fire', effect: 'burn' }
            ]
        },
        {
            id: 'wartortle',
            name: '卡咪龟',
            types: ['water'],
            hp: 110,
            maxHp: 110,
            sprite: '💧',
            evolvesFrom: 'squirtle',
            skills: [
                { name: '水炮', damage: 12, energy: 2, type: 'water' },
                { name: '保护', block: 10, energy: 1, type: 'water' }
            ]
        },
        {
            id: 'ivysaur',
            name: '妙蛙草',
            types: ['grass'],
            hp: 105,
            maxHp: 105,
            sprite: '🌿',
            evolvesFrom: 'bulbasaur',
            skills: [
                { name: '飞叶快刀', damage: 8, energy: 1, type: 'grass' },
                { name: '催眠粉', damage: 0, energy: 1, type: 'grass', effect: 'sleep' }
            ]
        },
        {
            id: 'raichu',
            name: '雷丘',
            types: ['electric'],
            hp: 90,
            maxHp: 90,
            sprite: '⚡',
            evolvesFrom: 'pikachu',
            skills: [
                { name: '打雷', damage: 18, energy: 2, type: 'electric' },
                { name: '电光一闪', damage: 6, energy: 1, type: 'electric' }
            ]
        },
        {
            id: 'geodude',
            name: '小拳石',
            types: ['rock', 'ground'],
            hp: 80,
            maxHp: 80,
            sprite: '🪨',
            skills: [
                { name: '落石', damage: 7, energy: 1, type: 'rock' },
                { name: '变硬', block: 8, energy: 1, type: 'rock' }
            ]
        },
        {
            id: 'gastly',
            name: '鬼斯',
            types: ['ghost', 'poison'],
            hp: 60,
            maxHp: 60,
            sprite: '👻',
            skills: [
                { name: '舌舔', damage: 5, energy: 1, type: 'ghost' },
                { name: '诅咒', damage: 10, energy: 2, type: 'ghost', selfDamage: 2 }
            ]
        },
        {
            id: 'abra',
            name: '凯西',
            types: ['psychic'],
            hp: 50,
            maxHp: 50,
            sprite: '🔮',
            skills: [
                { name: '念力', damage: 8, energy: 1, type: 'psychic' },
                { name: '瞬间移动', block: 5, energy: 1, type: 'psychic', draw: 1 }
            ]
        },
        {
            id: 'machop',
            name: '腕力',
            types: ['fighting'],
            hp: 85,
            maxHp: 85,
            sprite: '💪',
            skills: [
                { name: '空手劈', damage: 8, energy: 1, type: 'fighting' },
                { name: '蓄力', energy: 0, type: 'fighting', effect: 'strengthen', damageBonus: 3 }
            ]
        },
        {
            id: 'magikarp',
            name: '鲤鱼王',
            types: ['water'],
            hp: 40,
            maxHp: 40,
            sprite: '🐟',
            skills: [
                { name: '水溅跃', damage: 0, energy: 1, type: 'water' }
            ],
            special: '潜力股'
        }
    ]
};

// 属性克制表
const TYPE_EFFECTIVENESS = {
    fire: { grass: 2, water: 0.5, fire: 0.5, ice: 2, bug: 2, steel: 2, dragon: 0.5 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { water: 2, fire: 0.5, grass: 0.5, ground: 2, rock: 2, flying: 0.5, bug: 0.5, poison: 0.5, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, flying: 0.5, poison: 0.5, bug: 0.5, psychic: 0.5, fairy: 0.5, ghost: 0 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, flying: 0, ice: 0.5 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
    normal: { ghost: 0, rock: 0.5, steel: 0.5 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 }
};

// 获取属性克制倍率
function getTypeEffectiveness(attackType, defenderTypes) {
    let multiplier = 1;
    for (const defenderType of defenderTypes) {
        if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defenderType] !== undefined) {
            multiplier *= TYPE_EFFECTIVENESS[attackType][defenderType];
        }
    }
    return multiplier;
}

// 获取宝可梦数据
function getPokemonById(id) {
    const starter = POKEMON_DATA.starters.find(p => p.id === id);
    if (starter) return { ...starter };

    const obtainable = POKEMON_DATA.obtainable.find(p => p.id === id);
    if (obtainable) return { ...obtainable };

    return null;
}

// 状态效果定义
const STATUS_EFFECTS = {
    burn: {
        name: '灼伤',
        damagePerTurn: 2,
        duration: 3
    },
    poison: {
        name: '中毒',
        damagePerTurn: 3,
        duration: 4
    },
    paralysis: {
        name: '麻痹',
        skipChance: 0.25,
        duration: 2
    },
    sleep: {
        name: '睡眠',
        wakeChance: 0.5,
        duration: 2
    },
    freeze: {
        name: '冰冻',
        thawChance: 0.2,
        duration: 3
    }
};
