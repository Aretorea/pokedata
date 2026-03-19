// 敌人数据
const ENEMIES_DATA = {
    // 第一层敌人
    floor1: [
        {
            id: 'ratatta',
            name: '小拉达',
            types: ['normal'],
            hp: 40,
            maxHp: 40,
            sprite: '🐀',
            moves: [
                { name: '撞击', damage: 5, intent: 'attack' },
                { name: '摇尾巴', effect: 'weaken', intent: 'debuff' }
            ],
            pattern: ['attack', 'attack', 'debuff'],
            goldReward: [5, 10]
        },
        {
            id: 'pidgey',
            name: '波波',
            types: ['normal', 'flying'],
            hp: 35,
            maxHp: 35,
            sprite: '🐦',
            moves: [
                { name: '啄', damage: 4, intent: 'attack' },
                { name: '起风', damage: 6, intent: 'attack' }
            ],
            pattern: ['attack', 'attack', 'attack'],
            goldReward: [5, 8]
        },
        {
            id: 'caterpie',
            name: '绿毛虫',
            types: ['bug'],
            hp: 30,
            maxHp: 30,
            sprite: '🐛',
            moves: [
                { name: '撞击', damage: 3, intent: 'attack' },
                { name: '吐丝', effect: 'slow', intent: 'debuff' }
            ],
            pattern: ['attack', 'debuff', 'attack'],
            goldReward: [4, 7]
        },
        {
            id: 'weedle',
            name: '独角虫',
            types: ['bug', 'poison'],
            hp: 32,
            maxHp: 32,
            sprite: '🐝',
            moves: [
                { name: '毒针', damage: 3, effect: 'poison', intent: 'attack' },
                { name: '撞击', damage: 4, intent: 'attack' }
            ],
            pattern: ['attack', 'attack', 'attack'],
            goldReward: [5, 8]
        }
    ],

    // 第二层敌人
    floor2: [
        {
            id: 'raticate',
            name: '拉达',
            types: ['normal'],
            hp: 65,
            maxHp: 65,
            sprite: '🐀',
            moves: [
                { name: '必杀门牙', damage: 12, intent: 'attack' },
                { name: '咬碎', damage: 8, intent: 'attack' },
                { name: '聚气', effect: 'strengthen', intent: 'buff' }
            ],
            pattern: ['attack', 'attack', 'buff'],
            goldReward: [12, 18]
        },
        {
            id: 'pidgeotto',
            name: '比比鸟',
            types: ['normal', 'flying'],
            hp: 60,
            maxHp: 60,
            sprite: '🦅',
            moves: [
                { name: '翅膀攻击', damage: 8, intent: 'attack' },
                { name: '风之刃', damage: 10, intent: 'attack' },
                { name: '羽毛舞', effect: 'weaken', intent: 'debuff' }
            ],
            pattern: ['attack', 'attack', 'debuff'],
            goldReward: [10, 15]
        },
        {
            id: 'arbok',
            name: '阿柏怪',
            types: ['poison'],
            hp: 70,
            maxHp: 70,
            sprite: '🐍',
            moves: [
                { name: '毒击', damage: 6, effect: 'poison', intent: 'attack' },
                { name: '大蛇瞪眼', effect: 'paralyze', intent: 'debuff' },
                { name: '咬碎', damage: 10, intent: 'attack' }
            ],
            pattern: ['attack', 'debuff', 'attack'],
            goldReward: [12, 18]
        },
        {
            id: 'sandslash',
            name: '穿山王',
            types: ['ground'],
            hp: 75,
            maxHp: 75,
            sprite: '🦔',
            moves: [
                { name: '劈开', damage: 10, intent: 'attack' },
                { name: '乱击', damage: 6, hits: 2, intent: 'attack' },
                { name: '变圆', block: 8, intent: 'defend' }
            ],
            pattern: ['attack', 'attack', 'defend'],
            goldReward: [11, 16]
        }
    ],

    // 第三层敌人
    floor3: [
        {
            id: 'golem',
            name: '隆隆岩',
            types: ['rock', 'ground'],
            hp: 90,
            maxHp: 90,
            sprite: '🪨',
            moves: [
                { name: '地震', damage: 18, intent: 'attack' },
                { name: '岩石封锁', damage: 8, effect: 'slow', intent: 'attack' },
                { name: '大爆炸', damage: 30, selfDamage: 50, intent: 'attack' }
            ],
            pattern: ['attack', 'attack', 'attack'],
            goldReward: [18, 25]
        },
        {
            id: 'alakazam',
            name: '胡地',
            types: ['psychic'],
            hp: 70,
            maxHp: 70,
            sprite: '🔮',
            moves: [
                { name: '精神强念', damage: 14, intent: 'attack' },
                { name: '精神干扰', damage: 10, effect: 'confusion', intent: 'attack' },
                { name: '瞬间移动', effect: 'dodge', intent: 'defend' }
            ],
            pattern: ['attack', 'attack', 'defend'],
            goldReward: [20, 28]
        },
        {
            id: 'gengar',
            name: '耿鬼',
            types: ['ghost', 'poison'],
            hp: 80,
            maxHp: 80,
            sprite: '👻',
            moves: [
                { name: '暗影球', damage: 15, intent: 'attack' },
                { name: '祸不单行', damage: 10, bonusOnStatus: 8, intent: 'attack' },
                { name: '恶梦', effect: 'sleep', intent: 'debuff' }
            ],
            pattern: ['attack', 'attack', 'debuff'],
            goldReward: [22, 30]
        }
    ],

    // 精英敌人
    elite: [
        {
            id: 'onix',
            name: '大岩蛇',
            types: ['rock', 'ground'],
            hp: 100,
            maxHp: 100,
            sprite: '🐍',
            isElite: true,
            moves: [
                { name: '落石', damage: 12, intent: 'attack' },
                { name: '变硬', block: 15, intent: 'defend' },
                { name: '地震', damage: 16, intent: 'attack' },
                { name: '岩石封闭', damage: 10, effect: 'slow', intent: 'attack' }
            ],
            pattern: ['defend', 'attack', 'attack', 'attack'],
            goldReward: [35, 50]
        },
        {
            id: 'gyarados',
            name: '暴鲤龙',
            types: ['water', 'flying'],
            hp: 120,
            maxHp: 120,
            sprite: '🐉',
            isElite: true,
            moves: [
                { name: '水炮', damage: 20, intent: 'attack' },
                { name: '龙之怒', damage: 15, intent: 'attack' },
                { name: '咬碎', damage: 12, intent: 'attack' },
                { name: '龙之舞', effect: 'strengthen', intent: 'buff' }
            ],
            pattern: ['attack', 'attack', 'attack', 'buff'],
            goldReward: [45, 60]
        },
        {
            id: 'machamp',
            name: '怪力',
            types: ['fighting'],
            hp: 110,
            maxHp: 110,
            sprite: '💪',
            isElite: true,
            moves: [
                { name: '空手劈', damage: 12, intent: 'attack' },
                { name: '爆裂拳', damage: 8, hits: 3, intent: 'attack' },
                { name: '十字劈', damage: 18, intent: 'attack' },
                { name: '健美', block: 10, effect: 'strengthen', intent: 'buff' }
            ],
            pattern: ['attack', 'attack', 'attack', 'buff'],
            goldReward: [40, 55]
        }
    ],

    // Boss
    bosses: [
        {
            id: 'charizard-boss',
            name: '喷火龙',
            types: ['fire', 'flying'],
            hp: 150,
            maxHp: 150,
            sprite: '🔥',
            isBoss: true,
            moves: [
                { name: '火焰放射', damage: 15, effect: 'burn', intent: 'attack' },
                { name: '飞翔', damage: 20, intent: 'attack', selfBlock: 5 },
                { name: '龙之怒', damage: 18, intent: 'attack' },
                { name: '火焰旋涡', damage: 12, effect: 'trap', intent: 'attack' },
                { name: '吼叫', effect: 'fear', intent: 'debuff' }
            ],
            pattern: ['attack', 'attack', 'attack', 'attack', 'debuff'],
            goldReward: [80, 100]
        },
        {
            id: 'blastoise-boss',
            name: '水箭龟',
            types: ['water'],
            hp: 160,
            maxHp: 160,
            sprite: '💧',
            isBoss: true,
            moves: [
                { name: '水炮', damage: 22, intent: 'attack' },
                { name: '加农光炮', damage: 16, intent: 'attack' },
                { name: '缩入壳中', block: 20, intent: 'defend' },
                { name: '火箭头锤', damage: 14, intent: 'attack' },
                { name: '潮汐', damage: 18, intent: 'attack' }
            ],
            pattern: ['attack', 'attack', 'defend', 'attack', 'attack'],
            goldReward: [85, 105]
        },
        {
            id: 'venusaur-boss',
            name: '妙蛙花',
            types: ['grass', 'poison'],
            hp: 155,
            maxHp: 155,
            sprite: '🌿',
            isBoss: true,
            moves: [
                { name: '飞叶快刀', damage: 14, intent: 'attack' },
                { name: '阳光烈焰', damage: 25, intent: 'attack', charge: 1 },
                { name: '寄生种子', damage: 8, effect: 'leech', intent: 'attack' },
                { name: '催眠粉', effect: 'sleep', intent: 'debuff' },
                { name: '毒粉', effect: 'poison', intent: 'debuff' }
            ],
            pattern: ['attack', 'attack', 'attack', 'debuff', 'debuff'],
            goldReward: [82, 102]
        }
    ]
};

