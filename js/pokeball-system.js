/**
 * 精灵球捕捉系统
 * 使用精灵球捕捉敌人，成功后获得对应卡牌
 */

const PokeballSystem = {
    // 不同精灵球的捕捉率加成
    ballModifiers: {
        'pokeball': 1.0,
        'greatball': 1.5,
        'ultraball': 2.0,
        'masterball': 255  // 大师球必定成功
    },
    
    // 不同稀有度的基础捕捉率
    rarityCatchRates: {
        'common': 0.4,
        'uncommon': 0.3,
        'rare': 0.2,
        'elite': 0.1,
        'boss': 0.05
    },
    
    /**
     * 尝试捕捉
     * @param {string} ballType - 精灵球类型
     * @returns {Object} - { success: boolean, message: string }
     */
    attemptCapture(ballType) {
        const enemy = GameState.battle.enemy;
        if (!enemy) {
            return { success: false, message: '没有可捕捉的目标！' };
        }
        
        // 不能捕捉Boss（除非有特殊道具）
        if (enemy.isBoss && ballType !== 'masterball') {
            return { success: false, message: 'Boss级敌人无法用普通精灵球捕捉！' };
        }
        
        // 计算捕捉率
        const catchRate = this.calculateCatchRate(enemy, ballType);
        
        console.log(`捕捉率计算: ${catchRate.toFixed(2)} (${(catchRate * 100).toFixed(1)}%)`);
        
        // 尝试捕捉
        const roll = Math.random();
        if (roll < catchRate) {
            // 捕捉成功
            const reward = this.getCapturedReward(enemy);
            return { 
                success: true, 
                message: `成功捕捉 ${enemy.name}！获得 ${reward.name}`,
                reward 
            };
        } else {
            // 捕捉失败
            return { success: false, message: `${enemy.name} 挣脱了精灵球！` };
        }
    },
    
    /**
     * 计算捕捉率
     */
    calculateCatchRate(enemy, ballType) {
        // 基础捕捉率（基于敌人稀有度）
        let baseRate = this.rarityCatchRates[enemy.rarity] || 0.25;
        
        // HP系数（HP越低越容易捕捉）
        const hpPercent = enemy.currentHp / enemy.hp;
        const hpModifier = 1 - hpPercent * 0.5; // HP从100%到0%，系数从0.5到1
        
        // 状态异常加成
        let statusModifier = 1.0;
        if (enemy.statusEffects && enemy.statusEffects.length > 0) {
            for (const status of enemy.statusEffects) {
                if (status === 'sleep' || status === 'freeze') {
                    statusModifier *= 2.0; // 睡眠/冰冻双倍捕捉率
                } else if (status === 'paralysis' || status === 'burn' || status === 'poison') {
                    statusModifier *= 1.5; // 其他状态1.5倍
                }
            }
        }
        
        // 精灵球加成
        const ballModifier = this.ballModifiers[ballType] || 1.0;
        
        // 遗物加成
        let relicModifier = 1.0;
        if (typeof RelicManager !== 'undefined' && typeof RelicManager.hasRelic === 'function') {
            if (RelicManager.hasRelic('friendship-ribbon')) {
                relicModifier *= 1.2;
            }
        }
        
        // 最终捕捉率
        const catchRate = Math.min(1.0, baseRate * hpModifier * statusModifier * ballModifier * relicModifier);
        
        return catchRate;
    },
    
    /**
     * 获取捕捉奖励
     */
    getCapturedReward(enemy) {
        // 根据敌人类型返回奖励
        if (enemy.isPokemon && enemy.pokemonId) {
            // 返回该宝可梦的卡牌
            const pokemon = typeof getPokemonById === 'function' ? getPokemonById(enemy.pokemonId) : null;
            if (pokemon && typeof createPokemonCard === 'function') {
                return createPokemonCard(pokemon);
            }
        }
        
        // 返回敌人对应的技能卡
        if (typeof getCardById === 'function' && enemy.cardReward) {
            return getCardById(enemy.cardReward);
        }
        
        // 默认返回金币
        return { 
            type: 'gold', 
            value: Math.floor(Math.random() * 30) + 20,
            name: `${Math.floor(Math.random() * 30) + 20} 金币`
        };
    },
    
    /**
     * 应用捕捉奖励
     */
    applyCaptureReward(reward) {
        if (!reward) return;
        
        if (reward.type === 'gold') {
            GameState.player.gold += reward.value;
            showMessage(`获得 ${reward.value} 金币！`);
        } else if (reward.isPokemonCard || reward.type === 'attack' || reward.type === 'skill') {
            // 加入牌组
            GameState.player.deck.push(reward);
            showMessage(`获得卡牌: ${reward.name}！`);
        } else {
            // 其他奖励
            if (reward.id) {
                GameState.player.deck.push(reward);
                showMessage(`获得卡牌: ${reward.name}！`);
            }
        }
    }
};
