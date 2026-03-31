/**
 * 特性系统
 * 宝可梦的被动能力，在战斗中自动触发
 */

// 特性数据
const ABILITIES_DATA = {
    // ====== 属性强化特性 ======
    blaze: {
        id: 'blaze',
        name: '猛火',
        description: 'HP低于1/3时，火属性技能伤害+50%',
        trigger: 'damage',
        condition: (pokemon) => pokemon.hp < pokemon.maxHp / 3,
        effect: { type: 'typeBoost', elementType: 'fire', value: 0.5 }
    },
    torrent: {
        id: 'torrent',
        name: '激流',
        description: 'HP低于1/3时，水属性技能伤害+50%',
        trigger: 'damage',
        condition: (pokemon) => pokemon.hp < pokemon.maxHp / 3,
        effect: { type: 'typeBoost', elementType: 'water', value: 0.5 }
    },
    overgrow: {
        id: 'overgrow',
        name: '茂盛',
        description: 'HP低于1/3时，草属性技能伤害+50%',
        trigger: 'damage',
        condition: (pokemon) => pokemon.hp < pokemon.maxHp / 3,
        effect: { type: 'typeBoost', elementType: 'grass', value: 0.5 }
    },
    swarm: {
        id: 'swarm',
        name: '虫之预感',
        description: 'HP低于1/3时，虫属性技能伤害+50%',
        trigger: 'damage',
        condition: (pokemon) => pokemon.hp < pokemon.maxHp / 3,
        effect: { type: 'typeBoost', elementType: 'bug', value: 0.5 }
    },
    guts: {
        id: 'guts',
        name: '毅力',
        description: '有状态异常时，攻击伤害+50%',
        trigger: 'damage',
        condition: (pokemon) => pokemon.statusEffects && pokemon.statusEffects.length > 0,
        effect: { type: 'damageBoost', value: 0.5 }
    },

    // ====== 状态触发特性 ======
    static: {
        id: 'static',
        name: '静电',
        description: '受到接触攻击时，有30%概率使攻击者麻痹',
        trigger: 'onHit',
        chance: 0.3,
        effect: { type: 'applyStatus', status: 'paralysis', target: 'attacker' }
    },
    poison_point: {
        id: 'poison_point',
        name: '毒刺',
        description: '受到接触攻击时，有30%概率使攻击者中毒',
        trigger: 'onHit',
        chance: 0.3,
        effect: { type: 'applyStatus', status: 'poison', target: 'attacker' }
    },
    flame_body: {
        id: 'flame_body',
        name: '火焰之躯',
        description: '受到接触攻击时，有30%概率使攻击者灼伤',
        trigger: 'onHit',
        chance: 0.3,
        effect: { type: 'applyStatus', status: 'burn', target: 'attacker' }
    },
    effect_spore: {
        id: 'effect_spore',
        name: '孢子',
        description: '受到接触攻击时，有10%概率使攻击者睡眠/中毒/麻痹',
        trigger: 'onHit',
        chance: 0.1,
        effect: { type: 'randomStatus', statuses: ['sleep', 'poison', 'paralysis'], target: 'attacker' }
    },
    cute_charm: {
        id: 'cute_charm',
        name: '迷人之躯',
        description: '受到接触攻击时，有30%概率使攻击者迷惑',
        trigger: 'onHit',
        chance: 0.3,
        effect: { type: 'applyStatus', status: 'confusion', target: 'attacker' }
    },

    // ====== 免疫特性 ======
    levitate: {
        id: 'levitate',
        name: '漂浮',
        description: '免疫地面属性攻击',
        trigger: 'passive',
        effect: { type: 'immunity', elementType: 'ground' }
    },
    lightning_rod: {
        id: 'lightning_rod',
        name: '避雷针',
        description: '免疫电属性攻击，并提升特攻',
        trigger: 'onHit',
        effect: { type: 'absorb', elementType: 'electric', boost: 'spAttack', value: 1 }
    },
    volt_absorb: {
        id: 'volt_absorb',
        name: '蓄电',
        description: '受到电属性攻击时恢复HP',
        trigger: 'onHit',
        effect: { type: 'healOnType', elementType: 'electric', value: 0.25 }
    },
    water_absorb: {
        id: 'water_absorb',
        name: '储水',
        description: '受到水属性攻击时恢复HP',
        trigger: 'onHit',
        effect: { type: 'healOnType', elementType: 'water', value: 0.25 }
    },
    flash_fire: {
        id: 'flash_fire',
        name: '引火',
        description: '免疫火属性攻击，火属性技能伤害+50%',
        trigger: 'passive',
        effect: { type: 'immunity', elementType: 'fire', bonusType: 'fire', bonusValue: 0.5 }
    },
    sap_sipper: {
        id: 'sap_sipper',
        name: '食草',
        description: '免疫草属性攻击，攻击+1',
        trigger: 'onHit',
        effect: { type: 'absorb', elementType: 'grass', boost: 'attack', value: 1 }
    },
    storm_drain: {
        id: 'storm_drain',
        name: '引水',
        description: '免疫水属性攻击，特攻+1',
        trigger: 'onHit',
        effect: { type: 'absorb', elementType: 'water', boost: 'spAttack', value: 1 }
    },

    // ====== 战斗强化特性 ======
    adaptability: {
        id: 'adaptability',
        name: '适应力',
        description: '本系加成提升至2倍（原本1.5倍）',
        trigger: 'passive',
        effect: { type: 'stabBoost', value: 2.0 }
    },
    speed_boost: {
        id: 'speed_boost',
        name: '加速',
        description: '每回合开始时有15%概率获得1点额外能量',
        trigger: 'turnStart',
        chance: 0.15,
        effect: { type: 'gainEnergy', value: 1 }
    },
    intimidate: {
        id: 'intimidate',
        name: '威吓',
        description: '登场时降低敌人攻击',
        trigger: 'onEnter',
        effect: { type: 'debuffEnemy', stat: 'attack', value: -0.15 }
    },
    huge_power: {
        id: 'huge_power',
        name: '大力士',
        description: '物理攻击伤害x2',
        trigger: 'passive',
        effect: { type: 'physicalMultiplier', value: 2.0 }
    },
    hustle: {
        id: 'hustle',
        name: '毅力',
        description: '物理攻击伤害+50%，但命中率降低',
        trigger: 'passive',
        effect: { type: 'physicalBoost', value: 0.5, accuracyPenalty: 0.2 }
    },

    // ====== 防御特性 ======
    battle_armor: {
        id: 'battle_armor',
        name: '战斗盔甲',
        description: '不会被暴击',
        trigger: 'passive',
        effect: { type: 'noCrit', value: true }
    },
    shell_armor: {
        id: 'shell_armor',
        name: '贝壳盔甲',
        description: '不会被暴击',
        trigger: 'passive',
        effect: { type: 'noCrit', value: true }
    },
    thick_fat: {
        id: 'thick_fat',
        name: '厚脂肪',
        description: '火和冰属性伤害减半',
        trigger: 'passive',
        effect: { type: 'typeResistance', elements: ['fire', 'ice'], value: 0.5 }
    },
    marvel_scale: {
        id: 'marvel_scale',
        name: '奇迹鳞片',
        description: '有状态异常时，防御+50%',
        trigger: 'passive',
        condition: (pokemon) => pokemon.statusEffects && pokemon.statusEffects.length > 0,
        effect: { type: 'defenseBoost', value: 0.5 }
    },

    // ====== 特殊特性 ======
    shed_skin: {
        id: 'shed_skin',
        name: '蜕皮',
        description: '每回合有30%概率治愈状态异常',
        trigger: 'turnEnd',
        chance: 0.3,
        effect: { type: 'cureStatus' }
    },
    synchronization: {
        id: 'synchronization',
        name: '同步',
        description: '受到状态异常时，敌人也获得相同状态',
        trigger: 'onStatus',
        effect: { type: 'mirrorStatus' }
    },
    trace: {
        id: 'trace',
        name: '追踪',
        description: '复制敌人的特性',
        trigger: 'onEnter',
        effect: { type: 'copyAbility' }
    },
    moody: {
        id: 'moody',
        name: '心情不定',
        description: '每回合随机提升一项属性',
        trigger: 'turnEnd',
        effect: { type: 'randomBoost' }
    },
    multiscale: {
        id: 'multiscale',
        name: '多鳞',
        description: 'HP满时受到的伤害减半',
        trigger: 'passive',
        condition: (pokemon) => pokemon.hp >= pokemon.maxHp,
        effect: { type: 'damageReduction', value: 0.5 }
    }
};

