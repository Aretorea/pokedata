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
            evolution: {
                evolvesTo: 'charmeleon',
                trigger: 'damage',  // 触发条件：累计伤害
                threshold: 50       // 阈值
            },
            evolutionProgress: 0,
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
            evolution: {
                evolvesTo: 'wartortle',
                trigger: 'damage',
                threshold: 50
            },
            evolutionProgress: 0,
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
            evolution: {
                evolvesTo: 'ivysaur',
                trigger: 'damage',
                threshold: 50
            },
            evolutionProgress: 0,
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
            evolution: {
                evolvesTo: 'raichu',
                trigger: 'damage',
                threshold: 40
            },
            evolutionProgress: 0,
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
            evolution: {
                evolvesTo: 'charizard',
                trigger: 'damage',
                threshold: 80
            },
            evolutionProgress: 0,
            skills: [
                { name: '火焰牙', damage: 8, energy: 1, type: 'fire' },
                { name: '火焰放射', damage: 15, energy: 2, type: 'fire', effect: 'burn' }
            ]
        },
        {
            id: 'charizard',
            name: '喷火龙',
            types: ['fire', 'flying'],
            hp: 130,
            maxHp: 130,
            sprite: '🐉',
            evolvesFrom: 'charmeleon',
            evolution: null,  // 最终形态
            skills: [
                { name: '火焰放射', damage: 12, energy: 1, type: 'fire', effect: 'burn' },
                { name: '飞翔', damage: 20, energy: 2, type: 'flying' }
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
            evolution: {
                evolvesTo: 'blastoise',
                trigger: 'damage',
                threshold: 80
            },
            evolutionProgress: 0,
            skills: [
                { name: '水炮', damage: 12, energy: 2, type: 'water' },
                { name: '保护', block: 10, energy: 1, type: 'water' }
            ]
        },
        {
            id: 'blastoise',
            name: '水箭龟',
            types: ['water'],
            hp: 140,
            maxHp: 140,
            sprite: '🐢',
            evolvesFrom: 'wartortle',
            evolution: null,
            skills: [
                { name: '加农光炮', damage: 15, energy: 2, type: 'water' },
                { name: '缩入壳中', block: 15, energy: 1, type: 'water' }
            ]
        },
        {
            id: 'ivysaur',
            name: '妙蛙草',
            types: ['grass', 'poison'],
            hp: 105,
            maxHp: 105,
            sprite: '🌿',
            evolvesFrom: 'bulbasaur',
            evolution: {
                evolvesTo: 'venusaur',
                trigger: 'damage',
                threshold: 80
            },
            evolutionProgress: 0,
            skills: [
                { name: '飞叶快刀', damage: 8, energy: 1, type: 'grass' },
                { name: '催眠粉', damage: 0, energy: 1, type: 'grass', effect: 'sleep' }
            ]
        },
        {
            id: 'venusaur',
            name: '妙蛙花',
            types: ['grass', 'poison'],
            hp: 135,
            maxHp: 135,
            sprite: '🌸',
            evolvesFrom: 'ivysaur',
            evolution: null,
            skills: [
                { name: '阳光烈焰', damage: 25, energy: 3, type: 'grass' },
                { name: '寄生种子', damage: 5, energy: 1, type: 'grass', effect: 'heal', healAmount: 5 }
            ]
        },
        {
            id: 'raichu',
            name: '雷丘',
            types: ['electric'],
            hp: 100,
            maxHp: 100,
            sprite: '⚡',
            evolvesFrom: 'pikachu',
            evolution: null,
            skills: [
                { name: '打雷', damage: 18, energy: 2, type: 'electric' },
                { name: '电光一闪', damage: 8, energy: 1, type: 'electric' }
            ]
        },
        {
            id: 'geodude',
            name: '小拳石',
            types: ['rock', 'ground'],
            hp: 80,
            maxHp: 80,
            sprite: '🪨',
            evolution: {
                evolvesTo: 'graveler',
                trigger: 'damage',
                threshold: 50
            },
            evolutionProgress: 0,
            skills: [
                { name: '落石', damage: 7, energy: 1, type: 'rock' },
                { name: '变硬', block: 8, energy: 1, type: 'rock' }
            ]
        },
        {
            id: 'graveler',
            name: '隆隆石',
            types: ['rock', 'ground'],
            hp: 100,
            maxHp: 100,
            sprite: '🪨',
            evolvesFrom: 'geodude',
            evolution: {
                evolvesTo: 'golem',
                trigger: 'damage',
                threshold: 70
            },
            evolutionProgress: 0,
            skills: [
                { name: '地震', damage: 15, energy: 2, type: 'ground' },
                { name: '岩石封锁', damage: 10, energy: 1, type: 'rock' }
            ]
        },
        {
            id: 'golem',
            name: '隆隆岩',
            types: ['rock', 'ground'],
            hp: 130,
            maxHp: 130,
            sprite: '🗿',
            evolvesFrom: 'graveler',
            evolution: null,
            skills: [
                { name: '地震', damage: 20, energy: 2, type: 'ground' },
                { name: '大爆炸', damage: 40, energy: 3, type: 'normal', selfDamage: 20 }
            ]
        },
        {
            id: 'gastly',
            name: '鬼斯',
            types: ['ghost', 'poison'],
            hp: 60,
            maxHp: 60,
            sprite: '👻',
            evolution: {
                evolvesTo: 'haunter',
                trigger: 'damage',
                threshold: 40
            },
            evolutionProgress: 0,
            skills: [
                { name: '舌舔', damage: 5, energy: 1, type: 'ghost' },
                { name: '诅咒', damage: 10, energy: 2, type: 'ghost', selfDamage: 2 }
            ]
        },
        {
            id: 'haunter',
            name: '鬼斯通',
            types: ['ghost', 'poison'],
            hp: 75,
            maxHp: 75,
            sprite: '👻',
            evolvesFrom: 'gastly',
            evolution: {
                evolvesTo: 'gengar',
                trigger: 'damage',
                threshold: 60
            },
            evolutionProgress: 0,
            skills: [
                { name: '暗影球', damage: 12, energy: 2, type: 'ghost' },
                { name: '祸不单行', damage: 8, energy: 1, type: 'ghost', bonusOnStatus: 5 }
            ]
        },
        {
            id: 'gengar',
            name: '耿鬼',
            types: ['ghost', 'poison'],
            hp: 95,
            maxHp: 95,
            sprite: '👻',
            evolvesFrom: 'haunter',
            evolution: null,
            skills: [
                { name: '暗影球', damage: 15, energy: 2, type: 'ghost' },
                { name: '恶梦', damage: 0, energy: 1, type: 'ghost', effect: 'sleep' }
            ]
        },
        {
            id: 'abra',
            name: '凯西',
            types: ['psychic'],
            hp: 50,
            maxHp: 50,
            sprite: '🔮',
            evolution: {
                evolvesTo: 'kadabra',
                trigger: 'damage',
                threshold: 35
            },
            evolutionProgress: 0,
            skills: [
                { name: '念力', damage: 8, energy: 1, type: 'psychic' },
                { name: '瞬间移动', block: 5, energy: 1, type: 'psychic', draw: 1 }
            ]
        },
        {
            id: 'kadabra',
            name: '勇基拉',
            types: ['psychic'],
            hp: 70,
            maxHp: 70,
            sprite: '🔮',
            evolvesFrom: 'abra',
            evolution: {
                evolvesTo: 'alakazam',
                trigger: 'damage',
                threshold: 60
            },
            evolutionProgress: 0,
            skills: [
                { name: '精神强念', damage: 12, energy: 2, type: 'psychic' },
                { name: '精神干扰', damage: 8, energy: 1, type: 'psychic' }
            ]
        },
        {
            id: 'alakazam',
            name: '胡地',
            types: ['psychic'],
            hp: 90,
            maxHp: 90,
            sprite: '🔮',
            evolvesFrom: 'kadabra',
            evolution: null,
            skills: [
                { name: '精神强念', damage: 18, energy: 2, type: 'psychic' },
                { name: '瞬间移动', block: 10, energy: 1, type: 'psychic', draw: 2 }
            ]
        },
        {
            id: 'machop',
            name: '腕力',
            types: ['fighting'],
            hp: 85,
            maxHp: 85,
            sprite: '💪',
            evolution: {
                evolvesTo: 'machoke',
                trigger: 'damage',
                threshold: 50
            },
            evolutionProgress: 0,
            skills: [
                { name: '空手劈', damage: 8, energy: 1, type: 'fighting' },
                { name: '蓄力', energy: 0, type: 'fighting', effect: 'strengthen', damageBonus: 3 }
            ]
        },
        {
            id: 'machoke',
            name: '豪力',
            types: ['fighting'],
            hp: 105,
            maxHp: 105,
            sprite: '💪',
            evolvesFrom: 'machop',
            evolution: {
                evolvesTo: 'machamp',
                trigger: 'damage',
                threshold: 70
            },
            evolutionProgress: 0,
            skills: [
                { name: '爆裂拳', damage: 12, energy: 2, type: 'fighting' },
                { name: '健美', block: 8, energy: 1, type: 'fighting', effect: 'strengthen', damageBonus: 2 }
            ]
        },
        {
            id: 'machamp',
            name: '怪力',
            types: ['fighting'],
            hp: 130,
            maxHp: 130,
            sprite: '💪',
            evolvesFrom: 'machoke',
            evolution: null,
            skills: [
                { name: '爆裂拳', damage: 15, energy: 2, type: 'fighting', hits: 3 },
                { name: '健美', block: 12, energy: 1, type: 'fighting', effect: 'strengthen', damageBonus: 3 }
            ]
        },
        {
            id: 'magikarp',
            name: '鲤鱼王',
            types: ['water'],
            hp: 40,
            maxHp: 40,
            sprite: '🐟',
            evolution: {
                evolvesTo: 'gyarados',
                trigger: 'turns',  // 特殊进化：回合数
                threshold: 5
            },
            evolutionProgress: 0,
            skills: [
                { name: '水溅跃', damage: 0, energy: 1, type: 'water' }
            ],
            special: '潜力股'
        },
        {
            id: 'gyarados',
            name: '暴鲤龙',
            types: ['water', 'flying'],
            hp: 150,
            maxHp: 150,
            sprite: '🐉',
            evolvesFrom: 'magikarp',
            evolution: null,
            skills: [
                { name: '水炮', damage: 20, energy: 2, type: 'water' },
                { name: '龙之怒', damage: 25, energy: 3, type: 'dragon' }
            ]
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

// 获取进化后的宝可梦
function getEvolutionPokemon(pokemonId) {
    const pokemon = getPokemonById(pokemonId);
    if (!pokemon || !pokemon.evolution) return null;

    return getPokemonById(pokemon.evolution.evolvesTo);
}

// 检查是否可以进化
function canEvolve(pokemon, triggerType, value) {
    if (!pokemon || !pokemon.evolution) return false;

    const evolution = pokemon.evolution;
    if (evolution.trigger !== triggerType) return false;

    return (pokemon.evolutionProgress || 0) + value >= evolution.threshold;
}

// 执行进化
function evolvePokemon(pokemon) {
    const evolution = getEvolutionPokemon(pokemon.id);
    if (!evolution) return null;

    // 计算进化后的状态
    const hpRatio = pokemon.hp / pokemon.maxHp;
    const newPokemon = {
        ...evolution,
        hp: Math.ceil(evolution.hp * hpRatio),  // 保持HP比例
        evolutionProgress: 0,
        statusEffects: pokemon.statusEffects ? [...pokemon.statusEffects] : []
    };

    return newPokemon;
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
    toxic: {
        name: '剧毒',
        damagePerTurn: 3,
        duration: 99  // 持续到战斗结束
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
    },
    shield: {
        name: '护盾',
        duration: 1
    }
};
