/**
 * UI控制模块
 * 负责界面更新、渲染和用户交互
 */

// 更新主UI
function updateUI() {
    // 更新玩家状态
    document.getElementById('player-hp').textContent = GameState.player.hp;
    document.getElementById('player-max-hp').textContent = GameState.player.maxHp;
    document.getElementById('player-gold').textContent = GameState.player.gold;
    document.getElementById('current-floor').textContent = GameState.progress.currentFloor;
    document.getElementById('deck-count').textContent = GameState.player.deck.length;
}

// 更新战斗UI
function updateBattleUI() {
    const enemy = GameState.battle.enemy;
    const player = GameState.player;

    // 敌人信息
    document.getElementById('enemy-name').textContent = enemy.name;

    const enemyHpPercent = Math.max(0, (enemy.currentHp / enemy.hp) * 100);
    document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
    document.getElementById('enemy-hp-text').textContent = `HP: ${Math.max(0, enemy.currentHp)}/${enemy.hp}`;

    // 敌人精灵
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.textContent = enemy.sprite;

    // 敌人状态
    renderStatusEffects('enemy-status', enemy.statusEffects);

    // 敌人意图显示
    if (enemy.nextMove) {
        const intentText = getIntentText(enemy.nextMove);
        document.getElementById('enemy-name').title = intentText;
    }

    // 玩家信息
    document.getElementById('player-pokemon-name').textContent =
        player.pokemon ? player.pokemon.name : (GameState.character ? GameState.character.name : '训练家');

    const playerHpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    const playerHpBar = document.getElementById('player-hp-bar');
    playerHpBar.style.width = `${playerHpPercent}%`;

    // 低血量警告
    if (playerHpPercent < 30) {
        playerHpBar.classList.add('low');
    } else {
        playerHpBar.classList.remove('low');
    }

    document.getElementById('player-hp-text').textContent = `HP: ${player.hp}/${player.maxHp}`;

    // 能量显示
    document.getElementById('current-energy').textContent = GameState.battle.energy;
    document.getElementById('max-energy').textContent = GameState.battle.maxEnergy;

    // 玩家精灵
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.textContent = GameState.character ? GameState.character.sprite : '👤';

    // 玩家状态
    renderStatusEffects('player-status', player.statusEffects);

    // 渲染手牌
    renderHand();

    // 护盾显示
    if (player.shield > 0) {
        renderStatusEffects('player-status', [{ name: 'shield', stacks: player.shield }]);
    }
    if (enemy.shield > 0) {
        renderStatusEffects('enemy-status', [{ name: 'shield', stacks: enemy.shield }]);
    }
}

// 渲染状态效果
function renderStatusEffects(containerId, statusEffects) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 保留护盾显示，清除其他状态
    const shieldBadge = container.querySelector('.status-shield');

    container.innerHTML = '';

    if (shieldBadge) {
        container.appendChild(shieldBadge);
    }

    if (!statusEffects || statusEffects.length === 0) return;

    for (const status of statusEffects) {
        const statusDef = STATUS_EFFECTS[status.name];
        const badge = document.createElement('div');
        badge.className = `status-badge status-${status.name}`;
        badge.textContent = statusDef ? `${statusDef.name}` : status.name;

        if (status.stacks > 1) {
            badge.textContent += ` x${status.stacks}`;
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
        <div class="card-type">${CARD_TYPES[card.type]}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-rarity">${CARD_RARITY[card.rarity] || ''}</div>
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
    switch (move.intent) {
        case 'attack':
            return `即将攻击 (${move.damage || 0}伤害)`;
        case 'defend':
            return `即将防御 (+${move.block || 0}护盾)`;
        case 'buff':
            return `即将强化`;
        case 'debuff':
            return `即将削弱你`;
        default:
            return '未知意图';
    }
}

// 渲染角色选择
function renderCharacterSelect() {
    const container = document.getElementById('character-cards');
    if (!container) return;

    container.innerHTML = '';

    const characters = getStarterCharacters();

    for (const char of characters) {
        const charDiv = document.createElement('div');
        charDiv.className = 'card pokemon-card';

        charDiv.innerHTML = `
            <div class="card-image" style="font-size: 4rem;">${char.sprite}</div>
            <div class="card-name">${char.name}</div>
            <div class="card-description">${char.description}</div>
            <div class="card-rarity">
                <p><strong>HP:</strong> ${char.startingHp}</p>
                <p><strong>金币:</strong> ${char.startingGold}</p>
            </div>
            <div class="card-description" style="margin-top: 10px;">
                <strong>${char.passive.name}</strong><br>
                ${char.passive.description}
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
    container.appendChild(pokemonHeader);

    for (const pokemon of POKEMON_DATA.starters) {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'card pokemon-card';

        const typesHtml = pokemon.types.map(t =>
            `<span class="type-badge type-${t}">${getTypeName(t)}</span>`
        ).join('');

        pokemonDiv.innerHTML = `
            <div class="card-image" style="font-size: 3rem;">${pokemon.sprite}</div>
            <div class="card-name">${pokemon.name}</div>
            <div class="card-types">${typesHtml}</div>
            <div class="card-rarity">
                <p><strong>HP:</strong> ${pokemon.hp}</p>
            </div>
            <div class="card-description">
                ${pokemon.skills.map(s => `<p>${s.name}: ${s.damage ? s.damage + '伤害' : s.block + '护盾'}</p>`).join('')}
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
    // 这里可以添加角色选择逻辑
    // 目前直接开始游戏
    startNewGame(characterId);
}

// 选择初始宝可梦
function selectStarterPokemon(pokemon) {
    GameState.player.pokemon = { ...pokemon };
    showMessage(`选择了 ${pokemon.name}!`);

    // 继续游戏流程
    setTimeout(() => {
        startNewGame('trainer-red');
    }, 500);
}

// 显示牌组查看
function showDeckView() {
    showScreen('deck-view-screen');

    const container = document.getElementById('deck-cards');
    if (!container) return;

    container.innerHTML = '';

    const deck = GameState.player.deck;

    for (const card of deck) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity || 'common'}`;

        cardDiv.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${CARD_TYPES[card.type]}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-rarity">${CARD_RARITY[card.rarity] || ''}</div>
        `;

        container.appendChild(cardDiv);
    }
}

// 显示确认对话框
function showConfirmDialog(title, message, onConfirm, onCancel) {
    const result = confirm(`${title}\n\n${message}`);
    if (result && onConfirm) {
        onConfirm();
    } else if (!result && onCancel) {
        onCancel();
    }
}

// 初始化UI
function initUI() {
    console.log('UI 初始化完成');
}