// 特性管理器
const AbilityManager = {
    // 获取特性
    getAbility(abilityId) {
        return ABILITIES_DATA[abilityId] ? { ...ABILITIES_DATA[abilityId] } : null;
    },

    // 检查特性触发条件
    checkCondition(ability, pokemon) {
        if (!ability.condition) return true;
        return ability.condition(pokemon);
    },

    // 处理特性触发
    triggerAbility(abilityId, triggerType, context = {}) {
        const ability = this.getAbility(abilityId);
        if (!ability) return null;

        if (ability.trigger !== triggerType && ability.trigger !== 'passive') return null;

        // 检查概率
        if (ability.chance && Math.random() > ability.chance) return null;

        // 检查条件
        const pokemon = context.pokemon || GameState.player;
        if (!this.checkCondition(ability, pokemon)) return null;

        return ability.effect;
    },

    // 获取伤害加成
    getDamageBonus(ability, attackType, pokemonType) {
        if (!ability) return 0;

        let bonus = 0;

        // 本系加成调整
        if (ability.effect.type === 'stabBoost' && pokemonType === attackType) {
            bonus += (ability.effect.value - 1.5); // 额外加成
        }

        // 属性强化
        if (ability.effect.type === 'typeBoost' && ability.effect.elementType === attackType) {
            bonus += ability.effect.value;
        }

        // 伤害加成
        if (ability.effect.type === 'damageBoost') {
            bonus += ability.effect.value;
        }

        // 物理加成
        if (ability.effect.type === 'physicalMultiplier') {
            bonus += ability.effect.value - 1;
        }
        if (ability.effect.type === 'physicalBoost') {
            bonus += ability.effect.value;
        }

        return bonus;
    },

    // 检查免疫
    checkImmunity(ability, attackType) {
        if (!ability) return false;

        if (ability.effect.type === 'immunity' && ability.effect.elementType === attackType) {
            return true;
        }
        if (ability.effect.type === 'immunity' && ability.effect.elements?.includes(attackType)) {
            return true;
        }

        return false;
    },

    // 获取防御加成
    getDefenseBonus(ability) {
        if (!ability) return 0;
        if (ability.effect.type === 'defenseBoost') {
            return ability.effect.value;
        }
        return 0;
    },

    // 获取属性抗性
    getTypeResistance(ability, attackType) {
        if (!ability) return 1;
        if (ability.effect.type === 'typeResistance') {
            if (ability.effect.elements?.includes(attackType)) {
                return ability.effect.value;
            }
        }
        return 1;
    },

    // 检查是否防暴击
    preventsCrit(ability) {
        if (!ability) return false;
        return ability.effect.type === 'noCrit';
    },

    // 处理受到攻击时的特性
    onHit(pokemon, attacker, attackType, isContact = true) {
        const abilityId = pokemon.ability;
        if (!abilityId) return null;

        const ability = this.getAbility(abilityId);
        if (!ability || ability.trigger !== 'onHit') return null;

        // 检查概率
        if (ability.chance && Math.random() > ability.chance) return null;

        // 处理效果
        if (ability.effect.type === 'applyStatus' && isContact) {
            return {
                type: 'status',
                status: ability.effect.status,
                target: 'attacker'
            };
        }

        if (ability.effect.type === 'healOnType' && ability.effect.elementType === attackType) {
            const healAmount = Math.floor(pokemon.maxHp * ability.effect.value);
            return {
                type: 'heal',
                value: healAmount
            };
        }

        if (ability.effect.type === 'absorb' && ability.effect.elementType === attackType) {
            return {
                type: 'boost',
                stat: ability.effect.boost,
                value: ability.effect.value
            };
        }

        if (ability.effect.type === 'randomStatus' && isContact) {
            const statuses = ability.effect.statuses;
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
                type: 'status',
                status: randomStatus,
                target: 'attacker'
            };
        }

        return null;
    },

    // 处理回合开始时的特性
    onTurnStart(pokemon) {
        const abilityId = pokemon.ability;
        if (!abilityId) return null;

        const ability = this.getAbility(abilityId);
        if (!ability || ability.trigger !== 'turnStart') return null;

        // 检查概率
        if (ability.chance && Math.random() > ability.chance) return null;

        if (ability.effect.type === 'gainEnergy') {
            return {
                type: 'energy',
                value: ability.effect.value
            };
        }

        return null;
    },

    // 处理回合结束时的特性
    onTurnEnd(pokemon) {
        const abilityId = pokemon.ability;
        if (!abilityId) return null;

        const ability = this.getAbility(abilityId);
        if (!ability || ability.trigger !== 'turnEnd') return null;

        // 检查概率
        if (ability.chance && Math.random() > ability.chance) return null;

        if (ability.effect.type === 'cureStatus') {
            if (pokemon.statusEffects && pokemon.statusEffects.length > 0) {
                pokemon.statusEffects = [];
                return { type: 'cureStatus' };
            }
        }

        if (ability.effect.type === 'randomBoost') {
            const stats = ['attack', 'defense', 'spAttack', 'spDefense'];
            const randomStat = stats[Math.floor(Math.random() * stats.length)];
            return {
                type: 'boost',
                stat: randomStat,
                value: 1
            };
        }

        return null;
    },

    // 处理登场时的特性
    onEnter(pokemon, enemy) {
        const abilityId = pokemon.ability;
        if (!abilityId) return null;

        const ability = this.getAbility(abilityId);
        if (!ability || ability.trigger !== 'onEnter') return null;

        if (ability.effect.type === 'debuffEnemy') {
            return {
                type: 'debuff',
                stat: ability.effect.stat,
                value: ability.effect.value,
                target: 'enemy'
            };
        }

        if (ability.effect.type === 'copyAbility') {
            if (enemy && enemy.ability) {
                return {
                    type: 'copyAbility',
                    copiedAbility: enemy.ability
                };
            }
        }

        return null;
    }
};
