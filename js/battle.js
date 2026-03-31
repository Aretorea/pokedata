/**
 * 战斗系统模块
 * 负责战斗逻辑、回合管理和伤害计算
 */

// 战斗状态标记
let playerSkipTurn = false;
let enemySkipTurn = false;

// ====== 属性克制表 ======
const TYPE_CHART = {
    // 攻击属性: { 克制的属性: 倍率, 被克制的属性: 倍率 }
    fire: {
        strong: ['grass', 'bug', 'ice', 'steel'],    // 克制
        weak: ['water', 'fire', 'rock', 'dragon']    // 被抵抗
    },
    water: {
        strong: ['fire', 'ground', 'rock'],
        weak: ['water', 'grass', 'dragon']
    },
    grass: {
        strong: ['water', 'ground', 'rock'],
        weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel']
    },
    electric: {
        strong: ['water', 'flying'],
        weak: ['electric', 'grass', 'dragon', 'ground']  // ground免疫
    },
    ice: {
        strong: ['grass', 'ground', 'flying', 'dragon'],
        weak: ['fire', 'water', 'ice', 'steel']
    },
    fighting: {
        strong: ['normal', 'ice', 'rock', 'dark', 'steel'],
        weak: ['flying', 'poison', 'bug', 'psychic', 'fairy']
    },
    poison: {
        strong: ['grass', 'fairy'],
        weak: ['poison', 'ground', 'rock', 'ghost', 'steel']
    },
    ground: {
        strong: ['fire', 'electric', 'poison', 'rock', 'steel'],
        weak: ['grass', 'bug']  // flying免疫
    },
    flying: {
        strong: ['grass', 'fighting', 'bug'],
        weak: ['electric', 'rock', 'steel']
    },
    psychic: {
        strong: ['fighting', 'poison'],
        weak: ['psychic', 'dark', 'steel']
    },
    bug: {
        strong: ['grass', 'psychic', 'dark'],
        weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy']
    },
    rock: {
        strong: ['fire', 'ice', 'flying', 'bug'],
        weak: ['fighting', 'ground', 'steel']
    },
    ghost: {
        strong: ['psychic', 'ghost'],
        weak: ['dark']  // normal免疫
    },
    dragon: {
        strong: ['dragon'],
        weak: ['steel', 'fairy']
    },
    dark: {
        strong: ['psychic', 'ghost'],
        weak: ['fighting', 'dark', 'fairy']
    },
    steel: {
        strong: ['ice', 'rock', 'fairy'],
        weak: ['fire', 'water', 'electric', 'steel']
    },
    fairy: {
        strong: ['fighting', 'dragon', 'dark'],
        weak: ['fire', 'poison', 'steel']
    },
    normal: {
        strong: [],
        weak: ['rock', 'steel']  // ghost免疫
    }
};

// 计算属性克制倍率
function getTypeEffectiveness(attackType, defenderTypes) {
    if (!attackType || !defenderTypes || !TYPE_CHART[attackType]) {
        return 1;
    }
    
    const chart = TYPE_CHART[attackType];
    let multiplier = 1;
    
    for (const defType of defenderTypes) {
        if (chart.strong.includes(defType)) {
            multiplier *= 2;  // 克制，2倍伤害
        } else if (chart.weak.includes(defType)) {
            multiplier *= 0.5;  // 被抵抗，0.5倍伤害
        } else if (attackType === 'electric' && defType === 'ground') {
            multiplier *= 0;  // 电对地面免疫
        } else if (attackType === 'ground' && defType === 'flying') {
            multiplier *= 0;  // 地面对飞行免疫
        } else if (attackType === 'normal' && defType === 'ghost') {
            multiplier *= 0;  // 普通对幽灵免疫
        } else if (attackType === 'fighting' && defType === 'ghost') {
            multiplier *= 0;  // 格斗对幽灵免疫
        } else if (attackType === 'psychic' && defType === 'dark') {
            multiplier *= 0;  // 超能对恶免疫
        } else if (attackType === 'dragon' && defType === 'fairy') {
            multiplier *= 0;  // 龙对妖精免疫
        }
    }
    
    return multiplier;
}

// 开始战斗
function startBattle(enemyData) {
    console.log('战斗开始! 敌人:', enemyData.name);

    // 重置战斗结束标志
    battleEnded = false;

    // 重置跳过回合标记
    playerSkipTurn = false;
    enemySkipTurn = false;

    // 设置战斗状态
    GameState.battle.inBattle = true;
    GameState.battle.turn = 0;
    GameState.battle.energy = GameState.battle.maxEnergy;
    GameState.battle.megaEvolutionUsed = false; // 重置超进化使用标记
    GameState.battle.enemy = {
        ...enemyData,
        currentHp: enemyData.hp,
        shield: 0,
        statusEffects: [],
        nextMove: null,
        damageBonus: 0  // 敌人伤害加成
    };

    // 重置牌组
    GameState.player.drawPile = shuffleDeck([...GameState.player.deck]);
    GameState.player.hand = [];
    GameState.player.discardPile = [];
    GameState.player.shield = 0;
    GameState.player.damageBonus = 0;  // 玩家伤害加成
    GameState.player.substitute = 0;   // 替身
    GameState.player.damageReduction = 0; // 伤害减免
    GameState.player.critBonus = 0;    // 暴击加成

    // 初始化道具管理器
    if (typeof ItemManager !== 'undefined') {
        ItemManager.onBattleStart();
    }

    // 自动使用第一张宝可梦牌变身
    if (typeof PokemonCardSystem !== 'undefined' && typeof PokemonCardSystem.autoTransformOnBattleStart === 'function') {
        PokemonCardSystem.autoTransformOnBattleStart();
    }

    // 显示战斗界面
    showScreen('battle-screen');
    
    // 更新进化进度UI
    if (typeof updateEvolutionProgressUI === 'function') {
        updateEvolutionProgressUI();
    }

    // 开始第一回合
    startTurn();
}

// 开始回合
function startTurn() {
    GameState.battle.turn++;
    GameState.battle.energy = GameState.battle.maxEnergy;

    // 重置跳过标记
    playerSkipTurn = false;
    enemySkipTurn = false;

    // 处理玩家状态效果（回合开始时）
    const playerStatusResult = processStatusEffects(GameState.player, 'turnStart');
    if (playerStatusResult === 'skip') {
        playerSkipTurn = true;
        showMessage('你无法行动!');
    }

    // 处理敌人状态效果（回合开始时）
    const enemyStatusResult = processStatusEffects(GameState.battle.enemy, 'turnStart');
    if (enemyStatusResult === 'skip') {
        enemySkipTurn = true;
    }

    // 如果敌人跳过回合，清空其下一步行动
    if (enemySkipTurn) {
        GameState.battle.enemy.nextMove = null;
    } else {
        // 决定敌人下一步行动
        determineEnemyMove();
    }

    // 抽牌（即使玩家跳过也要抽）
    drawCards(5);

    // 减少状态持续时间（回合结束时减少）
    decreaseStatusDurations(GameState.player);
    decreaseStatusDurations(GameState.battle.enemy);

    updateUI();
    updateBattleUI();

    // 如果玩家跳过回合，自动结束
    if (playerSkipTurn) {
        setTimeout(() => {
            endTurn();
        }, 1500);
    }
}

