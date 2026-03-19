/**
 * 战斗系统模块
 * 负责战斗逻辑、回合管理和伤害计算
 */

// 开始战斗
function startBattle(enemyData) {
    console.log('战斗开始! 敌人:', enemyData.name);

    // 设置战斗状态
    GameState.battle.inBattle = true;
    GameState.battle.turn = 0;
    GameState.battle.energy = GameState.battle.maxEnergy;
    GameState.battle.enemy = {
        ...enemyData,
        currentHp: enemyData.hp,
        shield: 0,
        statusEffects: [],
        nextMove: null
    };

    // 重置牌组
    GameState.player.drawPile = shuffleDeck([...GameState.player.deck]);
    GameState.player.hand = [];
    GameState.player.discardPile = [];
    GameState.player.shield = 0;

    // 显示战斗界面
    showScreen('battle-screen');

    // 开始第一回合
    startTurn();
}

// 开始回合
function startTurn() {
    GameState.battle.turn++;
    GameState.battle.energy = GameState.battle.maxEnergy;

    // 处理玩家状态效果
    processStatusEffects(GameState.player, 'turnStart');

    // 处理敌人状态效果
    processStatusEffects(GameState.battle.enemy, 'turnStart');

    // 抽牌
    drawCards(5);

    // 决定敌人下一步行动
    determineEnemyMove();

    updateUI();
    updateBattleUI();
}

// 结束回合
function endTurn() {
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

    // 敌人行动
    executeEnemyMove();

    // 检查战斗是否结束
    if (checkBattleEnd()) {
        return;
    }

    // 开始新回合
    startTurn();
}

// 打出卡牌
function playCard(cardIndex) {
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
                dealDamageToEnemy(effect.value, effect.attackType || 'normal', effect);
                break;

            case 'block':
                GameState.player.shield += effect.value;
                showDamageNumber(effect.value, 'heal', 'player');
                break;

            case 'heal':
                healPlayer(effect.value);
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
                break;

            case 'selfDamage':
                dealDamageToPlayer(effect.value);
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
    if (attackType && GameState.battle.enemy.types) {
        const effectiveness = getTypeEffectiveness(attackType, GameState.battle.enemy.types);
        damage = Math.floor(damage * effectiveness);

        if (effectiveness > 1) {
            showMessage('效果拔群!');
        } else if (effectiveness < 1 && effectiveness > 0) {
            showMessage('效果不太好...');
        } else if (effectiveness === 0) {
            showMessage('没有效果!');
            return;
        }
    }

    // 应用角色被动
    if (GameState.character && GameState.character.passive) {
        if (GameState.character.passive.name === '进攻意识') {
            damage += 1;
        }
    }

    // 暴击检查
    if (options.critChance && Math.random() < options.critChance) {
        damage = Math.floor(damage * 1.5);
        showMessage('暴击!');
    }

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
}

// 对玩家造成伤害
function dealDamageToPlayer(damage) {
    let actualDamage = damage;

    // 计算护盾
    if (GameState.player.shield > 0) {
        if (GameState.player.shield >= damage) {
            GameState.player.shield -= damage;
            actualDamage = 0;
        } else {
            actualDamage = damage - GameState.player.shield;
            GameState.player.shield = 0;
        }
    }

    if (actualDamage > 0) {
        GameState.player.hp -= actualDamage;
        GameState.stats.damageTaken += actualDamage;
        animateSprite('player', 'hurt');
    }

    showDamageNumber(actualDamage, 'damage', 'player');
}

// 治疗玩家
function healPlayer(amount) {
    const healAmount = Math.min(amount, GameState.player.maxHp - GameState.player.hp);
    GameState.player.hp += healAmount;
    showDamageNumber(healAmount, 'heal', 'player');
}

// 应用状态效果
function applyStatus(target, statusName, duration) {
    const statusDef = STATUS_EFFECTS[statusName];
    if (!statusDef) return;

    const existing = target.statusEffects.find(s => s.name === statusName);

    if (existing) {
        // 刷新持续时间
        existing.duration = Math.max(existing.duration, duration || statusDef.duration);
        existing.stacks = (existing.stacks || 1) + 1;
    } else {
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
    if (!target.statusEffects) return;

    for (let i = target.statusEffects.length - 1; i >= 0; i--) {
        const status = target.statusEffects[i];
        const statusDef = STATUS_EFFECTS[status.name];

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
                    if (Math.random() < statusDef.wakeChance) {
                        target.statusEffects.splice(i, 1);
                        showMessage(`${target === GameState.player ? '你' : '敌人'}醒来了!`);
                    }
                    return 'skip';

                case 'freeze':
                    if (Math.random() < statusDef.thawChance) {
                        target.statusEffects.splice(i, 1);
                        showMessage(`${target === GameState.player ? '你' : '敌人'}解冻了!`);
                    } else {
                        return 'skip';
                    }
                    break;
            }
        }

        // 减少持续时间
        status.duration--;
        if (status.duration <= 0) {
            target.statusEffects.splice(i, 1);
        }
    }

    return null;
}

// 决定敌人下一步行动
function determineEnemyMove() {
    const enemy = GameState.battle.enemy;
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

            // 多段攻击
            const hits = move.hits || 1;
            for (let i = 0; i < hits; i++) {
                dealDamageToPlayer(damage);

                // 状态效果
                if (move.effect === 'poison') {
                    applyStatus(GameState.player, 'poison');
                } else if (move.effect === 'burn') {
                    applyStatus(GameState.player, 'burn');
                }
            }
            break;

        case 'defend':
            enemy.shield += move.block || 0;
            break;

        case 'buff':
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
    GameState.battle.inBattle = false;

    if (victory) {
        const enemy = GameState.battle.enemy;
        const goldReward = getRandomGold(enemy.goldReward[0], enemy.goldReward[1]);

        GameState.player.gold += goldReward;
        GameState.stats.enemiesDefeated++;

        showMessage(`战斗胜利! 获得 ${goldReward} 金币!`);

        // 检查是否是Boss
        if (enemy.isBoss) {
            // 通关当前层
            GameState.stats.floorsCleared = GameState.progress.currentFloor;

            if (GameState.progress.currentFloor >= GameState.progress.maxFloors) {
                // 游戏胜利
                setTimeout(() => gameVictory(), 1500);
                return;
            } else {
                // 进入下一层
                GameState.progress.currentFloor++;
                GameState.progress.map = generateMap();
                setTimeout(() => {
                    showScreen('map-screen');
                    renderMap();
                    updateUI();
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
        number.remove();
    }, 1000);
}

// 显示消息
function showMessage(text) {
    // 简单的消息提示，可以后续改进为更漂亮的UI
    console.log('[消息]', text);

    // 创建临时消息元素
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1.2rem;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
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
