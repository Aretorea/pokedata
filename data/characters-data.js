// 角色数据
const CHARACTERS_DATA = [
    {
        id: 'trainer-red',
        name: '赤红',
        description: '来自真新镇的训练家，擅长全面培养宝可梦。',
        sprite: '🔴',
        startingHp: 80,
        startingGold: 99,
        startingDeck: ['scratch', 'scratch', 'defend', 'defend', 'tackle'],
        starterPokemon: ['charmander', 'squirtle', 'bulbasaur', 'pikachu'],
        passive: {
            name: '宝可梦大师',
            description: '所有宝可梦技能伤害 +10%，所有宝可梦牌获得时额外抽一张牌'
        },
        unlockCondition: '默认解锁'
    },
    {
        id: 'trainer-blue',
        name: '青绿',
        description: '赤红的宿敌，擅长攻击型战术。',
        sprite: '🟢',
        startingHp: 70,
        startingGold: 150,
        startingDeck: ['scratch', 'scratch', 'scratch', 'defend', 'bite'],
        starterPokemon: ['charmander', 'squirtle', 'bulbasaur', 'pikachu'],
        passive: {
            name: '进攻意识',
            description: '攻击牌伤害 +1，每击败一个敌人恢复 2 HP'
        },
        unlockCondition: '使用赤红通关一次'
    },
    {
        id: 'trainer-misty',
        name: '小霞',
        description: '华蓝市道馆馆主，水系宝可梦专家。',
        sprite: '🔵',
        startingHp: 85,
        startingGold: 100,
        startingDeck: ['water-gun', 'scratch', 'defend', 'defend', 'withdraw'],
        starterPokemon: ['squirtle', 'squirtle', 'squirtle'],
        passive: {
            name: '水系大师',
            description: '水系技能伤害 +20%，水系卡牌费用 -1'
        },
        unlockCondition: '使用水系宝可梦击败3个Boss'
    },
    {
        id: 'trainer-brock',
        name: '小刚',
        description: '深灰市道馆馆主，岩石系宝可梦专家。',
        sprite: '🟤',
        startingHp: 100,
        startingGold: 80,
        startingDeck: ['scratch', 'defend', 'defend', 'defend', 'harden'],
        starterPokemon: ['geodude', 'geodude', 'geodude'],
        passive: {
            name: '坚如磐石',
            description: '初始护盾 +5，护盾效果 +25%'
        },
        unlockCondition: '使用岩石系宝可梦击败3个Boss'
    },
    {
        id: 'trainer-lance',
        name: '小拉',
        description: '前冠军联盟成员，擅长防御型战术。',
        sprite: '🟡',
        startingHp: 90,
        startingGold: 80,
        startingDeck: ['scratch', 'defend', 'defend', 'defend', 'harden'],
        starterPokemon: ['bulbasaur', 'squirtle', 'charmander'],
        passive: {
            name: '防御专家',
            description: '初始护盾 +10，护盾效果 +15%'
        },
        unlockCondition: '使用防御型宝可梦击败3个Boss'
    }
];

// 获取角色数据
function getCharacterById(id) {
    return CHARACTERS_DATA.find(c => c.id === id) || null;
}

// 获取初始角色（默认解锁的）
function getStarterCharacters() {
    return CHARACTERS_DATA.filter(c => c.unlockCondition === '默认解锁');
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