// 减少状态持续时间
function decreaseStatusDurations(target) {
    if (!target.statusEffects) return;

    for (let i = target.statusEffects.length - 1; i >= 0; i--) {
        target.statusEffects[i].duration--;
        if (target.statusEffects[i].duration <= 0) {
            const statusDef = STATUS_EFFECTS[target.statusEffects[i].name];
            showMessage(`${target === GameState.player ? '你' : '敌人'}的${statusDef ? statusDef.name : target.statusEffects[i].name}状态结束了!`);
            target.statusEffects.splice(i, 1);
        }
    }
}

// 结束回合
function endTurn() {
    // 检查战斗是否已结束
    if (!GameState.battle.inBattle) return;

    // 丢弃手牌
    while (GameState.player.hand.length > 0) {
        const card = GameState.player.hand.pop();
        if (card.exhaust) {
            GameState.player.exhaustPile.push(card);
        } else {
            GameState.player.discardPile.push(card);
        }
    }

    // 清除护盾
    GameState.player.shield = 0;
    GameState.battle.enemy.shield = 0;

    // 清除临时buff
    GameState.player.damageBonus = 0;
    GameState.player.substitute = 0;

    // 敌人行动（如果敌人没有跳过回合）
    if (!enemySkipTurn && GameState.battle.enemy.nextMove) {
        executeEnemyMove();
    }

    // 检查战斗是否结束
    if (checkBattleEnd()) {
        return;
    }

    // 开始新回合
    startTurn();
}

// 打出卡牌
function playCard(cardIndex) {
    // 检查是否可以行动
    if (playerSkipTurn) {
        showMessage('你无法行动!');
        return;
    }

    const card = GameState.player.hand[cardIndex];
    if (!card) return;

    // 检查能量是否足够
    if (card.cost > GameState.battle.energy) {
        showMessage('能量不足!');
        return;
    }

    // 消耗能量
    GameState.battle.energy -= card.cost;

    // 从手牌移除
    GameState.player.hand.splice(cardIndex, 1);

    // 执行卡牌效果
    executeCardEffects(card);

    // 判断是否是消耗道具卡
    if (card.type === 'item' && card.consume) {
        // 消耗道具卡直接进入消耗堆，不入弃牌堆
        GameState.player.exhaustPile.push(card);
        console.log(`消耗道具 ${card.name} 已使用，将从牌组永久移除`);
        
        // 记录要移除的道具（使用引用来标识）
        if (typeof ItemManager !== 'undefined') {
            ItemManager.consumedItems.push(card);
        }
    } else {
        // 添加到弃牌堆
        GameState.player.discardPile.push(card);
    }

    // 更新统计
    GameState.stats.cardsPlayed++;

    updateUI();
    updateBattleUI();

    // 检查战斗是否结束
    checkBattleEnd();
}

