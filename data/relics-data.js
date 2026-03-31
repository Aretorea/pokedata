/**
 * 遗物系统
 * 永久被动效果，影响游戏策略
 */

// 遗物稀有度
const RELIC_RARITY = {
    common: { name: '普通', color: '#9e9e9e', dropRate: 0.4 },
    uncommon: { name: '罕见', color: '#4caf50', dropRate: 0.3 },
    rare: { name: '稀有', color: '#2196f3', dropRate: 0.2 },
    boss: { name: 'Boss', color: '#9c27b0', dropRate: 0.1 }
};

// 遗物数据
const RELICS_DATA = {
    // ====== 普通遗物（属性伤害加成） ======
    common: [
        {
            id: 'charcoal',
            name: '燃烧木炭',
            description: '火属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'fire', value: 0.2 },
            sprite: '🔥'
        },
        {
            id: 'mystic-water',
            name: '神秘水滴',
            description: '水属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'water', value: 0.2 },
            sprite: '💧'
        },
        {
            id: 'miracle-seed',
            name: '奇迹种子',
            description: '草属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'grass', value: 0.2 },
            sprite: '🌿'
        },
        {
            id: 'magnet',
            name: '磁铁',
            description: '电属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'electric', value: 0.2 },
            sprite: '🧲'
        },
        {
            id: 'twisted-spoon',
            name: '弯曲汤匙',
            description: '超能力属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'psychic', value: 0.2 },
            sprite: '🥄'
        },
        {
            id: 'black-belt',
            name: '黑色带子',
            description: '格斗属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'fighting', value: 0.2 },
            sprite: '🥋'
        },
        {
            id: 'sharp-beak',
            name: '锐利鸟嘴',
            description: '飞行属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'flying', value: 0.2 },
            sprite: '🦅'
        },
        {
            id: 'poison-barb',
            name: '毒针',
            description: '毒属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'poison', value: 0.2 },
            sprite: '💉'
        },
        {
            id: 'hard-stone',
            name: '坚硬石头',
            description: '岩石属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'rock', value: 0.2 },
            sprite: '🪨'
        },
        {
            id: 'soft-sand',
            name: '软沙',
            description: '地面属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'ground', value: 0.2 },
            sprite: '🏖️'
        },
        {
            id: 'spell-tag',
            name: '咒符',
            description: '幽灵属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'ghost', value: 0.2 },
            sprite: '📿'
        },
        {
            id: 'dragon-fang',
            name: '龙之牙',
            description: '龙属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'dragon', value: 0.2 },
            sprite: '🦷'
        },
        {
            id: 'never-melt-ice',
            name: '不融冰',
            description: '冰属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'ice', value: 0.2 },
            sprite: '🧊'
        },
        {
            id: 'silver-powder',
            name: '银粉',
            description: '虫属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'bug', value: 0.2 },
            sprite: '🦋'
        },
        {
            id: 'black-glasses',
            name: '黑色眼镜',
            description: '恶属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'dark', value: 0.2 },
            sprite: '🕶️'
        },
        {
            id: 'metal-coat',
            name: '金属膜',
            description: '钢属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'steel', value: 0.2 },
            sprite: '🛡️'
        },
        {
            id: 'fairy-feather',
            name: '妖精羽毛',
            description: '妖精属性技能伤害+20%',
            effect: { type: 'typeDamageBonus', elementType: 'fairy', value: 0.2 },
            sprite: '🪶'
        }
    ],

    // ====== 罕见遗物 ======
    uncommon: [
        {
            id: 'leftovers',
            name: '剩饭',
            description: '每回合结束时恢复 3 HP',
            effect: { type: 'regen', value: 3 },
            sprite: '🍱'
        },
        {
            id: 'shell-bell',
            name: '贝壳之铃',
            description: '造成伤害时恢复造成伤害的 10%',
            effect: { type: 'lifeSteal', value: 0.1 },
            sprite: '🔔'
        },
        {
            id: 'scope-lens',
            name: '瞄准镜',
            description: '暴击率+10%',
            effect: { type: 'critChance', value: 0.1 },
            sprite: '🎯'
        },
        {
            id: 'focus-band',
            name: '焦点带',
            description: '受到致命伤害时有 10% 概率保留 1 HP',
            effect: { type: 'survive', value: 0.1 },
            sprite: '🎀'
        },
        {
            id: 'quick-claw',
            name: '先制爪',
            description: '有 15% 概率获得 1 点额外能量',
            effect: { type: 'energyChance', value: 0.15 },
            sprite: '🐾'
        },
        {
            id: 'everstone',
            name: '不变之石',
            description: '阻止进化，但亲密度获取+30%',
            effect: { type: 'blockEvolution', friendshipBonus: 0.3 },
            sprite: '💎'
        },
        {
            id: 'lucky-punch',
            name: '幸运拳',
            description: '进化后暴击率+25%',
            effect: { type: 'evolutionCrit', value: 0.25 },
            sprite: '🥊'
        },
        {
            id: 'kings-rock',
            name: '王者之证',
            description: '攻击有 10% 概率使敌人畏缩',
            effect: { type: 'flinchChance', value: 0.1 },
            sprite: '👑'
        },
        {
            id: 'bright-powder',
            name: '明亮粉末',
            description: '有 10% 概率闪避攻击',
            effect: { type: 'dodge', value: 0.1 },
            sprite: '✨'
        }
    ],

    // ====== 稀有遗物 ======
    rare: [
        {
            id: 'life-orb',
            name: '生命宝珠',
            description: '伤害+30%，但每次攻击损失 1 HP',
            effect: { type: 'damageBonus', value: 0.3, selfDamage: 1 },
            sprite: '🔴'
        },
        {
            id: 'choice-band',
            name: '讲究头带',
            description: '物理攻击伤害+50%，但只能使用第一张打出的攻击牌',
            effect: { type: 'physicalDamageBonus', value: 0.5, lockFirstAttack: true },
            sprite: '🎀'
        },
        {
            id: 'choice-specs',
            name: '讲究眼镜',
            description: '特殊攻击伤害+50%，但只能使用第一张打出的攻击牌',
            effect: { type: 'specialDamageBonus', value: 0.5, lockFirstAttack: true },
            sprite: '👓'
        },
        {
            id: 'assault-vest',
            name: '突击背心',
            description: '特防+50%，但无法使用能力类技能',
            effect: { type: 'spDefenseBonus', value: 0.5, blockAbility: true },
            sprite: '🦺'
        },
        {
            id: 'rocky-helmet',
            name: '凸凸头盔',
            description: '受到攻击时，攻击者受到 5 点伤害',
            effect: { type: 'thorns', value: 5 },
            sprite: '⛑️'
        },
        {
            id: 'razor-claw',
            name: '锐利爪',
            description: '暴击率+20%，暴击伤害+50%',
            effect: { type: 'critBoost', chance: 0.2, damage: 0.5 },
            sprite: '🦅'
        },
        {
            id: 'expert-belt',
            name: '博识眼镜',
            description: '效果拔群时伤害+25%',
            effect: { type: 'superEffective', value: 0.25 },
            sprite: '👓'
        },
        {
            id: 'muscle-band',
            name: '肌肉_band',
            description: '物理攻击伤害+20%',
            effect: { type: 'physicalDamageBonus', value: 0.2 },
            sprite: '💪'
        },
        {
            id: 'wise-glasses',
            name: '博识眼镜',
            description: '特殊攻击伤害+20%',
            effect: { type: 'specialDamageBonus', value: 0.2 },
            sprite: '🤓'
        },
        {
            id: 'exp-share',
            name: '学习装置',
            description: '所有宝可梦共享战斗次数',
            effect: { type: 'sharedBattleExp', value: true },
            sprite: '📱'
        },
        {
            id: 'friendship-ribbon',
            name: '友情丝带',
            description: '亲密度获取+50%',
            effect: { type: 'friendshipBonus', value: 0.5 },
            sprite: '🎗️'
        }
    ],

    // ====== Boss遗物 ======
    boss: [
        {
            id: 'sacred-ash',
            name: '圣灰',
            description: '战斗结束后恢复所有HP',
            effect: { type: 'fullHealAfterBattle', value: true },
            sprite: '⚖️'
        },
        {
            id: 'master-scroll',
            name: '大师卷轴',
            description: '所有技能伤害+25%，暴击率+15%',
            effect: { type: 'masterBoost', damage: 0.25, crit: 0.15 },
            sprite: '📜'
        },
        {
            id: 'eternal-flame',
            name: '永恒之焰',
            description: '火属性技能伤害+50%，且必定灼伤',
            effect: { type: 'typeMastery', elementType: 'fire', value: 0.5, guaranteedStatus: 'burn' },
            sprite: '🔥'
        },
        {
            id: 'crystal-core',
            name: '水晶核心',
            description: '每层开始时获得 50 金币',
            effect: { type: 'floorGold', value: 50 },
            sprite: '💎'
        },
        {
            id: 'champion-badge',
            name: '冠军徽章',
            description: '所有属性克制效果变为 2.5 倍',
            effect: { type: 'typeEffectivenessBoost', value: 2.5 },
            sprite: '🏅'
        },
        {
            id: 'evolution-key',
            name: '进化钥匙',
            description: '解锁超级进化能力',
            effect: { type: 'unlockMega', value: true },
            sprite: '🗝️'
        },
        {
            id: 'soothe-bell',
            name: '安抚之铃',
            description: '亲密度获取+100%',
            effect: { type: 'friendshipBonus', value: 1.0 },
            sprite: '🔔'
        },
        {
            id: 'destiny-knot',
            name: '红线',
            description: '造成状态异常时有 30% 概率复制给敌人',
            effect: { type: 'statusCopy', value: 0.3 },
            sprite: '🪢'
        },
        {
            id: 'golden-apple',
            name: '金苹果',
            description: '每场战斗开始时获得 1 张随机稀有卡牌',
            effect: { type: 'startWithCard', rarity: 'rare' },
            sprite: '🍎'
        },
        {
            id: 'infinite-loop',
            name: '无限循环',
            description: '每回合第一张消耗牌返回牌组',
            effect: { type: 'firstCardReturn', value: true },
            sprite: '♾️'
        },
        {
            id: 'ancient-tablet',
            name: '古代石板',
            description: '进化所需战斗次数减少 3 次',
            effect: { type: 'evolutionDiscount', value: 3 },
            sprite: '🗿'
        },
        {
            id: 'rainbow-wing',
            name: '彩虹羽毛',
            description: '所有属性技能伤害+15%',
            effect: { type: 'allTypeDamage', value: 0.15 },
            sprite: '🌈'
        }
    ]
};

