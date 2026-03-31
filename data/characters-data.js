// 角色数据
const CHARACTERS_DATA = [
    {
        id: 'trainer-red',
        name: '赤红',
        description: '来自真新镇的训练家，擅长全面培养宝可梦。',
        sprite: '🧢',
        startingHp: 80,
        startingGold: 99,
        startingDeck: ['scratch', 'scratch', 'defend', 'defend', 'tackle'],
        starterPokemon: ['charmander', 'squirtle', 'bulbasaur', 'pikachu'],
        passive: {
            name: '宝可梦大师',
            description: '所有宝可梦技能伤害 +10%，所有宝可梦牌获得时额外抽一张牌',
            effects: [
                { type: 'pokemonDamageBonus', value: 0.1 },
                { type: 'drawOnPokemonGet', value: 1 }
            ]
        },
        // 训练家专属卡牌（加入奖励池）
        uniqueCards: ['pokeball', 'potion'],
        // 初始道具
        startingItems: ['item-potion'],
        unlockCondition: '默认解锁'
    },
    {
        id: 'trainer-blue',
        name: '青绿',
        description: '赤红的宿敌，擅长攻击型战术。',
        sprite: '🟣',
        startingHp: 70,
        startingGold: 150,
        startingDeck: ['scratch', 'scratch', 'scratch', 'defend', 'bite'],
        starterPokemon: ['charmander', 'squirtle', 'bulbasaur', 'pikachu'],
        passive: {
            name: '进攻意识',
            description: '攻击牌伤害 +1，每击败一个敌人恢复 2 HP',
            effects: [
                { type: 'attackDamageBonus', value: 1 },
                { type: 'healOnKill', value: 2 }
            ]
        },
        uniqueCards: ['slash', 'bite'],
        startingItems: ['item-x-attack'],
        unlockCondition: '使用赤红通关一次'
    },
    {
        id: 'trainer-misty',
        name: '小霞',
        description: '华蓝市道馆馆主，水系宝可梦专家。',
        sprite: '👧',
        startingHp: 85,
        startingGold: 100,
        startingDeck: ['water-gun', 'scratch', 'defend', 'defend', 'withdraw'],
        starterPokemon: ['squirtle', 'staryu', 'psyduck'],
        passive: {
            name: '水系大师',
            description: '水系技能伤害 +20%，水系卡牌费用 -1',
            effects: [
                { type: 'typeDamageBonus', elementType: 'water', value: 0.2 },
                { type: 'typeCostReduction', elementType: 'water', value: 1 }
            ]
        },
        uniqueCards: ['bubble-beam', 'hydro-pump'],
        startingItems: ['item-water-stone', 'item-potion'],
        unlockCondition: '使用水系宝可梦击败3个Boss'
    },
    {
        id: 'trainer-brock',
        name: '小刚',
        description: '深灰市道馆馆主，岩石系宝可梦专家。',
        sprite: '💪',
        startingHp: 100,
        startingGold: 80,
        startingDeck: ['scratch', 'defend', 'defend', 'defend', 'harden'],
        starterPokemon: ['geodude', 'onix', 'rhyhorn'],
        passive: {
            name: '坚如磐石',
            description: '初始护盾 +5，护盾效果 +25%',
            effects: [
                { type: 'startShield', value: 5 },
                { type: 'shieldBonus', value: 0.25 }
            ]
        },
        uniqueCards: ['rock-slide', 'iron-defense'],
        startingItems: ['item-x-defense', 'item-potion'],
        unlockCondition: '使用岩石系宝可梦击败3个Boss'
    },
    {
        id: 'trainer-lance',
        name: '小拉',
        description: '前冠军联盟成员，龙系宝可梦专家。',
        sprite: '🐉',
        startingHp: 90,
        startingGold: 120,
        startingDeck: ['scratch', 'defend', 'dragon-claw', 'defend', 'tackle'],
        starterPokemon: ['dratini', 'dragonair', 'horsea'],
        passive: {
            name: '龙之血脉',
            description: '龙系技能伤害 +30%，Boss战伤害额外 +15%',
            effects: [
                { type: 'typeDamageBonus', elementType: 'dragon', value: 0.3 },
                { type: 'bossDamageBonus', value: 0.15 }
            ]
        },
        uniqueCards: ['dragon-rush', 'dragon-dance'],
        startingItems: ['item-x-attack', 'item-potion'],
        unlockCondition: '击败3个Boss'
    },
    {
        id: 'trainer-erika',
        name: '艾莉嘉',
        description: '金黄市道馆馆主，草系宝可梦专家。',
        sprite: '🌸',
        startingHp: 85,
        startingGold: 100,
        startingDeck: ['scratch', 'vine-whip', 'defend', 'defend', 'growth'],
        starterPokemon: ['bulbasaur', 'oddish', 'bellsprout'],
        passive: {
            name: '自然之力',
            description: '草系技能伤害 +20%，每回合恢复 2 HP',
            effects: [
                { type: 'typeDamageBonus', elementType: 'grass', value: 0.2 },
                { type: 'turnHeal', value: 2 }
            ]
        },
        uniqueCards: ['razor-leaf', 'sleep-powder'],
        startingItems: ['item-leaf-stone', 'item-potion'],
        unlockCondition: '使用草系宝可梦击败3个Boss'
    },
    {
        id: 'trainer-surge',
        name: '马志士',
        description: '枯叶市道馆馆主，电系宝可梦专家。',
        sprite: '⚡',
        startingHp: 75,
        startingGold: 110,
        startingDeck: ['thunder-shock', 'scratch', 'defend', 'defend', 'quick-draw'],
        starterPokemon: ['pikachu', 'magnemite', 'voltorb'],
        passive: {
            name: '雷电之力',
            description: '电系技能伤害 +20%，麻痹效果持续时间 +1',
            effects: [
                { type: 'typeDamageBonus', elementType: 'electric', value: 0.2 },
                { type: 'statusDurationBonus', status: 'paralysis', value: 1 }
            ]
        },
        uniqueCards: ['thunderbolt', 'thunder-wave'],
        startingItems: ['item-thunder-stone', 'item-x-speed'],
        unlockCondition: '使用电系宝可梦击败3个Boss'
    }
];

// 获取角色数据
function getCharacterById(id) {
    return CHARACTERS_DATA.find(c => c.id === id) || null;
}

// 获取初始角色（默认解锁的）
function getStarterCharacters() {
    // 返回前4个角色供选择
    return CHARACTERS_DATA.slice(0, 4);
}

// 检查角色是否解锁
function isCharacterUnlocked(characterId, gameState) {
    const character = getCharacterById(characterId);
    if (!character) return false;

    if (character.unlockCondition === '默认解锁') return true;
    // 这里可以根据 gameState 检查解锁条件
    // 例如：击败Boss数量、使用特定类型宝可梦等
    if (gameState && gameState.unlockedCharacters) {
        return gameState.unlockedCharacters.includes(characterId);
    }
    return false;
}