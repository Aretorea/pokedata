/**
 * UI控制模块
 * 负责界面更新、渲染和用户交互
 */

// 更新主UI
function updateUI() {
    // 更新玩家状态
    const hpEl = document.getElementById('player-hp');
    const maxHpEl = document.getElementById('player-max-hp');
    const goldEl = document.getElementById('player-gold');
    const floorEl = document.getElementById('current-floor');
    const deckCountEl = document.getElementById('deck-count');

    if (hpEl) hpEl.textContent = Math.max(0, GameState.player.hp);
    if (maxHpEl) maxHpEl.textContent = GameState.player.maxHp;
    if (goldEl) goldEl.textContent = GameState.player.gold;
    if (floorEl) floorEl.textContent = GameState.progress.currentFloor;
    if (deckCountEl) deckCountEl.textContent = GameState.player.deck.length;
}

// 更新战斗UI
function updateBattleUI() {
    const enemy = GameState.battle.enemy;
    const player = GameState.player;

    if (!enemy) return;

    // 敌人信息
    const enemyNameEl = document.getElementById('enemy-name');
    if (enemyNameEl) {
        enemyNameEl.textContent = enemy.name;
    }

    // 敌人HP条
    const enemyHpPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.hp) * 100));
    const enemyHpBar = document.getElementById('enemy-hp-bar');
    const enemyHpText = document.getElementById('enemy-hp-text');

    if (enemyHpBar) {
        enemyHpBar.style.width = `${enemyHpPercent}%`;
    }
    if (enemyHpText) {
        enemyHpText.textContent = `HP: ${Math.max(0, enemy.currentHp)}/${enemy.hp}`;
    }

    // 敌人精灵
    const enemySprite = document.getElementById('enemy-sprite');
    if (enemySprite) {
        enemySprite.textContent = enemy.sprite || '👾';
    }

    // 敌人状态
    renderStatusEffects('enemy-status', enemy.statusEffects);

    // 敌人意图显示
    if (enemy.nextMove) {
        const intentText = getIntentText(enemy.nextMove);
        if (enemyNameEl) {
            enemyNameEl.title = intentText;
        }
        // 显示意图图标
        renderEnemyIntent(enemy.nextMove);
    } else {
        renderEnemyIntent(null);
    }

    // 玩家信息
    const playerNameEl = document.getElementById('player-pokemon-name');
    if (playerNameEl) {
        playerNameEl.textContent = player.pokemon ? player.pokemon.name :
            (GameState.character ? GameState.character.name : '训练家');
    }

    // 玩家HP条
    const playerHpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    const playerHpBar = document.getElementById('player-hp-bar');
    const playerHpText = document.getElementById('player-hp-text');

    if (playerHpBar) {
        playerHpBar.style.width = `${playerHpPercent}%`;
        // 低血量警告
        if (playerHpPercent < 30) {
            playerHpBar.classList.add('low');
        } else {
            playerHpBar.classList.remove('low');
        }
    }

    if (playerHpText) {
        playerHpText.textContent = `HP: ${player.hp}/${player.maxHp}`;
    }

    // 能量显示
    const currentEnergyEl = document.getElementById('current-energy');
    const maxEnergyEl = document.getElementById('max-energy');
    if (currentEnergyEl) currentEnergyEl.textContent = GameState.battle.energy;
    if (maxEnergyEl) maxEnergyEl.textContent = GameState.battle.maxEnergy;

    // 玩家精灵
    const playerSprite = document.getElementById('player-sprite');
    if (playerSprite) {
        playerSprite.textContent = GameState.character ? GameState.character.sprite : '👤';
    }

    // 玩家状态
    renderStatusEffects('player-status', player.statusEffects);

    // 护盾显示（单独处理，不与状态效果混合）
    renderShieldDisplay();

    // 渲染手牌
    renderHand();

    // 更新结束回合按钮状态
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
        endTurnBtn.disabled = !GameState.battle.inBattle;
    }
}