// ====== 套装遗物系统 ======
const RELIC_SETS = {
    // 创世石板套装 - 收集所有属性石板
    creationTablet: {
        name: '创世套装',
        description: '收集所有17种属性石板',
        requiredRelics: [
            'charcoal', 'mystic-water', 'miracle-seed', 'magnet', 
            'twisted-spoon', 'black-belt', 'sharp-beak', 'poison-barb',
            'hard-stone', 'soft-sand', 'spell-tag', 'dragon-fang',
            'never-melt-ice', 'silver-powder', 'black-glasses', 'metal-coat', 'fairy-feather'
        ],
        reward: {
            id: 'creation-tablet',
            name: '创世石板',
            description: '所有属性技能伤害+50%，每回合开始恢复5HP',
            effect: { type: 'creationBoost', damageBonus: 0.5, regen: 5 },
            sprite: '🏛️',
            rarity: 'legendary'
        }
    },
    
    // 御三家套装
    starterSet: {
        name: '御三家套装',
        description: '收集火、水、草属性石板',
        requiredRelics: ['charcoal', 'mystic-water', 'miracle-seed'],
        reward: {
            id: 'starter-crest',
            name: '初心者徽章',
            description: '火/水/草属性技能伤害+40%，HP+20',
            effect: { type: 'starterBonus', types: ['fire', 'water', 'grass'], damageBonus: 0.4, hpBonus: 20 },
            sprite: '🏅',
            rarity: 'rare'
        }
    },
    
    // 幸运套装
    luckSet: {
        name: '幸运套装',
        description: '收集所有幸运相关遗物',
        requiredRelics: ['scope-lens', 'lucky-punch', 'quick-claw'],
        reward: {
            id: 'lucky-seven',
            name: '幸运七',
            description: '暴击率+30%，暴击伤害+100%',
            effect: { type: 'luckyBonus', critChance: 0.3, critDamage: 1.0 },
            sprite: '7️⃣',
            rarity: 'boss'
        }
    }
};