// 执行卡牌效果
function executeCardEffects(card) {
    const effects = card.effects || [];

    for (const effect of effects) {
        // 检查概率效果
        if (effect.chance && Math.random() > effect.chance) {
            continue;
        }

        switch (effect.type) {
            case 'damage':
                let damage = effect.value;

                // 应用伤害加成
                if (GameState.player.damageBonus > 0) {
                    damage += GameState.player.damageBonus;
                }

                // 计算技能类型加成（四维数值）
                const skillType = card.skillType || effect.skillType || 'physical';
                const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
                
                if (activePokemon) {
                    if (skillType === 'physical') {
                        // 物理攻击：使用物攻
                        const attackStat = activePokemon.attack || 50;
                        damage = Math.floor(damage * (attackStat / 50));
                    } else if (skillType === 'special') {
                        // 特殊攻击：使用特攻
                        const spAttackStat = activePokemon.spAttack || 50;
                        damage = Math.floor(damage * (spAttackStat / 50));
                    }
                    
                    // 本系加成检查
                    const attackType = effect.attackType || card.pokemonType;
                    if (attackType && activePokemon.types && activePokemon.types.includes(attackType)) {
                        // 获取本系加成倍率（默认1.5倍）
                        let stabMultiplier = 1.5;
                        
                        // 检查适应力特性
                        if (activePokemon.ability === 'adaptability' && typeof AbilityManager !== 'undefined') {
                            const ability = AbilityManager.getAbility('adaptability');
                            if (ability) {
                                stabMultiplier = ability.effect.value || 2.0;
                            }
                        }
                        
                        damage = Math.floor(damage * stabMultiplier);
                        showMessage('本系加成!');
                    }
                }

                // 获取攻击属性（优先使用effect.attackType，否则使用card.pokemonType）
                const attackType = effect.attackType || card.pokemonType || 'normal';
                
                dealDamageToEnemy(damage, attackType, effect);
                break;
            
            case 'transform':
                // 宝可梦变身效果
                if (card.isPokemonCard && card.pokemonData) {
                    if (typeof PokemonCardSystem !== 'undefined' && typeof PokemonCardSystem.usePokemonCard === 'function') {
                        const transformResult = PokemonCardSystem.usePokemonCard(card);
                        if (transformResult && transformResult.remove) {
                            updateBattleUI();
                        }
                    }
                }
                break;

            case 'block':
                let blockValue = effect.value;

                // 应用角色被动（小刚的护盾加成）
                if (GameState.character && GameState.character.passive && GameState.character.passive.name === '坚如磐石') {
                    blockValue = Math.floor(blockValue * 1.25);
                }

                GameState.player.shield += blockValue;
                showDamageNumber(blockValue, 'heal', 'player');
                break;

            case 'heal':
                healPlayer(effect.value);
                break;

            case 'fullHeal':
                healPlayer(GameState.player.maxHp - GameState.player.hp);
                break;

            case 'draw':
                drawCards(effect.value);
                break;

            case 'applyStatus':
                applyStatus(GameState.battle.enemy, effect.status, effect.duration);
                break;

            case 'selfStatus':
                applyStatus(GameState.player, effect.status, effect.duration);
                break;

            case 'cureStatus':
                GameState.player.statusEffects = [];
                showMessage('状态已治愈!');
                break;

            case 'gainEnergy':
                GameState.battle.energy += effect.value;
                showMessage(`获得 ${effect.value} 点能量!`);
                break;

            case 'maxEnergyUp':
                GameState.battle.maxEnergy += effect.value;
                GameState.battle.energy += effect.value;
                showMessage(`能量上限提升!`);
                break;

            case 'selfDamage':
                dealDamageToPlayer(effect.value);
                break;

            case 'buff':
                if (effect.buff === 'doubleDamage') {
                    GameState.player.damageBonus = effect.value || 10;
                    showMessage('下次攻击伤害提升!');
                } else if (effect.buff === 'strengthen') {
                    GameState.player.damageBonus = (GameState.player.damageBonus || 0) + (effect.damageBonus || 3);
                    showMessage('伤害提升!');
                }
                break;

            case 'substitute':
                GameState.player.substitute = effect.value;
                showMessage(`创建了替身!`);
                break;

            case 'randomCard':
                // 随机使用一张指定稀有度的卡牌
                const rarities = effect.rarity || ['rare'];
                const availableCards = CARDS_DATA.obtainable.filter(c => rarities.includes(c.rarity));
                if (availableCards.length > 0) {
                    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
                    showMessage(`摇出了 ${randomCard.name}!`);
                    executeCardEffects(randomCard);
                }
                break;

            // ====== 道具卡效果 ======
            case 'heal':
                if (typeof healPlayer === 'function') {
                    healPlayer(effect.value);
                }
                break;
                
            case 'fullHeal':
                GameState.player.hp = GameState.player.maxHp;
                showMessage('HP完全恢复！');
                break;
                
            case 'cureStatus':
                GameState.player.statusEffects = [];
                showMessage('状态异常已治愈！');
                break;

            case 'capture':
                // 精灵球捕捉
                if (typeof PokeballSystem !== 'undefined' && typeof PokeballSystem.attemptCapture === 'function') {
                    const result = PokeballSystem.attemptCapture(effect.ballType);
                    if (result.success) {
                        showMessage(result.message);
                        setTimeout(() => endBattle(true), 1000);
                    } else {
                        showMessage(result.message);
                    }
                }
                break;

            case 'evolve':
                // 进化石进化
                if (typeof ItemManager !== 'undefined') {
                    ItemManager.attemptItemEvolution(effect.elementType);
                }
                break;

            case 'megaEvolve':
                // 超进化
                if (typeof ItemManager !== 'undefined') {
                    ItemManager.performMegaEvolution(effect.pokemon, effect.form);
                }
                break;

            case 'itemBuff':
                // 道具buff效果
                if (effect.buff === 'damageBonus') {
                    GameState.player.damageBonus = (GameState.player.damageBonus || 0) + (effect.value || 0);
                    showMessage(`攻击增强！伤害+${effect.value}`);
                } else if (effect.buff === 'damageReduction') {
                    GameState.player.damageReduction = (GameState.player.damageReduction || 0) + (effect.value || 0);
                    showMessage('防御增强！');
                } else if (effect.buff === 'critBonus') {
                    GameState.player.critBonus = (GameState.player.critBonus || 0) + (effect.value || 0);
                    showMessage('暴击率提升！');
                }
                break;

            case 'endTurn':
                // 结束当前回合
                showMessage('回合结束！');
                setTimeout(() => endTurn(), 300);
                break;

            case 'debuff':
                // 对敌人施加debuff
                if (effect.debuff === 'weaken') {
                    GameState.battle.enemy.weakened = (GameState.battle.enemy.weakened || 0) + (effect.value || 0.25);
                    GameState.battle.enemy.weakenedDuration = effect.duration || 2;
                    showMessage('敌人被削弱！');
                } else if (effect.debuff === 'vulnerable') {
                    GameState.battle.enemy.vulnerable = (GameState.battle.enemy.vulnerable || 0) + (effect.value || 1);
                    GameState.battle.enemy.vulnerableDuration = effect.duration || 2;
                    showMessage('敌人变得脆弱！');
                } else if (effect.debuff === 'weakenShield') {
                    // 削弱护盾
                    if (GameState.battle.enemy.shield > 0) {
                        GameState.battle.enemy.shield = Math.floor(GameState.battle.enemy.shield * (1 - (effect.value || 0.5)));
                        showMessage('敌人的护盾被削弱！');
                    }
                }
                break;

            // ====== 能力提升系统 ======
            case 'statBoost':
                applyStatBoost(effect.stat, effect.stages || 1);
                break;

            case 'statDrop':
                applyStatDrop(effect.stat, effect.stages || 1, effect.target || 'enemy');
                break;

            // ====== 盾反流效果 ======
            case 'counterSetup':
                GameState.player.counterSetup = {
                    multiplier: effect.multiplier || 2,
                    active: true
                };
                showMessage('准备反击！');
                break;

            case 'reflectSetup':
                GameState.player.reflectSetup = {
                    multiplier: effect.multiplier || 0.5,
                    active: true
                };
                showMessage('镜面反射准备！');
                break;

            case 'bideSetup':
                GameState.player.bideSetup = {
                    damageTaken: 0,
                    turns: 1,
                    active: true
                };
                showMessage('忍耐积蓄中...');
                break;

            case 'invulnerable':
                GameState.player.invulnerable = effect.duration || 1;
                showMessage('获得无敌状态！');
                break;

            case 'untouchable':
                GameState.player.untouchable = effect.duration || 1;
                showMessage('进入虚无状态！');
                break;

            // ====== 连击流效果 ======
            case 'damage':
                // 处理多次攻击
                const hits = effect.hits || 1;
                let totalDamage = 0;
                for (let i = 0; i < hits; i++) {
                    const hitDamage = executeDamageCalculation(effect, card);
                    totalDamage += hitDamage;
                    if (i < hits - 1) {
                        showMessage(`第${i + 1}击: ${hitDamage}伤害！`);
                    }
                }
                if (hits > 1) {
                    showMessage(`连击${hits}次！共${totalDamage}伤害！`);
                }
                break;

            // ====== 多次行动流 ======
            case 'extraAction':
                GameState.battle.extraActions = (GameState.battle.extraActions || 0) + (effect.count || 1);
                GameState.battle.extraActionType = effect.type || 'any';
                showMessage(`可再使用${effect.count}张卡牌！`);
                break;

            // ====== 行动滞后 ======
            case 'delayedAttack':
                GameState.player.delayedAttack = {
                    value: effect.value,
                    turns: effect.delayTurns || 1,
                    critBonus: effect.critBonus || 0,
                    chargeFirst: effect.chargeFirst || false
                };
                if (effect.chargeFirst) {
                    showMessage('蓄力中...');
                } else {
                    showMessage(`${effect.delayTurns}回合后发动！`);
                }
                break;

            case 'priority':
                if (effect.nextTurn) {
                    GameState.player.priorityNextTurn = true;
                    showMessage('下回合先手！');
                }
                break;

            default:
                console.log('未知效果类型:', effect.type);
                
                // 道具卡效果处理
                if (card && card.type === 'item') {
                    handleItemCardEffect(effect, card);
                }
        }
    }

    // 处理道具卡消耗
    if (card && card.type === 'item') {
        handleItemCardConsumption(card);
    }

    // 动画效果
    animateCardPlay();
}

