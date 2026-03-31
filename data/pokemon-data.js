/**
 * 宝可梦数据
 * 包含完整的四维数值（物攻/物防/特攻/特防）和特性系统
 */

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
            // 四维数值
            attack: 52,      // 物攻
            defense: 43,     // 物防
            spAttack: 60,    // 特攻
            spDefense: 50,   // 特防
            // 特性
            ability: 'blaze',
            abilityName: '猛火',
            // 进化系统
            evolution: {
                evolvesTo: 'charmeleon',
                trigger: 'battleWins',  // 战斗胜利次数
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '火花', damage: 6, energy: 1, type: 'fire', skillType: 'special' },
                { name: '火焰旋涡', damage: 8, energy: 2, type: 'fire', effect: 'burn', skillType: 'special' }
            ]
        },
        {
            id: 'squirtle',
            name: '杰尼龟',
            types: ['water'],
            hp: 90,
            maxHp: 90,
            sprite: '💧',
            attack: 48,
            defense: 65,
            spAttack: 50,
            spDefense: 64,
            ability: 'torrent',
            abilityName: '激流',
            evolution: {
                evolvesTo: 'wartortle',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '水枪', damage: 5, energy: 1, type: 'water', skillType: 'special' },
                { name: '缩入壳中', block: 6, energy: 1, type: 'water', skillType: 'ability' }
            ]
        },
        {
            id: 'bulbasaur',
            name: '妙蛙种子',
            types: ['grass', 'poison'],
            hp: 85,
            maxHp: 85,
            sprite: '🌿',
            attack: 49,
            defense: 49,
            spAttack: 65,
            spDefense: 65,
            ability: 'overgrow',
            abilityName: '茂盛',
            evolution: {
                evolvesTo: 'ivysaur',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '藤鞭', damage: 5, energy: 1, type: 'grass', skillType: 'physical' },
                { name: '寄生种子', damage: 3, energy: 1, type: 'grass', effect: 'heal', healAmount: 3, skillType: 'ability' }
            ]
        },
        {
            id: 'pikachu',
            name: '皮卡丘',
            types: ['electric'],
            hp: 70,
            maxHp: 70,
            sprite: '⚡',
            attack: 55,
            defense: 40,
            spAttack: 50,
            spDefense: 50,
            ability: 'static',
            abilityName: '静电',
            evolution: {
                evolvesTo: 'raichu',
                trigger: 'item',  // 道具进化
                requiredItem: 'thunder-stone'
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '电击', damage: 4, energy: 1, type: 'electric', skillType: 'special' },
                { name: '十万伏特', damage: 10, energy: 2, type: 'electric', effect: 'paralysis', skillType: 'special' }
            ]
        }
    ],

    // 可获取的宝可梦（奖励/商店）
    obtainable: [
        // ====== 火系进化链 ======
        {
            id: 'charmeleon',
            name: '火恐龙',
            types: ['fire'],
            hp: 100,
            maxHp: 100,
            sprite: '🔥',
            attack: 64,
            defense: 58,
            spAttack: 80,
            spDefense: 65,
            evolvesFrom: 'charmander',
            ability: 'blaze',
            abilityName: '猛火',
            evolution: {
                evolvesTo: 'charizard',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '火焰牙', damage: 8, energy: 1, type: 'fire', skillType: 'physical' },
                { name: '火焰放射', damage: 15, energy: 2, type: 'fire', effect: 'burn', skillType: 'special' }
            ]
        },
        {
            id: 'charizard',
            name: '喷火龙',
            types: ['fire', 'flying'],
            hp: 130,
            maxHp: 130,
            sprite: '🐉',
            attack: 84,
            defense: 78,
            spAttack: 109,
            spDefense: 85,
            evolvesFrom: 'charmeleon',
            ability: 'blaze',
            abilityName: '猛火',
            evolution: null,
            megaEvolution: 'charizard-mega-x',  // 超级进化
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '火焰放射', damage: 12, energy: 1, type: 'fire', effect: 'burn', skillType: 'special' },
                { name: '飞翔', damage: 20, energy: 2, type: 'flying', skillType: 'physical' },
                { name: '龙之怒', damage: 15, energy: 2, type: 'dragon', skillType: 'special' }
            ]
        },

        // ====== 水系进化链 ======
        {
            id: 'wartortle',
            name: '卡咪龟',
            types: ['water'],
            hp: 110,
            maxHp: 110,
            sprite: '💧',
            attack: 63,
            defense: 80,
            spAttack: 65,
            spDefense: 80,
            evolvesFrom: 'squirtle',
            ability: 'torrent',
            abilityName: '激流',
            evolution: {
                evolvesTo: 'blastoise',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '水炮', damage: 12, energy: 2, type: 'water', skillType: 'special' },
                { name: '保护', block: 10, energy: 1, type: 'water', skillType: 'ability' }
            ]
        },
        {
            id: 'blastoise',
            name: '水箭龟',
            types: ['water'],
            hp: 140,
            maxHp: 140,
            sprite: '🐢',
            attack: 83,
            defense: 100,
            spAttack: 85,
            spDefense: 105,
            evolvesFrom: 'wartortle',
            ability: 'torrent',
            abilityName: '激流',
            evolution: null,
            megaEvolution: 'blastoise-mega',
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '加农光炮', damage: 15, energy: 2, type: 'water', skillType: 'special' },
                { name: '缩入壳中', block: 15, energy: 1, type: 'water', skillType: 'ability' },
                { name: '水炮', damage: 18, energy: 2, type: 'water', skillType: 'special' }
            ]
        },

        // ====== 草系进化链 ======
        {
            id: 'ivysaur',
            name: '妙蛙草',
            types: ['grass', 'poison'],
            hp: 105,
            maxHp: 105,
            sprite: '🌿',
            attack: 62,
            defense: 63,
            spAttack: 80,
            spDefense: 80,
            evolvesFrom: 'bulbasaur',
            ability: 'overgrow',
            abilityName: '茂盛',
            evolution: {
                evolvesTo: 'venusaur',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '飞叶快刀', damage: 8, energy: 1, type: 'grass', skillType: 'physical' },
                { name: '催眠粉', damage: 0, energy: 1, type: 'grass', effect: 'sleep', skillType: 'ability' }
            ]
        },
        {
            id: 'venusaur',
            name: '妙蛙花',
            types: ['grass', 'poison'],
            hp: 135,
            maxHp: 135,
            sprite: '🌸',
            attack: 82,
            defense: 83,
            spAttack: 100,
            spDefense: 100,
            evolvesFrom: 'ivysaur',
            ability: 'overgrow',
            abilityName: '茂盛',
            evolution: null,
            megaEvolution: 'venusaur-mega',
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '阳光烈焰', damage: 25, energy: 3, type: 'grass', skillType: 'special' },
                { name: '寄生种子', damage: 5, energy: 1, type: 'grass', effect: 'heal', healAmount: 5, skillType: 'ability' },
                { name: '污泥 bomb', damage: 12, energy: 2, type: 'poison', skillType: 'special' }
            ]
        },

        // ====== 电系进化链 ======
        {
            id: 'raichu',
            name: '雷丘',
            types: ['electric'],
            hp: 100,
            maxHp: 100,
            sprite: '⚡',
            attack: 90,
            defense: 55,
            spAttack: 90,
            spDefense: 80,
            evolvesFrom: 'pikachu',
            ability: 'static',
            abilityName: '静电',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '打雷', damage: 18, energy: 2, type: 'electric', skillType: 'special' },
                { name: '电光一闪', damage: 8, energy: 1, type: 'electric', skillType: 'physical' },
                { name: '十万伏特', damage: 15, energy: 2, type: 'electric', effect: 'paralysis', skillType: 'special' }
            ]
        },

        // ====== 岩石系进化链 ======
        {
            id: 'geodude',
            name: '小拳石',
            types: ['rock', 'ground'],
            hp: 80,
            maxHp: 80,
            sprite: '🪨',
            attack: 80,
            defense: 100,
            spAttack: 30,
            spDefense: 40,
            ability: 'rock_head',
            abilityName: '坚硬脑袋',
            evolution: {
                evolvesTo: 'graveler',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '落石', damage: 7, energy: 1, type: 'rock', skillType: 'physical' },
                { name: '变硬', block: 8, energy: 1, type: 'rock', skillType: 'ability' }
            ]
        },
        {
            id: 'graveler',
            name: '隆隆石',
            types: ['rock', 'ground'],
            hp: 100,
            maxHp: 100,
            sprite: '🪨',
            attack: 95,
            defense: 115,
            spAttack: 45,
            spDefense: 55,
            evolvesFrom: 'geodude',
            ability: 'rock_head',
            abilityName: '坚硬脑袋',
            evolution: {
                evolvesTo: 'golem',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '地震', damage: 15, energy: 2, type: 'ground', skillType: 'physical' },
                { name: '岩石封锁', damage: 10, energy: 1, type: 'rock', skillType: 'physical' }
            ]
        },
        {
            id: 'golem',
            name: '隆隆岩',
            types: ['rock', 'ground'],
            hp: 130,
            maxHp: 130,
            sprite: '🗿',
            attack: 120,
            defense: 130,
            spAttack: 55,
            spDefense: 65,
            evolvesFrom: 'graveler',
            ability: 'rock_head',
            abilityName: '坚硬脑袋',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '地震', damage: 20, energy: 2, type: 'ground', skillType: 'physical' },
                { name: '大爆炸', damage: 40, energy: 3, type: 'normal', selfDamage: 20, skillType: 'physical' },
                { name: '尖石攻击', damage: 18, energy: 2, type: 'rock', critChance: 0.3, skillType: 'physical' }
            ]
        },

        // ====== 幽灵系进化链 ======
        {
            id: 'gastly',
            name: '鬼斯',
            types: ['ghost', 'poison'],
            hp: 60,
            maxHp: 60,
            sprite: '👻',
            attack: 35,
            defense: 30,
            spAttack: 100,
            spDefense: 35,
            ability: 'levitate',
            abilityName: '漂浮',
            evolution: {
                evolvesTo: 'haunter',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '舌舔', damage: 5, energy: 1, type: 'ghost', skillType: 'physical' },
                { name: '暗影球', damage: 10, energy: 2, type: 'ghost', skillType: 'special' }
            ]
        },
        {
            id: 'haunter',
            name: '鬼斯通',
            types: ['ghost', 'poison'],
            hp: 75,
            maxHp: 75,
            sprite: '👻',
            attack: 50,
            defense: 45,
            spAttack: 115,
            spDefense: 55,
            evolvesFrom: 'gastly',
            ability: 'levitate',
            abilityName: '漂浮',
            evolution: {
                evolvesTo: 'gengar',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '暗影球', damage: 12, energy: 2, type: 'ghost', skillType: 'special' },
                { name: '祸不单行', damage: 8, energy: 1, type: 'ghost', bonusOnStatus: 5, skillType: 'special' }
            ]
        },
        {
            id: 'gengar',
            name: '耿鬼',
            types: ['ghost', 'poison'],
            hp: 95,
            maxHp: 95,
            sprite: '👻',
            attack: 65,
            defense: 60,
            spAttack: 130,
            spDefense: 75,
            evolvesFrom: 'haunter',
            ability: 'cursed_body',
            abilityName: '诅咒之躯',
            evolution: null,
            megaEvolution: 'gengar-mega',
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '暗影球', damage: 15, energy: 2, type: 'ghost', skillType: 'special' },
                { name: '恶梦', damage: 0, energy: 1, type: 'ghost', effect: 'sleep', skillType: 'ability' },
                { name: '污泥 bomb', damage: 14, energy: 2, type: 'poison', skillType: 'special' }
            ]
        },

        // ====== 超能力系进化链 ======
        {
            id: 'abra',
            name: '凯西',
            types: ['psychic'],
            hp: 50,
            maxHp: 50,
            sprite: '🔮',
            attack: 20,
            defense: 15,
            spAttack: 105,
            spDefense: 55,
            ability: 'synchronization',
            abilityName: '同步',
            evolution: {
                evolvesTo: 'kadabra',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '念力', damage: 8, energy: 1, type: 'psychic', skillType: 'special' },
                { name: '瞬间移动', block: 5, energy: 1, type: 'psychic', draw: 1, skillType: 'ability' }
            ]
        },
        {
            id: 'kadabra',
            name: '勇基拉',
            types: ['psychic'],
            hp: 70,
            maxHp: 70,
            sprite: '🔮',
            attack: 35,
            defense: 30,
            spAttack: 120,
            spDefense: 70,
            evolvesFrom: 'abra',
            ability: 'synchronization',
            abilityName: '同步',
            evolution: {
                evolvesTo: 'alakazam',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '精神强念', damage: 12, energy: 2, type: 'psychic', skillType: 'special' },
                { name: '精神干扰', damage: 8, energy: 1, type: 'psychic', skillType: 'special' }
            ]
        },
        {
            id: 'alakazam',
            name: '胡地',
            types: ['psychic'],
            hp: 90,
            maxHp: 90,
            sprite: '🔮',
            attack: 50,
            defense: 45,
            spAttack: 135,
            spDefense: 95,
            evolvesFrom: 'kadabra',
            ability: 'synchronization',
            abilityName: '同步',
            evolution: null,
            megaEvolution: 'alakazam-mega',
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '精神强念', damage: 18, energy: 2, type: 'psychic', skillType: 'special' },
                { name: '瞬间移动', block: 10, energy: 1, type: 'psychic', draw: 2, skillType: 'ability' },
                { name: '未来预知', damage: 25, energy: 3, type: 'psychic', skillType: 'special' }
            ]
        },

        // ====== 格斗系进化链 ======
        {
            id: 'machop',
            name: '腕力',
            types: ['fighting'],
            hp: 85,
            maxHp: 85,
            sprite: '💪',
            attack: 80,
            defense: 50,
            spAttack: 35,
            spDefense: 35,
            ability: 'guts',
            abilityName: '毅力',
            evolution: {
                evolvesTo: 'machoke',
                trigger: 'battleWins',
                threshold: 3
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '空手劈', damage: 8, energy: 1, type: 'fighting', skillType: 'physical' },
                { name: '蓄力', energy: 0, type: 'fighting', effect: 'strengthen', damageBonus: 3, skillType: 'ability' }
            ]
        },
        {
            id: 'machoke',
            name: '豪力',
            types: ['fighting'],
            hp: 105,
            maxHp: 105,
            sprite: '💪',
            attack: 100,
            defense: 70,
            spAttack: 50,
            spDefense: 60,
            evolvesFrom: 'machop',
            ability: 'guts',
            abilityName: '毅力',
            evolution: {
                evolvesTo: 'machamp',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '爆裂拳', damage: 12, energy: 2, type: 'fighting', skillType: 'physical' },
                { name: '健美', block: 8, energy: 1, type: 'fighting', effect: 'strengthen', damageBonus: 2, skillType: 'ability' }
            ]
        },
        {
            id: 'machamp',
            name: '怪力',
            types: ['fighting'],
            hp: 130,
            maxHp: 130,
            sprite: '💪',
            attack: 130,
            defense: 80,
            spAttack: 65,
            spDefense: 85,
            evolvesFrom: 'machoke',
            ability: 'guts',
            abilityName: '毅力',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '爆裂拳', damage: 15, energy: 2, type: 'fighting', hits: 3, skillType: 'physical' },
                { name: '健美', block: 12, energy: 1, type: 'fighting', effect: 'strengthen', damageBonus: 3, skillType: 'ability' },
                { name: '近身战', damage: 20, energy: 2, type: 'fighting', skillType: 'physical' }
            ]
        },

        // ====== 特殊进化：鲤鱼王 -> 暴鲤龙 ======
        {
            id: 'magikarp',
            name: '鲤鱼王',
            types: ['water'],
            hp: 40,
            maxHp: 40,
            sprite: '🐟',
            attack: 10,
            defense: 55,
            spAttack: 15,
            spDefense: 20,
            ability: 'swift_swim',
            abilityName: '悠游自如',
            evolution: {
                evolvesTo: 'gyarados',
                trigger: 'battleWins',
                threshold: 5
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            special: '潜力股',
            skills: [
                { name: '水溅跃', damage: 0, energy: 1, type: 'water', skillType: 'ability' },
                { name: '撞击', damage: 3, energy: 1, type: 'normal', skillType: 'physical' }
            ]
        },
        {
            id: 'gyarados',
            name: '暴鲤龙',
            types: ['water', 'flying'],
            hp: 150,
            maxHp: 150,
            sprite: '🐉',
            attack: 125,
            defense: 79,
            spAttack: 60,
            spDefense: 100,
            evolvesFrom: 'magikarp',
            ability: 'intimidate',
            abilityName: '威吓',
            evolution: null,
            megaEvolution: 'gyarados-mega',
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '水炮', damage: 20, energy: 2, type: 'water', skillType: 'special' },
                { name: '龙之怒', damage: 25, energy: 3, type: 'dragon', skillType: 'special' },
                { name: '暴风', damage: 18, energy: 2, type: 'flying', skillType: 'special' }
            ]
        },

        // ====== 伊布进化家族 ======
        {
            id: 'eevee',
            name: '伊布',
            types: ['normal'],
            hp: 75,
            maxHp: 75,
            sprite: '🦊',
            attack: 55,
            defense: 50,
            spAttack: 45,
            spDefense: 65,
            ability: 'adaptability',
            abilityName: '适应力',
            evolution: {
                trigger: 'item',
                evolvesTo: ['vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon']
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '撞击', damage: 5, energy: 1, type: 'normal', skillType: 'physical' },
                { name: '摇尾巴', energy: 0, type: 'normal', effect: 'weaken', skillType: 'ability' }
            ]
        },
        {
            id: 'vaporeon',
            name: '水伊布',
            types: ['water'],
            hp: 130,
            maxHp: 130,
            sprite: '💧',
            attack: 65,
            defense: 60,
            spAttack: 110,
            spDefense: 95,
            evolvesFrom: 'eevee',
            ability: 'water_absorb',
            abilityName: '储水',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '水炮', damage: 18, energy: 2, type: 'water', skillType: 'special' },
                { name: '溶解液', damage: 10, energy: 1, type: 'poison', skillType: 'special' }
            ]
        },
        {
            id: 'jolteon',
            name: '雷伊布',
            types: ['electric'],
            hp: 95,
            maxHp: 95,
            sprite: '⚡',
            attack: 65,
            defense: 60,
            spAttack: 110,
            spDefense: 95,
            evolvesFrom: 'eevee',
            ability: 'volt_absorb',
            abilityName: '蓄电',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '十万伏特', damage: 15, energy: 2, type: 'electric', effect: 'paralysis', skillType: 'special' },
                { name: '打雷', damage: 20, energy: 3, type: 'electric', skillType: 'special' }
            ]
        },
        {
            id: 'flareon',
            name: '火伊布',
            types: ['fire'],
            hp: 95,
            maxHp: 95,
            sprite: '🔥',
            attack: 130,
            defense: 60,
            spAttack: 95,
            spDefense: 110,
            evolvesFrom: 'eevee',
            ability: 'guts',
            abilityName: '毅力',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '火焰放射', damage: 15, energy: 2, type: 'fire', effect: 'burn', skillType: 'special' },
                { name: '闪焰冲锋', damage: 20, energy: 2, type: 'fire', selfDamage: 3, skillType: 'physical' }
            ]
        },
        {
            id: 'espeon',
            name: '太阳伊布',
            types: ['psychic'],
            hp: 95,
            maxHp: 95,
            sprite: '🔮',
            attack: 65,
            defense: 60,
            spAttack: 130,
            spDefense: 95,
            evolvesFrom: 'eevee',
            ability: 'magic_bounce',
            abilityName: '魔法镜',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '精神强念', damage: 15, energy: 2, type: 'psychic', skillType: 'special' },
                { name: '晨光', heal: 15, energy: 1, type: 'normal', skillType: 'ability' }
            ]
        },
        {
            id: 'umbreon',
            name: '月亮伊布',
            types: ['dark'],
            hp: 110,
            maxHp: 110,
            sprite: '🌙',
            attack: 65,
            defense: 110,
            spAttack: 60,
            spDefense: 130,
            evolvesFrom: 'eevee',
            ability: 'synchronize',
            abilityName: '同步',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '恶之波动', damage: 12, energy: 2, type: 'dark', skillType: 'special' },
                { name: '月光', heal: 20, energy: 1, type: 'normal', skillType: 'ability' }
            ]
        },

        // ====== 迷你龙进化链 ======
        {
            id: 'dratini',
            name: '迷你龙',
            types: ['dragon'],
            hp: 75,
            maxHp: 75,
            sprite: '🐉',
            attack: 64,
            defense: 45,
            spAttack: 50,
            spDefense: 50,
            ability: 'shed_skin',
            abilityName: '蜕皮',
            evolution: {
                evolvesTo: 'dragonair',
                trigger: 'battleWins',
                threshold: 4
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '龙之怒', damage: 10, energy: 2, type: 'dragon', skillType: 'special' },
                { name: '龙息', damage: 8, energy: 1, type: 'dragon', skillType: 'special' }
            ]
        },
        {
            id: 'dragonair',
            name: '哈克龙',
            types: ['dragon'],
            hp: 95,
            maxHp: 95,
            sprite: '🐉',
            attack: 84,
            defense: 65,
            spAttack: 70,
            spDefense: 70,
            evolvesFrom: 'dratini',
            ability: 'shed_skin',
            abilityName: '蜕皮',
            evolution: {
                evolvesTo: 'dragonite',
                trigger: 'battleWins',
                threshold: 5
            },
            evolutionProgress: 0,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '龙之怒', damage: 15, energy: 2, type: 'dragon', skillType: 'special' },
                { name: '龙之舞', energy: 1, type: 'dragon', effect: 'strengthen', damageBonus: 2, skillType: 'ability' }
            ]
        },
        {
            id: 'dragonite',
            name: '快龙',
            types: ['dragon', 'flying'],
            hp: 145,
            maxHp: 145,
            sprite: '🐉',
            attack: 134,
            defense: 95,
            spAttack: 100,
            spDefense: 100,
            evolvesFrom: 'dragonair',
            ability: 'inner_focus',
            abilityName: '精神力',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '龙之怒', damage: 20, energy: 2, type: 'dragon', skillType: 'special' },
                { name: '暴风', damage: 18, energy: 2, type: 'flying', skillType: 'special' },
                { name: '逆鳞', damage: 25, energy: 3, type: 'dragon', skillType: 'physical' }
            ]
        },

        // ====== 传说宝可梦 ======
        {
            id: 'articuno',
            name: '急冻鸟',
            types: ['ice', 'flying'],
            hp: 145,
            maxHp: 145,
            sprite: '❄️',
            attack: 85,
            defense: 100,
            spAttack: 95,
            spDefense: 125,
            ability: 'pressure',
            abilityName: '压迫感',
            evolution: null,
            isLegendary: true,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '冰冻光束', damage: 15, energy: 2, type: 'ice', effect: 'freeze', skillType: 'special' },
                { name: '暴风雪', damage: 20, energy: 3, type: 'ice', skillType: 'special' },
                { name: '极光幕', block: 12, energy: 1, type: 'ice', skillType: 'ability' }
            ]
        },
        {
            id: 'zapdos',
            name: '闪电鸟',
            types: ['electric', 'flying'],
            hp: 135,
            maxHp: 135,
            sprite: '⚡',
            attack: 90,
            defense: 85,
            spAttack: 125,
            spDefense: 90,
            ability: 'pressure',
            abilityName: '压迫感',
            evolution: null,
            isLegendary: true,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '打雷', damage: 22, energy: 3, type: 'electric', skillType: 'special' },
                { name: '十万伏特', damage: 18, energy: 2, type: 'electric', effect: 'paralysis', skillType: 'special' },
                { name: '钻啄', damage: 15, energy: 2, type: 'flying', skillType: 'physical' }
            ]
        },
        {
            id: 'moltres',
            name: '火焰鸟',
            types: ['fire', 'flying'],
            hp: 140,
            maxHp: 140,
            sprite: '🔥',
            attack: 100,
            defense: 90,
            spAttack: 125,
            spDefense: 85,
            ability: 'pressure',
            abilityName: '压迫感',
            evolution: null,
            isLegendary: true,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '大字爆炎', damage: 22, energy: 3, type: 'fire', effect: 'burn', skillType: 'special' },
                { name: '火焰放射', damage: 18, energy: 2, type: 'fire', skillType: 'special' },
                { name: '天空攻击', damage: 25, energy: 3, type: 'flying', skillType: 'physical' }
            ]
        },
        {
            id: 'mewtwo',
            name: '超梦',
            types: ['psychic'],
            hp: 180,
            maxHp: 180,
            sprite: '🧬',
            attack: 110,
            defense: 90,
            spAttack: 154,
            spDefense: 90,
            ability: 'pressure',
            abilityName: '压迫感',
            evolution: null,
            megaEvolution: ['mewtwo-mega-x', 'mewtwo-mega-y'],
            isLegendary: true,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '精神击破', damage: 25, energy: 3, type: 'psychic', skillType: 'special' },
                { name: '精神强念', damage: 20, energy: 2, type: 'psychic', skillType: 'special' },
                { name: '影子球', damage: 18, energy: 2, type: 'ghost', skillType: 'special' },
                { name: '自我再生', heal: 30, energy: 1, type: 'psychic', skillType: 'ability' }
            ]
        },
        {
            id: 'mew',
            name: '梦幻',
            types: ['psychic'],
            hp: 120,
            maxHp: 120,
            sprite: '🧬',
            attack: 100,
            defense: 100,
            spAttack: 100,
            spDefense: 100,
            ability: 'synchronize',
            abilityName: '同步',
            evolution: null,
            isLegendary: true,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '精神强念', damage: 15, energy: 2, type: 'psychic', skillType: 'special' },
                { name: '摇手指', energy: 2, type: 'normal', effect: 'random', skillType: 'ability' },
                { name: '变身', energy: 1, type: 'normal', effect: 'transform', skillType: 'ability' }
            ]
        },
        {
            id: 'snorlax',
            name: '卡比兽',
            types: ['normal'],
            hp: 200,
            maxHp: 200,
            sprite: '😴',
            attack: 110,
            defense: 65,
            spAttack: 65,
            spDefense: 110,
            ability: 'thick_fat',
            abilityName: '厚脂肪',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '泰山压顶', damage: 20, energy: 2, type: 'normal', skillType: 'physical' },
                { name: '睡觉', heal: 50, energy: 0, type: 'psychic', effect: 'sleep', skillType: 'ability' },
                { name: '肚子大鼓', damage: 30, energy: 3, type: 'normal', selfDamage: 15, skillType: 'physical' }
            ]
        },
        {
            id: 'lapras',
            name: '乘龙',
            types: ['water', 'ice'],
            hp: 165,
            maxHp: 165,
            sprite: '🐋',
            attack: 85,
            defense: 80,
            spAttack: 85,
            spDefense: 95,
            ability: 'water_absorb',
            abilityName: '储水',
            evolution: null,
            battleWins: 0,
            friendship: 70,
            skills: [
                { name: '冰冻光束', damage: 14, energy: 2, type: 'ice', effect: 'freeze', skillType: 'special' },
                { name: '水炮', damage: 16, energy: 2, type: 'water', skillType: 'special' },
                { name: '冲浪', damage: 12, energy: 1, type: 'water', skillType: 'special' }
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

// 获取属性名称
function getTypeName(type) {
    const typeNames = {
        fire: '火', water: '水', grass: '草', electric: '电', psychic: '超能力',
        fighting: '格斗', dark: '恶', steel: '钢', fairy: '妖精', dragon: '龙',
        ice: '冰', rock: '岩石', ground: '地面', poison: '毒', bug: '虫',
        ghost: '幽灵', normal: '普通', flying: '飞行'
    };
    return typeNames[type] || type;
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

    const evolvesTo = pokemon.evolution.evolvesTo;
    if (Array.isArray(evolvesTo)) {
        // 多分支进化，返回第一个
        return getPokemonById(evolvesTo[0]);
    }
    return getPokemonById(evolvesTo);
}

// 检查是否可以进化
function canEvolve(pokemon, triggerType, value) {
    if (!pokemon || !pokemon.evolution) return false;

    const evolution = pokemon.evolution;
    if (evolution.trigger !== triggerType) return false;

    // 道具进化需要特定道具
    if (evolution.trigger === 'item') {
        return value === evolution.requiredItem;
    }

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
        hp: Math.ceil(evolution.hp * hpRatio),
        evolutionProgress: 0,
        battleWins: 0,
        friendship: pokemon.friendship || 70,
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
        duration: 99
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
    confusion: {
        name: '混乱',
        duration: 3
    },
    flinch: {
        name: '畏缩',
        duration: 1
    },
    shield: {
        name: '护盾',
        duration: 1
    }
};