// ====== 宝可梦关联遗物 ======
const POKEMON_RELICS = [
    // 皮卡丘系列
    {
        id: 'light-ball',
        name: '电气球',
        description: '皮卡丘/雷丘攻击伤害+100%',
        effect: { type: 'pokemonDamageBonus', pokemon: ['pikachu', 'raichu'], value: 1.0 },
        sprite: '⚡',
        rarity: 'rare',
        relatedPokemon: ['pikachu', 'raichu']
    },
    {
        id: 'pikachu-tail',
        name: '皮卡丘尾巴',
        description: '电属性技能有30%概率麻痹敌人',
        effect: { type: 'typeStatusChance', elementType: 'electric', status: 'paralysis', chance: 0.3 },
        sprite: '⚡',
        rarity: 'uncommon',
        relatedPokemon: ['pikachu']
    },
    
    // 喷火龙系列
    {
        id: 'charizardite-shared',
        name: '喷火龙之魂',
        description: '喷火龙火属性技能伤害+50%，无视防御',
        effect: { type: 'pokemonTypePenetration', pokemon: 'charizard', elementType: 'fire', value: 0.5 },
        sprite: '🔥',
        rarity: 'rare',
        relatedPokemon: ['charmander', 'charmeleon', 'charizard']
    },
    
    // 水箭龟系列
    {
        id: 'blastoise-shell',
        name: '水箭龟甲壳',
        description: '水属性技能伤害+30%，受到的水属性伤害-50%',
        effect: { type: 'typeMasteryDefense', elementType: 'water', offense: 0.3, defense: 0.5 },
        sprite: '🐢',
        rarity: 'rare',
        relatedPokemon: ['squirtle', 'wartortle', 'blastoise']
    },
    
    // 妙蛙花系列
    {
        id: 'venusaur-bulb',
        name: '妙蛙花种子',
        description: '草属性技能吸血20%',
        effect: { type: 'typeLifeSteal', elementType: 'grass', value: 0.2 },
        sprite: '🌱',
        rarity: 'rare',
        relatedPokemon: ['bulbasaur', 'ivysaur', 'venusaur']
    },
    
    // 伊布系列
    {
        id: 'eevee-essence',
        name: '伊布精华',
        description: '进化时额外获得10HP和5点全属性',
        effect: { type: 'evolutionBonus', hp: 10, stats: 5 },
        sprite: '🦊',
        rarity: 'uncommon',
        relatedPokemon: ['eevee', 'vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon', 'leafeon', 'glaceon', 'sylveon']
    },
    
    // 超梦系列
    {
        id: 'mewtwo-cell',
        name: '超梦细胞',
        description: '超能力技能暴击率+25%，暴击伤害+50%',
        effect: { type: 'typeCritBonus', elementType: 'psychic', critChance: 0.25, critDamage: 0.5 },
        sprite: '🧬',
        rarity: 'boss',
        relatedPokemon: ['mewtwo']
    },
    
    // 卡比兽系列
    {
        id: 'snorlax-belly',
        name: '卡比兽肚皮',
        description: 'HP上限+30，每回合恢复3HP',
        effect: { type: 'hpAndRegen', hpBonus: 30, regen: 3 },
        sprite: '😴',
        rarity: 'rare',
        relatedPokemon: ['snorlax', 'munchlax']
    },
    
    // 暴鲤龙系列
    {
        id: 'gyarados-scale',
        name: '暴鲤龙鳞片',
        description: '水/龙属性技能伤害+25%，免疫烧伤',
        effect: { type: 'typeAndImmunity', types: ['water', 'dragon'], damageBonus: 0.25, immuneStatus: 'burn' },
        sprite: '🐉',
        rarity: 'rare',
        relatedPokemon: ['magikarp', 'gyarados']
    },
    
    // 班基拉斯系列
    {
        id: 'tyranitar-armor',
        name: '班基拉斯铠甲',
        description: '岩石/恶属性技能伤害+25%，受到伤害减少10%',
        effect: { type: 'typeAndDefense', types: ['rock', 'dark'], damageBonus: 0.25, damageReduction: 0.1 },
        sprite: '🦖',
        rarity: 'boss',
        relatedPokemon: ['larvitar', 'pupitar', 'tyranitar']
    }
];