// 处理道具卡效果
function handleItemCardEffect(effect, card) {
    if (typeof ItemManager !== 'undefined') {
        ItemManager.executeItemEffect(effect, { card });
    }
}

// 处理道具卡消耗
function handleItemCardConsumption(card) {
    if (typeof ItemManager === 'undefined') return;
    
    if (card.consume) {
        // 消耗道具 - 从牌组永久移除
        ItemManager.consumedItems.push(card.id);
        console.log(`道具 ${card.name} 已消耗，将从牌组永久移除`);
        
        // 从当前手牌移到消耗堆
        const handIndex = GameState.player.hand.findIndex(c => c.id === card.id);
        if (handIndex >= 0) {
            GameState.player.hand.splice(handIndex, 1);
        }
        
        // 加入消耗堆（不再进入弃牌堆）
        GameState.player.exhaustPile.push(card);
        
    } else if (card.returnAfterBattle) {
        // 战斗后返回的道具 - 临时移除
        ItemManager.battleRemovedItems.push(card.id);
        ItemManager.usedSpecialItems.push(card.id);
        console.log(`道具 ${card.name} 将在战斗后返回`);
        
        // 从手牌移到消耗堆（战斗结束后返回牌组）
        const handIndex = GameState.player.hand.findIndex(c => c.id === card.id);
        if (handIndex >= 0) {
            GameState.player.hand.splice(handIndex, 1);
        }
        GameState.player.exhaustPile.push(card);
    }
}

// 对敌人造成伤害
function dealDamageToEnemy(baseDamage, attackType, options = {}) {
    let damage = baseDamage;
    
    // 应用敌人脆弱效果
    if (GameState.battle.enemy.vulnerable && GameState.battle.enemy.vulnerable > 0) {
        damage = Math.floor(damage * (1 + GameState.battle.enemy.vulnerable * 0.25));
    }
    
    // 应用敌人削弱效果
    if (GameState.battle.enemy.weakened && GameState.battle.enemy.weakened > 0) {
        // 敌人造成的伤害减少（这个效果在敌人攻击时处理）
    }
    
    // 获取遗物加成
    if (typeof RelicManager !== 'undefined' && typeof RelicManager.getTypeDamageBonus === 'function') {
        const typeBonus = RelicManager.getTypeDamageBonus(attackType);
        if (typeBonus > 0) {
            damage = Math.floor(damage * (1 + typeBonus));
        }
        
        // 效果拔群加成
        const enemy = GameState.battle.enemy;
        if (enemy.types && typeof RelicManager.hasRelic === 'function') {
            const effectiveness = getTypeEffectiveness(attackType, enemy.types);
            if (effectiveness > 1 && RelicManager.hasRelic('expert-belt')) {
                damage = Math.floor(damage * (1 + 0.25));
            }
        }
    }

    // 计算属性克制
    if (attackType && attackType !== 'normal' && GameState.battle.enemy.types) {
        const effectiveness = getTypeEffectiveness(attackType, GameState.battle.enemy.types);
        
        console.log(`属性克制计算: ${attackType} vs ${GameState.battle.enemy.types.join(',')} = ${effectiveness}倍`);
        
        // 冠军徽章加成
        let effectivenessMultiplier = effectiveness;
        if (typeof RelicManager !== 'undefined' && typeof RelicManager.hasRelic === 'function' && RelicManager.hasRelic('champion-badge')) {
            effectivenessMultiplier = Math.min(2.5, effectiveness * 1.25);
        }
        
        damage = Math.floor(damage * effectivenessMultiplier);

        if (effectiveness > 1) {
            showMessage('效果拔群!');
        } else if (effectiveness < 1 && effectiveness > 0) {
            showMessage('效果不太好...');
        } else if (effectiveness === 0) {
            showMessage('没有效果!');
            showDamageNumber(0, 'damage', 'enemy');
            return;
        }
    }

    // 应用角色被动
    if (GameState.character && GameState.character.passive) {
        if (GameState.character.passive.name === '进攻意识') {
            damage += 1;
        } else if (GameState.character.passive.name === '宝可梦大师') {
            damage = Math.floor(damage * 1.1);
        }
    }

    // 暴击检查
    let critChance = options.critChance || 0;
    
    // 遗物暴击加成
    if (typeof RelicManager !== 'undefined' && typeof RelicManager.getCritChanceBonus === 'function') {
        critChance += RelicManager.getCritChanceBonus();
    }
    
    let critMultiplier = 1.5;
    if (typeof RelicManager !== 'undefined' && typeof RelicManager.getCritDamageBonus === 'function') {
        critMultiplier += RelicManager.getCritDamageBonus();
    }
    
    if (critChance > 0 && Math.random() < critChance) {
        damage = Math.floor(damage * critMultiplier);
        showMessage('暴击!');
    }

    // 确保伤害至少为0
    damage = Math.max(0, damage);

    // 计算护盾
    let actualDamage = damage;
    if (GameState.battle.enemy.shield > 0) {
        if (GameState.battle.enemy.shield >= damage) {
            GameState.battle.enemy.shield -= damage;
            actualDamage = 0;
        } else {
            actualDamage = damage - GameState.battle.enemy.shield;
            GameState.battle.enemy.shield = 0;
        }
    }

    // 造成伤害
    if (actualDamage > 0) {
        GameState.battle.enemy.currentHp -= actualDamage;
        GameState.stats.damageDealt += actualDamage;
        animateSprite('enemy', 'hurt');
    }

    showDamageNumber(actualDamage, 'damage', 'enemy');

    // 检查进化触发
    checkEvolutionTrigger('damage', actualDamage);
    
    // 更新UI
    updateBattleUI();
    
    // 检查战斗是否结束
    setTimeout(() => checkBattleEnd(), 100);
}

// 对玩家造成伤害
function dealDamageToPlayer(damage) {
    // 确保伤害至少为0
    damage = Math.max(0, damage);

    let actualDamage = damage;

    // 检查闪避
    const evasionChance = getEvasionBonus('player');
    if (evasionChance > 0 && Math.random() < evasionChance) {
        showMessage('闪避成功！');
        showDamageNumber(0, 'miss', 'player');
        return;
    }

    // 检查无敌状态
    if (GameState.player.invulnerable && GameState.player.invulnerable > 0) {
        showMessage('无敌状态，伤害无效！');
        return;
    }

    // 检查虚无状态
    if (GameState.player.untouchable && GameState.player.untouchable > 0) {
        showMessage('虚无状态，无法被攻击！');
        return;
    }

    // 检查替身
    if (GameState.player.substitute > 0) {
        if (GameState.player.substitute >= damage) {
            GameState.player.substitute -= damage;
            showMessage('替身吸收了伤害!');
            showDamageNumber(0, 'damage', 'player');
            return;
        } else {
            actualDamage = damage - GameState.player.substitute;
            GameState.player.substitute = 0;
            showMessage('替身被击破!');
        }
    }

    // 计算护盾
    if (GameState.player.shield > 0) {
        if (GameState.player.shield >= actualDamage) {
            GameState.player.shield -= actualDamage;
            actualDamage = 0;
        } else {
            actualDamage = actualDamage - GameState.player.shield;
            GameState.player.shield = 0;
        }
    }

    // 应用伤害减少效果
    if (GameState.player.damageReduction && GameState.player.damageReduction > 0) {
        actualDamage = Math.floor(actualDamage * (1 - GameState.player.damageReduction));
    }

    if (actualDamage > 0) {
        GameState.player.hp -= actualDamage;
        GameState.stats.damageTaken += actualDamage;
        
        // 记录忍耐伤害
        if (GameState.player.bideSetup && GameState.player.bideSetup.active) {
            GameState.player.bideSetup.damageTaken += actualDamage;
        }
        
        animateSprite('player', 'hurt');

        // 确保HP不低于0
        if (GameState.player.hp < 0) {
            GameState.player.hp = 0;
        }
    }

    showDamageNumber(actualDamage, 'damage', 'player');
}