// 渲染敌人意图
function renderEnemyIntent(move) {
    const intentContainer = document.getElementById('enemy-intent');
    if (!intentContainer) return;

    if (!move) {
        intentContainer.innerHTML = '';
        return;
    }

    let icon = '';
    let text = '';

    switch (move.intent) {
        case 'attack':
            icon = '⚔️';
            const hits = move.hits || 1;
            const totalDamage = (move.damage || 0) * hits;
            text = `${totalDamage}`;
            if (hits > 1) text += ` (x${hits})`;
            break;
        case 'defend':
            icon = '🛡️';
            text = `+${move.block || 0}`;
            break;
        case 'buff':
            icon = '⬆️';
            text = '强化';
            break;
        case 'debuff':
            icon = '⬇️';
            text = '削弱';
            break;
        default:
            icon = '❓';
            text = '未知';
    }

    intentContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 5px;">
            <span style="font-size: 1.5rem;">${icon}</span>
            <span style="color: ${move.intent === 'attack' ? '#ff6b6b' : '#fff'};">${text}</span>
        </div>
    `;
}

// 渲染护盾显示（独立于状态效果）
function renderShieldDisplay() {
    // 玩家护盾
    const playerShieldContainer = document.getElementById('player-shield-display');
    if (playerShieldContainer) {
        if (GameState.player.shield > 0) {
            playerShieldContainer.innerHTML = `<span class="shield-badge">🛡️ ${GameState.player.shield}</span>`;
        } else {
            playerShieldContainer.innerHTML = '';
        }
    }

    // 敌人护盾
    const enemy = GameState.battle.enemy;
    const enemyShieldContainer = document.getElementById('enemy-shield-display');
    if (enemyShieldContainer && enemy) {
        if (enemy.shield > 0) {
            enemyShieldContainer.innerHTML = `<span class="shield-badge">🛡️ ${enemy.shield}</span>`;
        } else {
            enemyShieldContainer.innerHTML = '';
        }
    }
}

// 渲染状态效果
function renderStatusEffects(containerId, statusEffects) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!statusEffects || statusEffects.length === 0) return;

    for (const status of statusEffects) {
        const statusDef = STATUS_EFFECTS ? STATUS_EFFECTS[status.name] : null;
        const badge = document.createElement('div');
        badge.className = `status-badge status-${status.name}`;
        badge.textContent = statusDef ? `${statusDef.name}` : status.name;

        if (status.stacks > 1) {
            badge.textContent += ` x${status.stacks}`;
        }

        // 显示剩余回合数
        if (status.duration) {
            badge.title = `剩余 ${status.duration} 回合`;
        }

        container.appendChild(badge);
    }
}

// 渲染手牌
function renderHand() {
    const container = document.getElementById('hand-cards');
    if (!container) return;

    container.innerHTML = '';

    const hand = GameState.player.hand;

    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const cardDiv = createCardElement(card, i);

        // 检查是否可以打出
        if (card.cost > GameState.battle.energy) {
            cardDiv.style.opacity = '0.6';
        }

        container.appendChild(cardDiv);
    }
}

// 创建卡牌元素
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.rarity || 'common'}`;

    if (card.pokemonType) {
        cardDiv.classList.add('pokemon-card');
    }

    let typeHtml = '';
    if (card.pokemonType) {
        typeHtml = `<div class="card-types"><span class="type-badge type-${card.pokemonType}">${getTypeName(card.pokemonType)}</span></div>`;
    }

    cardDiv.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-name">${card.name}</div>
        ${typeHtml}
        <div class="card-type">${CARD_TYPES ? CARD_TYPES[card.type] : card.type}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-rarity">${CARD_RARITY ? CARD_RARITY[card.rarity] || '' : ''}</div>
    `;

    // 点击事件
    cardDiv.addEventListener('click', () => {
        if (GameState.battle.inBattle) {
            playCard(index);
        }
    });

    return cardDiv;
}

// 获取类型名称
function getTypeName(type) {
    const typeNames = {
        fire: '火',
        water: '水',
        grass: '草',
        electric: '电',
        psychic: '超能',
        fighting: '格斗',
        dark: '恶',
        steel: '钢',
        fairy: '妖精',
        dragon: '龙',
        ice: '冰',
        rock: '岩石',
        ground: '地面',
        poison: '毒',
        bug: '虫',
        ghost: '幽灵',
        normal: '普通',
        flying: '飞行'
    };
    return typeNames[type] || type;
}

// 获取意图文本
function getIntentText(move) {
    if (!move) return '';

    switch (move.intent) {
        case 'attack':
            const hits = move.hits || 1;
            const totalDamage = (move.damage || 0) * hits;
            return `即将攻击 (${totalDamage}伤害${hits > 1 ? ', ' + hits + '次' : ''})`;
        case 'defend':
            return `即将防御 (+${move.block || 0}护盾)`;
        case 'buff':
            return '即将强化';
        case 'debuff':
            return '即将削弱你';
        default:
            return '未知意图';
    }
}

// 渲染角色选择
function renderCharacterSelect() {
    const container = document.getElementById('character-cards');
    if (!container) return;

    container.innerHTML = '';

    const characters = getStarterCharacters ? getStarterCharacters() : [];

    // 如果没有角色数据，使用默认角色
    if (characters.length === 0) {
        characters.push({
            id: 'trainer-red',
            name: '赤红',
            description: '来自真新镇的训练家，擅长全面培养宝可梦。',
            sprite: '🔴',
            startingHp: 80,
            startingGold: 99,
            passive: { name: '宝可梦大师', description: '所有宝可梦技能伤害 +10%' }
        });
    }

    for (const char of characters) {
        const charDiv = document.createElement('div');
        charDiv.className = 'card pokemon-card';
        charDiv.style.cursor = 'pointer';

        charDiv.innerHTML = `
            <div class="card-image" style="font-size: 4rem;">${char.sprite || '👤'}</div>
            <div class="card-name">${char.name}</div>
            <div class="card-description">${char.description}</div>
            <div class="card-rarity">
                <p><strong>HP:</strong> ${char.startingHp}</p>
                <p><strong>金币:</strong> ${char.startingGold}</p>
            </div>
            <div class="card-description" style="margin-top: 10px;">
                <strong>${char.passive ? char.passive.name : ''}</strong><br>
                ${char.passive ? char.passive.description : ''}
            </div>
        `;

        charDiv.addEventListener('click', () => {
            selectCharacter(char.id);
        });

        container.appendChild(charDiv);
    }

    // 添加宝可梦选择
    const pokemonHeader = document.createElement('h3');
    pokemonHeader.textContent = '选择初始宝可梦';
    pokemonHeader.style.marginTop = '30px';
    pokemonHeader.style.width = '100%';
    pokemonHeader.style.textAlign = 'center';
    pokemonHeader.style.color = '#ffcb05';
    container.appendChild(pokemonHeader);

    const starters = POKEMON_DATA ? POKEMON_DATA.starters : [];
    for (const pokemon of starters) {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'card pokemon-card';
        pokemonDiv.style.cursor = 'pointer';

        const typesHtml = pokemon.types ? pokemon.types.map(t =>
            `<span class="type-badge type-${t}">${getTypeName(t)}</span>`
        ).join('') : '';

        pokemonDiv.innerHTML = `
            <div class="card-image" style="font-size: 3rem;">${pokemon.sprite || '❓'}</div>
            <div class="card-name">${pokemon.name}</div>
            <div class="card-types">${typesHtml}</div>
            <div class="card-rarity">
                <p><strong>HP:</strong> ${pokemon.hp}</p>
            </div>
            <div class="card-description">
                ${pokemon.skills ? pokemon.skills.map(s => `<p>${s.name}: ${s.damage ? s.damage + '伤害' : (s.block ? s.block + '护盾' : '')}</p>`).join('') : ''}
            </div>
        `;

        pokemonDiv.addEventListener('click', () => {
            selectStarterPokemon(pokemon);
        });

        container.appendChild(pokemonDiv);
    }
}

// 选择角色
function selectCharacter(characterId) {
    startNewGame(characterId);
}

// 选择初始宝可梦
function selectStarterPokemon(pokemon) {
    GameState.player.pokemon = { ...pokemon };
    showMessage(`选择了 ${pokemon.name}!`);

    // 初始化宝可梦牌组
    if (!GameState.player.pokemonCards) {
        GameState.player.pokemonCards = [];
    }

    // 将宝可梦添加为变身牌
    if (typeof PokemonCardSystem !== 'undefined') {
        const pokemonCard = PokemonCardSystem.createPokemonCard(pokemon);
        if (pokemonCard) {
            // 添加到宝可梦牌组
            GameState.player.pokemonCards.push(pokemonCard);
            // 保存到临时位置，startNewGame后再添加到主牌组
            GameState.player.starterPokemonCard = pokemonCard;
        }
    }

    // 继续游戏流程
    setTimeout(() => {
        startNewGame('trainer-red');
    }, 500);
}

// 创建技能卡牌
function createSkillCard(skill, pokemon) {
    if (!skill) return null;

    const card = {
        id: `${pokemon.id}-${skill.name}`,
        name: skill.name,
        type: skill.damage ? 'attack' : (skill.block ? 'defense' : 'skill'),
        cost: skill.energy || 1,
        rarity: 'common',
        pokemonType: skill.type || pokemon.types[0],
        description: '',
        effects: []
    };

    if (skill.damage) {
        card.description = `造成 ${skill.damage} 点伤害。`;
        card.effects.push({ type: 'damage', value: skill.damage, attackType: skill.type });
        if (skill.effect === 'burn') {
            card.description += ' 使敌人灼伤。';
            card.effects.push({ type: 'applyStatus', status: 'burn' });
        } else if (skill.effect === 'paralysis') {
            card.description += ' 有概率使敌人麻痹。';
            card.effects.push({ type: 'applyStatus', status: 'paralysis', chance: 0.3 });
        }
    }

    if (skill.block) {
        card.description = `获得 ${skill.block} 点护盾。`;
        card.effects.push({ type: 'block', value: skill.block });
    }

    return card;
}

// 显示牌组查看
function showDeckView() {
    showScreen('deck-view-screen');

    const container = document.getElementById('deck-cards');
    if (!container) return;

    container.innerHTML = '';

    const deck = GameState.player.deck;

    if (deck.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">牌组为空</p>';
        return;
    }

    for (const card of deck) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity || 'common'}`;

        cardDiv.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${CARD_TYPES ? CARD_TYPES[card.type] : card.type}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-rarity">${CARD_RARITY ? CARD_RARITY[card.rarity] || '' : ''}</div>
        `;

        container.appendChild(cardDiv);
    }
}

// 显示确认对话框
function showConfirmDialog(title, message, onConfirm, onCancel) {
    // 移除现有对话框
    const existingDialog = document.querySelector('.confirm-dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    // 创建对话框
    const overlay = document.createElement('div');
    overlay.className = 'confirm-dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: linear-gradient(145deg, #2a2a4a 0%, #1a1a3a 100%);
        border: 2px solid #3d7dca;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        text-align: center;
    `;

    dialog.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #ffcb05;">${title}</h3>
        <p style="margin-bottom: 20px; color: #ccc;">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirm-yes" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">确认</button>
            <button id="confirm-no" style="padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.getElementById('confirm-yes').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });
}

// 初始化UI
function initUI() {
    console.log('UI 初始化完成');
}