// 遗物管理器
const RelicManager = {
    relics: [],

    init() {
        this.relics = [];
    },

    addRelic(relicId) {
        const relic = this.getRelicById(relicId);
        if (!relic) return false;

        if (this.hasRelic(relicId)) {
            showMessage('已经拥有此遗物！');
            return false;
        }

        this.relics.push({ ...relic });
        showMessage(`获得遗物: ${relic.name}！`);
        
        // 检查套装合成
        this.checkSetCompletion();
        
        return true;
    },

    removeRelic(relicId) {
        const index = this.relics.findIndex(r => r.id === relicId);
        if (index >= 0) {
            this.relics.splice(index, 1);
            return true;
        }
        return false;
    },

    hasRelic(relicId) {
        return this.relics.some(r => r.id === relicId);
    },

    getRelicById(relicId) {
        // 先检查普通遗物
        for (const rarity of Object.keys(RELICS_DATA)) {
            const relic = RELICS_DATA[rarity].find(r => r.id === relicId);
            if (relic) return { ...relic, rarity };
        }
        // 检查宝可梦关联遗物
        const pokemonRelic = POKEMON_RELICS.find(r => r.id === relicId);
        if (pokemonRelic) return { ...pokemonRelic, rarity: pokemonRelic.rarity };
        // 检查套装奖励
        for (const setData of Object.values(RELIC_SETS)) {
            if (setData.reward.id === relicId) {
                return { ...setData.reward };
            }
        }
        return null;
    },

    // 检查套装合成
    checkSetCompletion() {
        for (const [setId, setData] of Object.entries(RELIC_SETS)) {
            // 检查是否已拥有套装奖励
            if (this.hasRelic(setData.reward.id)) continue;
            
            // 检查是否集齐所需遗物
            const hasAll = setData.requiredRelics.every(relicId => this.hasRelic(relicId));
            
            if (hasAll) {
                // 移除组成套装的遗物
                for (const relicId of setData.requiredRelics) {
                    this.removeRelic(relicId);
                }
                
                // 添加套装奖励
                this.relics.push({ ...setData.reward, isSetReward: true });
                showMessage(`🎉 套装合成成功！获得 ${setData.reward.name}！`);
                
                // 显示套装合成动画
                this.showSetCompletionAnimation(setData);
            }
        }
    },

    // 套装合成动画
    showSetCompletionAnimation(setData) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 4000;
        `;
        
        overlay.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">${setData.reward.sprite}</div>
            <h2 style="color: #ffd700; margin-bottom: 10px;">套装合成成功！</h2>
            <p style="color: #fff; margin-bottom: 10px;">${setData.name} - ${setData.reward.name}</p>
            <p style="color: #aaa; font-size: 14px;">${setData.reward.description}</p>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 3000);
    },

    // 获取套装进度
    getSetProgress(setId) {
        const setData = RELIC_SETS[setId];
        if (!setData) return null;
        
        const owned = setData.requiredRelics.filter(relicId => this.hasRelic(relicId)).length;
        const total = setData.requiredRelics.length;
        const completed = this.hasRelic(setData.reward.id);
        
        return {
            name: setData.name,
            owned,
            total,
            completed,
            reward: setData.reward
        };
    },

    // 获取所有套装进度
    getAllSetProgress() {
        const progress = {};
        for (const setId of Object.keys(RELIC_SETS)) {
            progress[setId] = this.getSetProgress(setId);
        }
        return progress;
    },

    // 获取属性伤害加成
    getTypeDamageBonus(elementType) {
        let bonus = 0;
        for (const relic of this.relics) {
            if (relic.effect.type === 'typeDamageBonus' && relic.effect.elementType === elementType) {
                bonus += relic.effect.value;
            }
            if (relic.effect.type === 'typeMastery' && relic.effect.elementType === elementType) {
                bonus += relic.effect.value;
            }
        }
        return bonus;
    },

    // 获取暴击率加成
    getCritChanceBonus() {
        let bonus = 0;
        for (const relic of this.relics) {
            if (relic.effect.type === 'critChance') {
                bonus += relic.effect.value;
            }
            if (relic.effect.type === 'critBoost') {
                bonus += relic.effect.chance;
            }
            if (relic.effect.type === 'masterBoost') {
                bonus += relic.effect.crit;
            }
        }
        return bonus;
    },

    // 获取暴击伤害加成
    getCritDamageBonus() {
        let bonus = 0;
        for (const relic of this.relics) {
            if (relic.effect.type === 'critBoost') {
                bonus += relic.effect.damage;
            }
        }
        return bonus;
    },

    // 获取亲密度加成
    getFriendshipBonus() {
        let bonus = 0;
        for (const relic of this.relics) {
            if (relic.effect.type === 'friendshipBonus') {
                bonus += relic.effect.value;
            }
            if (relic.effect.type === 'blockEvolution') {
                bonus += relic.effect.friendshipBonus || 0;
            }
        }
        return bonus;
    },

    // 检查是否可以超级进化
    canMegaEvolve() {
        return this.relics.some(r => r.effect.type === 'unlockMega');
    },

    // 检查是否共享战斗经验
    hasSharedBattleExp() {
        return this.relics.some(r => r.effect.type === 'sharedBattleExp');
    },

    // 获取随机遗物奖励
    getRandomRelicReward(rarity = null) {
        if (rarity) {
            const relics = RELICS_DATA[rarity];
            if (relics && relics.length > 0) {
                return { ...relics[Math.floor(Math.random() * relics.length)], rarity };
            }
        }

        // 根据掉落率随机选择稀有度
        const roll = Math.random();
        let cumulative = 0;
        for (const [rarityName, rarityData] of Object.entries(RELIC_RARITY)) {
            cumulative += rarityData.dropRate;
            if (roll < cumulative) {
                const relics = RELICS_DATA[rarityName];
                if (relics && relics.length > 0) {
                    return { ...relics[Math.floor(Math.random() * relics.length)], rarity: rarityName };
                }
            }
        }

        // 默认返回普通遗物
        const commonRelics = RELICS_DATA.common;
        return { ...commonRelics[Math.floor(Math.random() * commonRelics.length)], rarity: 'common' };
    },

    // 回合结束时处理遗物效果
    onTurnEnd() {
        for (const relic of this.relics) {
            if (relic.effect.type === 'regen') {
                if (GameState.player.hp < GameState.player.maxHp) {
                    GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + relic.effect.value);
                    showDamageNumber(relic.effect.value, 'heal', 'player');
                }
            }
        }
    },

    // 战斗结束时处理遗物效果
    onBattleEnd(victory) {
        if (victory) {
            for (const relic of this.relics) {
                if (relic.effect.type === 'fullHealAfterBattle') {
                    GameState.player.hp = GameState.player.maxHp;
                    showMessage('圣灰恢复了所有HP！');
                }
            }
        }
    },

    // 层数开始时处理遗物效果
    onFloorStart() {
        for (const relic of this.relics) {
            if (relic.effect.type === 'floorGold') {
                GameState.player.gold += relic.effect.value;
                showMessage(`${relic.name}: 获得 ${relic.effect.value} 金币！`);
            }
        }
    }
};