// 治疗玩家
function healPlayer(amount) {
    const healAmount = Math.min(amount, GameState.player.maxHp - GameState.player.hp);
    if (healAmount > 0) {
        GameState.player.hp += healAmount;
        showDamageNumber(healAmount, 'heal', 'player');
    } else {
        showMessage('HP已满!');
    }
}

// 应用状态效果
function applyStatus(target, statusName, duration) {
    // 检查状态是否存在
    const statusDef = STATUS_EFFECTS[statusName];
    if (!statusDef) {
        console.warn('未知状态:', statusName);
        return;
    }

    const existing = target.statusEffects ? target.statusEffects.find(s => s.name === statusName) : null;

    if (existing) {
        // 刷新持续时间
        existing.duration = Math.max(existing.duration, duration || statusDef.duration);
        existing.stacks = (existing.stacks || 1) + 1;
    } else {
        if (!target.statusEffects) {
            target.statusEffects = [];
        }
        target.statusEffects.push({
            name: statusName,
            duration: duration || statusDef.duration,
            stacks: 1
        });
    }

    showMessage(`${target === GameState.player ? '你' : '敌人'}陷入${statusDef.name}状态!`);
}

// 处理状态效果
function processStatusEffects(target, timing) {
    if (!target.statusEffects || target.statusEffects.length === 0) return null;

    for (let i = target.statusEffects.length - 1; i >= 0; i--) {
        const status = target.statusEffects[i];
        const statusDef = STATUS_EFFECTS[status.name];

        if (!statusDef) continue;

        if (timing === 'turnStart') {
            // 处理回合开始的状态效果
            switch (status.name) {
                case 'burn':
                case 'poison':
                    const damage = statusDef.damagePerTurn * status.stacks;
                    if (target === GameState.player) {
                        dealDamageToPlayer(damage);
                    } else {
                        GameState.battle.enemy.currentHp -= damage;
                        showDamageNumber(damage, 'damage', 'enemy');
                        animateSprite('enemy', 'hurt');
                    }
                    break;

                case 'toxic':
                    // 剧毒：每回合伤害递增
                    const toxicDamage = statusDef.damagePerTurn * status.stacks;
                    status.stacks++; // 递增
                    if (target === GameState.player) {
                        dealDamageToPlayer(toxicDamage);
                    } else {
                        GameState.battle.enemy.currentHp -= toxicDamage;
                        showDamageNumber(toxicDamage, 'damage', 'enemy');
                    }
                    break;

                case 'paralysis':
                    if (Math.random() < statusDef.skipChance) {
                        showMessage(`${target === GameState.player ? '你' : '敌人'}因麻痹无法行动!`);
                        return 'skip';
                    }
                    break;

                case 'sleep':
                    showMessage(`${target === GameState.player ? '你' : '敌人'}正在睡眠中...`);
                    return 'skip';

                case 'freeze':
                    showMessage(`${target === GameState.player ? '你' : '敌人'}被冻住了!`);
                    return 'skip';
            }
        }
    }

    return null;
}

// 决定敌人下一步行动
function determineEnemyMove() {
    const enemy = GameState.battle.enemy;
    if (!enemy.moves || enemy.moves.length === 0) {
        console.error('敌人没有招式数据');
        enemy.nextMove = { name: '攻击', intent: 'attack', damage: 5 };
        return;
    }

    const move = getEnemyMove(enemy, GameState.battle.turn);
    enemy.nextMove = move;
}

// 执行敌人行动
function executeEnemyMove() {
    const enemy = GameState.battle.enemy;
    const move = enemy.nextMove;

    if (!move) {
        console.error('敌人没有下一步行动');
        return;
    }

    console.log(`敌人使用 ${move.name}!`);

    switch (move.intent) {
        case 'attack':
            let damage = move.damage || 0;

            // 应用敌人的伤害加成
            damage += enemy.damageBonus || 0;

            // 多段攻击
            const hits = move.hits || 1;
            for (let i = 0; i < hits; i++) {
                dealDamageToPlayer(damage);

                // 状态效果
                if (move.effect === 'poison') {
                    applyStatus(GameState.player, 'poison');
                } else if (move.effect === 'burn') {
                    applyStatus(GameState.player, 'burn');
                } else if (move.effect === 'paralyze') {
                    applyStatus(GameState.player, 'paralysis');
                }
            }
            break;

        case 'defend':
            enemy.shield += move.block || 0;
            showMessage(`敌人获得了护盾!`);
            break;

        case 'buff':
            enemy.damageBonus = (enemy.damageBonus || 0) + (move.damageBonus || 3);
            showMessage(`敌人${move.name}!`);
            break;

        case 'debuff':
            if (move.effect === 'weaken') {
                showMessage('你被削弱了!');
            } else if (move.effect === 'paralyze') {
                applyStatus(GameState.player, 'paralysis');
            } else if (move.effect === 'sleep') {
                applyStatus(GameState.player, 'sleep');
            }
            break;
    }

    // 敌人自我伤害
    if (move.selfDamage) {
        enemy.currentHp -= move.selfDamage;
    }

    // 敌人获得护盾
    if (move.selfBlock) {
        enemy.shield += move.selfBlock;
    }

    // 清空下一步行动
    enemy.nextMove = null;

    updateBattleUI();
}

// 检查战斗结束
function checkBattleEnd() {
    const enemyHp = GameState.battle.enemy.currentHp;
    const playerHp = GameState.player.hp;
    
    console.log('checkBattleEnd - 敌人HP:', enemyHp, '玩家HP:', playerHp);
    
    // 检查敌人是否死亡
    if (enemyHp <= 0) {
        console.log('敌人死亡，调用 endBattle(true)');
        endBattle(true);
        return true;
    }

    // 检查玩家是否死亡
    if (playerHp <= 0) {
        console.log('玩家死亡，调用 endBattle(false)');
        endBattle(false);
        return true;
    }

    return false;
}

