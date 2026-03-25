/**
 * 战斗系统模块
 * 负责战斗逻辑、回合管理和伤害计算
 */

// 战斗状态标记
let playerSkipTurn = false;
let enemySkipTurn = false;

// 开始战斗
function startBattle(enemyData) {
    console.log('战斗开始! 敌人:', enemyData.name);

    // 重置跳过回合标记
    playerSkipTurn = false;
    enemySkipTurn = false;

    // 设置战斗状态
    GameState.battle.inBattle = true;
    GameState.battle.turn = 0;
    GameState.battle.energy = GameState.battle.maxEnergy;
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

    // 自动使用第一张宝可梦牌变身
    if (typeof PokemonCardSystem !== 'undefined') {
        PokemonCardSystem.autoTransformOnBattleStart();
    }

    // 显示战斗界面
    showScreen('battle-screen');

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

    // 添加到弃牌堆
    GameState.player.discardPile.push(card);

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

                dealDamageToEnemy(damage, effect.attackType || 'normal', effect);
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

            default:
                console.log('未知效果类型:', effect.type);
        }
    }

    // 动画效果
    animateCardPlay();
}

// 对敌人造成伤害
function dealDamageToEnemy(baseDamage, attackType, options = {}) {
    let damage = baseDamage;

    // 计算属性克制
    if (attackType && attackType !== 'normal' && GameState.battle.enemy.types) {
        const effectiveness = getTypeEffectiveness(attackType, GameState.battle.enemy.types);
        damage = Math.floor(damage * effectiveness);

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
    if (options.critChance && Math.random() < options.critChance) {
        damage = Math.floor(damage * 1.5);
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
}

// 对玩家造成伤害
function dealDamageToPlayer(damage) {
    // 确保伤害至少为0
    damage = Math.max(0, damage);

    let actualDamage = damage;

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

    if (actualDamage > 0) {
        GameState.player.hp -= actualDamage;
        GameState.stats.damageTaken += actualDamage;
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
    // 检查敌人是否死亡
    if (GameState.battle.enemy.currentHp <= 0) {
        endBattle(true);
        return true;
    }

    // 检查玩家是否死亡
    if (GameState.player.hp <= 0) {
        endBattle(false);
        return true;
    }

    return false;
}

// 结束战斗
function endBattle(victory) {
    console.log('=== endBattle 调用 ===');
    console.log('胜利:', victory);
    console.log('敌人:', GameState.battle.enemy ? GameState.battle.enemy.name : 'null');
    console.log('isBoss:', GameState.battle.enemy ? GameState.battle.enemy.isBoss : 'undefined');
    console.log('====================');
    
    // 战斗结束时恢复自动使用的宝可梦牌
    if (PokemonCardSystem.activePokemon) {
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
            
            // 通关当前层
            GameState.stats.floorsCleared = GameState.progress.currentFloor;

            if (GameState.progress.currentFloor >= GameState.progress.maxFloors) {
                // 游戏胜利
                console.log('游戏胜利！');
                setTimeout(() => gameVictory(), 1500);
                return;
            } else {
                // 进入下一层
                console.log('准备进入下一层...');
                GameState.progress.currentFloor++;
                GameState.progress.currentNode = null;
                GameState.progress.completedNodes = [];
                
                // 生成新地图
                console.log('生成新地图，当前层:', GameState.progress.currentFloor);
                const newMap = generateMap();
                GameState.progress.map = newMap;
                
                // 确保第一层节点可用
                if (newMap[0] && newMap[0][0]) {
                    newMap[0][0].available = true;
                    console.log('设置起点节点为可用状态');
                }

                // 恢复部分HP
                const healAmount = Math.floor(GameState.player.maxHp * 0.2);
                GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + healAmount);
                
                console.log('恢复HP:', healAmount, '当前HP:', GameState.player.hp);

                setTimeout(() => {
                    console.log('显示地图界面');
                    showScreen('map-screen');
                    renderMap();
                    updateUI();
                    showMessage(`进入第 ${GameState.progress.currentFloor} 层! 恢复 ${healAmount} HP`);
                }, 1500);
                return;
            }
        }

        // 检查是否是精英
        if (enemy.isElite) {
            // 精英战后可能获得更好的奖励
            setTimeout(() => {
                showRewardScreen(true);
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