// 获取敌人数据
function getEnemyById(id) {
    for (const floor of Object.values(ENEMIES_DATA)) {
        const enemy = floor.find(e => e.id === id);
        if (enemy) return { ...enemy };
    }
    return null;
}

// 获取当前层随机敌人
function getRandomEnemy(floor) {
    const floorKey = `floor${floor}`;
    const enemies = ENEMIES_DATA[floorKey];

    if (!enemies || enemies.length === 0) {
        // 如果没有该层的敌人，使用第一层
        return { ...ENEMIES_DATA.floor1[Math.floor(Math.random() * ENEMIES_DATA.floor1.length)] };
    }

    return { ...enemies[Math.floor(Math.random() * enemies.length)] };
}

// 获取随机精英
function getRandomElite() {
    const elites = ENEMIES_DATA.elite;
    return { ...elites[Math.floor(Math.random() * elites.length)] };
}

// 获取随机Boss
function getRandomBoss() {
    const bosses = ENEMIES_DATA.bosses;
    return { ...bosses[Math.floor(Math.random() * bosses.length)] };
}

// 敌人AI - 根据模式决定下一步行动
function getEnemyMove(enemy, turnCount) {
    const pattern = enemy.pattern;
    const moveIndex = turnCount % pattern.length;
    const intentType = pattern[moveIndex];

    const matchingMoves = enemy.moves.filter(move => move.intent === intentType);

    if (matchingMoves.length === 0) {
        // 如果没有匹配的意图，随机选择一个攻击
        return enemy.moves.find(move => move.intent === 'attack') || enemy.moves[0];
    }

    return matchingMoves[Math.floor(Math.random() * matchingMoves.length)];
}