// 结束战斗
let battleEnded = false; // 防止重复调用

function endBattle(victory) {
    // 防止重复调用
    if (battleEnded) {
        console.log('战斗已结束，跳过重复调用');
        return;
    }
    battleEnded = true;
    
    console.log('=== endBattle 调用 ===');
    console.log('胜利:', victory);
    
    // 还原超进化状态（在道具管理器处理之前）
    if (typeof ItemManager !== 'undefined' && typeof ItemManager.revertMegaEvolution === 'function') {
        ItemManager.revertMegaEvolution();
    }
    
    // 道具管理器处理战斗结束
    if (typeof ItemManager !== 'undefined' && typeof ItemManager.onBattleEnd === 'function') {
        ItemManager.onBattleEnd();
    }
    
    // 遗物效果处理
    if (typeof RelicManager !== 'undefined' && typeof RelicManager.onBattleEnd === 'function') {
        RelicManager.onBattleEnd(victory);
    }
    
    // 战斗结束时恢复自动使用的宝可梦牌
    if (typeof PokemonCardSystem !== 'undefined' && PokemonCardSystem.activePokemon) {
        const activePokemonCard = PokemonCardSystem.activePokemon;
        
        // 检查宝可梦牌是否在抽牌堆中
        const inDrawPile = GameState.player.drawPile.some(c => c.id === activePokemonCard.id);
        const inHand = GameState.player.hand.some(c => c.id === activePokemonCard.id);
        const inDiscard = GameState.player.discardPile.some(c => c.id === activePokemonCard.id);
        
        // 如果不在任何牌堆中，说明是被自动使用的，需要恢复
        if (!inDrawPile && !inHand && !inDiscard) {
            console.log('恢复自动使用的宝可梦牌:', activePokemonCard.name);
            GameState.player.drawPile.push(activePokemonCard);
        }
        
        // 清除激活状态
        PokemonCardSystem.activePokemon = null;
    }
    
    GameState.battle.inBattle = false;

    if (victory) {
        const enemy = GameState.battle.enemy;
        
        // 更新宝可梦战斗胜利次数
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        if (activePokemon && activePokemon.evolution) {
            activePokemon.battleWins = (activePokemon.battleWins || 0) + 1;
            
            // 检查共享战斗经验的遗物
            if (typeof RelicManager !== 'undefined' && typeof RelicManager.hasSharedBattleExp === 'function' && RelicManager.hasSharedBattleExp()) {
                // 所有宝可梦都获得战斗经验
                const pokemonCards = GameState.player.pokemonCards || [];
                for (const card of pokemonCards) {
                    if (card.pokemonData && card.pokemonData !== activePokemon) {
                        card.pokemonData.battleWins = (card.pokemonData.battleWins || 0) + 1;
                    }
                }
            }
            
            // 检查进化触发（战斗胜利触发）
            if (activePokemon.evolution.trigger === 'battleWins') {
                if (activePokemon.battleWins >= activePokemon.evolution.threshold) {
                    showEvolutionChoice(activePokemon);
                }
            }
            
            // 增加亲密度
            let friendshipGain = 3;
            if (typeof RelicManager !== 'undefined' && typeof RelicManager.getFriendshipBonus === 'function') {
                friendshipGain += RelicManager.getFriendshipBonus() * 3;
            }
            activePokemon.friendship = (activePokemon.friendship || 70) + friendshipGain;
            
            // 检查亲密度进化
            if (activePokemon.evolution && activePokemon.evolution.trigger === 'friendship') {
                if (activePokemon.friendship >= 220) {
                    showEvolutionChoice(activePokemon);
                }
            }
        }
        
        // 检查是否是Boss（添加节点类型判断作为备选）
        const isBossNode = GameState.progress.currentNode && GameState.progress.currentNode.type === 'boss';
        const isBossEnemy = enemy.isBoss === true;
        
        console.log('isBossNode:', isBossNode, 'isBossEnemy:', isBossEnemy);
        
        const goldReward = getRandomGold(enemy.goldReward[0], enemy.goldReward[1]);

        GameState.player.gold += goldReward;
        GameState.stats.enemiesDefeated++;

        showMessage(`战斗胜利! 获得 ${goldReward} 金币!`);

        // 检查是否是Boss（使用双重判断）
        if (isBossEnemy || isBossNode) {
            console.log('检测到Boss战斗胜利!');
            
            // Boss掉落遗物选择
            setTimeout(() => {
                showRelicRewardScreen('boss');
            }, 1500);
            return;
        }
        
        // 检查是否是精英
        if (enemy.isElite) {
            // 精英战显示遗物选择界面
            setTimeout(() => {
                showRelicRewardScreen('elite');
            }, 1500);
            return;
        }

        // 普通战斗后选择卡牌奖励
        setTimeout(() => {
            showRewardScreen(false);
        }, 1500);
    } else {
        setTimeout(() => gameOver(), 1000);
    }
}

// 显示进化选择对话框
function showEvolutionChoice(pokemon) {
    const evolution = getEvolutionPokemon(pokemon.id);
    if (!evolution) return;
    
    const dialog = document.getElementById('evolution-dialog');
    if (!dialog) {
        // 简化处理，直接进化
        performEvolution(pokemon, evolution);
        return;
    }
    
    // 填充进化前后数据
    document.getElementById('evolution-before-name').textContent = pokemon.name;
    document.getElementById('evolution-before-sprite').textContent = pokemon.sprite || '❓';
    document.getElementById('evolution-before-stats').innerHTML = `
        HP: ${pokemon.hp}/${pokemon.maxHp}<br>
        物攻: ${pokemon.attack || 50} | 物防: ${pokemon.defense || 50}<br>
        特攻: ${pokemon.spAttack || 50} | 特防: ${pokemon.spDefense || 50}
    `;
    
    document.getElementById('evolution-after-name').textContent = evolution.name;
    document.getElementById('evolution-after-sprite').textContent = evolution.sprite || '❓';
    document.getElementById('evolution-after-stats').innerHTML = `
        HP: <span class="${evolution.hp > pokemon.maxHp ? 'stat-up' : ''}">${evolution.hp}</span><br>
        物攻: <span class="${evolution.attack > (pokemon.attack || 50) ? 'stat-up' : ''}">${evolution.attack || 50}</span> | 
        物防: <span class="${evolution.defense > (pokemon.defense || 50) ? 'stat-up' : ''}">${evolution.defense || 50}</span><br>
        特攻: <span class="${evolution.spAttack > (pokemon.spAttack || 50) ? 'stat-up' : ''}">${evolution.spAttack || 50}</span> | 
        特防: <span class="${evolution.spDefense > (pokemon.spDefense || 50) ? 'stat-up' : ''}">${evolution.spDefense || 50}</span>
    `;
    
    // 显示对话框
    dialog.style.display = 'flex';
    
    // 绑定按钮事件
    const confirmBtn = document.getElementById('evolution-confirm-btn');
    const skipBtn = document.getElementById('evolution-skip-btn');
    const neverBtn = document.getElementById('evolution-never-btn');
    
    const handleConfirm = () => {
        dialog.style.display = 'none';
        performEvolution(pokemon, evolution);
        cleanup();
    };
    
    const handleSkip = () => {
        dialog.style.display = 'none';
        showMessage(`${pokemon.name} 此次不进化`);
        cleanup();
    };
    
    const handleNever = () => {
        dialog.style.display = 'none';
        pokemon.neverEvolve = true;
        showMessage(`${pokemon.name} 将永远不再进化`);
        cleanup();
    };
    
    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        skipBtn.removeEventListener('click', handleSkip);
        neverBtn.removeEventListener('click', handleNever);
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    skipBtn.addEventListener('click', handleSkip);
    neverBtn.addEventListener('click', handleNever);
}

// 执行进化
function performEvolution(currentPokemon, newPokemon) {
    showMessage(`${currentPokemon.name} 正在进化!`);

    setTimeout(() => {
        // 更新玩家宝可梦
        const hpRatio = currentPokemon.hp / currentPokemon.maxHp;
        newPokemon.hp = Math.ceil(newPokemon.hp * hpRatio);
        newPokemon.battleWins = 0;
        newPokemon.evolutionProgress = 0;
        newPokemon.friendship = currentPokemon.friendship || 70;
        newPokemon.statusEffects = currentPokemon.statusEffects ? [...currentPokemon.statusEffects] : [];
        
        GameState.player.activePokemon = newPokemon;
        if (typeof PokemonCardSystem !== 'undefined' && PokemonCardSystem.activePokemon) {
            PokemonCardSystem.activePokemon = newPokemon;
        }
        
        // 更新HP上限
        GameState.player.maxHp = newPokemon.hp;
        GameState.player.hp = newPokemon.hp;

        // 添加进化后的技能卡牌
        if (newPokemon.skills && newPokemon.skills.length > 0) {
            const skillCard = createSkillCard(newPokemon.skills[0], newPokemon);
            if (skillCard) {
                GameState.player.deck.push(skillCard);
                showMessage(`${newPokemon.name} 学会了 ${skillCard.name}!`);
            }
        }

        // 播放进化效果
        animateEvolution();

        // 更新UI
        updateBattleUI();
        updateEvolutionProgressUI();

        showMessage(`恭喜! ${currentPokemon.name} 进化成了 ${newPokemon.name}!`);
    }, 1000);
}

// 更新进化进度UI
function updateEvolutionProgressUI() {
    const container = document.getElementById('evolution-progress-container');
    const barFill = document.getElementById('evolution-bar-fill');
    const progressText = document.getElementById('evolution-progress-text');
    
    const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
    
    if (!activePokemon || !activePokemon.evolution || activePokemon.neverEvolve) {
        if (container) container.style.display = 'none';
        return;
    }
    
    if (container) container.style.display = 'block';
    
    const evolution = activePokemon.evolution;
    let progress = 0;
    let progressText_str = '';
    
    switch (evolution.trigger) {
        case 'battleWins':
            progress = (activePokemon.battleWins || 0) / evolution.threshold * 100;
            progressText_str = `战斗胜利: ${activePokemon.battleWins || 0}/${evolution.threshold}`;
            break;
        case 'friendship':
            progress = (activePokemon.friendship || 0) / 220 * 100;
            progressText_str = `亲密度: ${activePokemon.friendship || 0}/220`;
            break;
        case 'item':
            if (evolution.requiredItem) {
                progressText_str = `需要道具: ${getItemName(evolution.requiredItem)}`;
                progress = 0;
            }
            break;
        default:
            progress = (activePokemon.evolutionProgress || 0) / evolution.threshold * 100;
            progressText_str = `进度: ${activePokemon.evolutionProgress || 0}/${evolution.threshold}`;
    }
    
    if (barFill) barFill.style.width = Math.min(100, progress) + '%';
    if (progressText) progressText.textContent = progressText_str;
    
    // 进化就绪时高亮
    if (progress >= 100) {
        if (container) {
            container.style.border = '2px solid #ffd700';
            container.style.animation = 'pulse 1s ease infinite';
        }
    }
}

// 获取道具名称
function getItemName(itemId) {
    const itemNames = {
        'thunder-stone': '雷之石',
        'fire-stone': '火之石',
        'water-stone': '水之石',
        'moon-stone': '月之石',
        'sun-stone': '日之石',
        'leaf-stone': '叶之石'
    };
    return itemNames[itemId] || itemId;
}

// 显示伤害数字
function showDamageNumber(value, type, target) {
    const container = document.getElementById(`${target}-area`);
    if (!container) return;

    const number = document.createElement('div');
    number.className = `damage-number ${type === 'heal' ? 'heal-number' : ''}`;
    number.textContent = type === 'heal' ? `+${value}` : `-${value}`;

    container.appendChild(number);

    setTimeout(() => {
        if (number.parentNode) {
            number.remove();
        }
    }, 1000);
}

// 显示消息
function showMessage(text) {
    console.log('[消息]', text);

    // 移除之前的消息
    const existingMsg = document.querySelector('.game-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // 创建临时消息元素
    const msg = document.createElement('div');
    msg.className = 'game-message';
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.85);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
        border: 2px solid #3d7dca;
    `;
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
        if (msg.parentNode) {
            msg.remove();
        }
    }, 1500);
}

// 精灵动画
function animateSprite(target, type) {
    const sprite = document.getElementById(`${target}-sprite`);
    if (!sprite) return;

    sprite.classList.add(type);
    setTimeout(() => {
        sprite.classList.remove(type);
    }, 500);
}

// 卡牌打出动画
function animateCardPlay() {
    const playerSprite = document.getElementById('player-sprite');
    if (playerSprite) {
        playerSprite.classList.add('attacking');
        setTimeout(() => {
            playerSprite.classList.remove('attacking');
        }, 500);
    }
}

// 检查进化触发条件
function checkEvolutionTrigger(triggerType, value) {
    const pokemon = GameState.player.pokemon;
    if (!pokemon || !pokemon.evolution) return;

    // 更新进化进度
    pokemon.evolutionProgress = (pokemon.evolutionProgress || 0) + value;

    // 检查是否达到进化条件
    if (canEvolve(pokemon, triggerType, value)) {
        // 延迟触发进化提示
        setTimeout(() => {
            triggerEvolution();
        }, 500);
    } else {
        // 显示进化进度
        const progress = Math.floor((pokemon.evolutionProgress / pokemon.evolution.threshold) * 100);
        if (progress > 0 && progress < 100) {
            console.log(`进化进度: ${progress}%`);
        }
    }
}

// 触发进化
function triggerEvolution() {
    const currentPokemon = GameState.player.pokemon;
    if (!currentPokemon || !currentPokemon.evolution) return;

    const newPokemon = evolvePokemon(currentPokemon);
    if (!newPokemon) return;

    // 显示进化动画
    showMessage(`${currentPokemon.name} 正在进化!`);

    setTimeout(() => {
        // 更新玩家宝可梦
        GameState.player.pokemon = newPokemon;
        
        // 更新HP上限
        const hpDiff = newPokemon.maxHp - currentPokemon.maxHp;
        GameState.player.maxHp += hpDiff;
        GameState.player.hp = Math.min(GameState.player.hp + hpDiff, GameState.player.maxHp);

        // 添加进化后的技能卡牌
        if (newPokemon.skills && newPokemon.skills.length > 0) {
            const skillCard = createSkillCard(newPokemon.skills[0], newPokemon);
            if (skillCard) {
                GameState.player.deck.push(skillCard);
                showMessage(`${newPokemon.name} 学会了 ${skillCard.name}!`);
            }
        }

        // 播放进化效果
        animateEvolution();

        // 更新UI
        updateBattleUI();

        showMessage(`恭喜! ${currentPokemon.name} 进化成了 ${newPokemon.name}!`);
    }, 1000);
}

// 进化动画
function animateEvolution() {
    const playerSprite = document.getElementById('player-sprite');
    if (!playerSprite) return;

    // 添加闪光效果
    playerSprite.style.animation = 'evolution 1s ease';
    
    setTimeout(() => {
        playerSprite.style.animation = '';
    }, 1000);
}

// ====== 能力提升系统 ======
const STAT_STAGES = {
    attack: { name: '物攻', multiplier: [1, 1.5, 2, 2.5, 3, 3.5, 4] },
    defense: { name: '物防', multiplier: [1, 1.5, 2, 2.5, 3, 3.5, 4] },
    spAttack: { name: '特攻', multiplier: [1, 1.5, 2, 2.5, 3, 3.5, 4] },
    spDefense: { name: '特防', multiplier: [1, 1.5, 2, 2.5, 3, 3.5, 4] },
    speed: { name: '速度', multiplier: [1, 1.5, 2, 2.5, 3, 3.5, 4] },
    critRate: { name: '暴击率', bonus: [0, 0.0625, 0.125, 0.25, 0.375, 0.5, 0.625] },
    evasion: { name: '闪避率', bonus: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }
};

// 初始化能力等级
function initStatStages() {
    if (!GameState.player.statStages) {
        GameState.player.statStages = {
            attack: 0, defense: 0, spAttack: 0, spDefense: 0,
            speed: 0, critRate: 0, evasion: 0
        };
    }
    if (!GameState.battle.enemy.statStages) {
        GameState.battle.enemy.statStages = {
            attack: 0, defense: 0, spAttack: 0, spDefense: 0,
            speed: 0, critRate: 0, evasion: 0
        };
    }
}

// 应用能力提升
function applyStatBoost(stat, stages, target = 'player') {
    initStatStages();
    
    const targetStats = target === 'player' ? GameState.player.statStages : GameState.battle.enemy.statStages;
    const oldValue = targetStats[stat] || 0;
    targetStats[stat] = Math.min(6, (targetStats[stat] || 0) + stages);
    
    const statName = STAT_STAGES[stat] ? STAT_STAGES[stat].name : stat;
    const newValue = targetStats[stat];
    
    if (newValue > oldValue) {
        showMessage(`${statName}提升${stages}级！(${oldValue}→${newValue})`);
    }
    
    updateBattleUI();
}

// 应用能力下降
function applyStatDrop(stat, stages, target = 'enemy') {
    initStatStages();
    
    const targetStats = target === 'player' ? GameState.player.statStages : GameState.battle.enemy.statStages;
    const oldValue = targetStats[stat] || 0;
    targetStats[stat] = Math.max(-6, (targetStats[stat] || 0) - stages);
    
    const statName = STAT_STAGES[stat] ? STAT_STAGES[stat].name : stat;
    const newValue = targetStats[stat];
    
    if (newValue < oldValue) {
        showMessage(`${target === 'player' ? '你的' : '敌人的'}${statName}下降${stages}级！`);
    }
    
    updateBattleUI();
}

// 获取能力倍率
function getStatMultiplier(stat, target = 'player') {
    initStatStages();
    
    const targetStats = target === 'player' ? GameState.player.statStages : GameState.battle.enemy.statStages;
    const stage = targetStats[stat] || 0;
    
    if (stage >= 0) {
        return STAT_STAGES[stat].multiplier[Math.min(6, stage)];
    } else {
        // 负数等级：倍率降低
        return 1 / STAT_STAGES[stat].multiplier[Math.min(6, -stage)];
    }
}

// 获取暴击率加成
function getCritRateBonus(target = 'player') {
    initStatStages();
    
    const targetStats = target === 'player' ? GameState.player.statStages : GameState.battle.enemy.statStages;
    const stage = Math.max(0, targetStats.critRate || 0);
    
    return STAT_STAGES.critRate.bonus[Math.min(6, stage)];
}

// 获取闪避率加成
function getEvasionBonus(target = 'player') {
    initStatStages();
    
    const targetStats = target === 'player' ? GameState.player.statStages : GameState.battle.enemy.statStages;
    const stage = Math.max(0, targetStats.evasion || 0);
    
    return STAT_STAGES.evasion.bonus[Math.min(6, stage)];
}

// 执行伤害计算（提取为单独函数以支持连击）
function executeDamageCalculation(effect, card) {
    let damage = effect.value;
    
    // 应用能力等级加成
    if (effect.skillType === 'physical' || !effect.skillType) {
        damage = Math.floor(damage * getStatMultiplier('attack', 'player'));
    } else if (effect.skillType === 'special') {
        damage = Math.floor(damage * getStatMultiplier('spAttack', 'player'));
    }
    
    // 应用伤害加成
    if (GameState.player.damageBonus > 0) {
        damage += GameState.player.damageBonus;
    }
    
    // 宝可梦属性加成
    const activePokemon = GameState.player.activePokemon;
    if (activePokemon) {
        const skillType = effect.skillType || 'physical';
        if (skillType === 'physical') {
            const attackStat = activePokemon.attack || 50;
            damage = Math.floor(damage * (attackStat / 50));
        } else if (skillType === 'special') {
            const spAttackStat = activePokemon.spAttack || 50;
            damage = Math.floor(damage * (spAttackStat / 50));
        }
        
        // 本系加成
        const attackType = effect.attackType || card.pokemonType;
        if (attackType && activePokemon.types && activePokemon.types.includes(attackType)) {
            damage = Math.floor(damage * 1.5);
        }
    }
    
    // 获取攻击属性（优先使用effect.attackType，否则使用card.pokemonType）
    const attackType = effect.attackType || card.pokemonType || 'normal';
    
    dealDamageToEnemy(damage, attackType, effect);
    return damage;
}
