/**
 * UI控制模块
 * 负责界面更新、渲染和用户交互
 */

// ====== 图片资源 ======
// 使用emoji作为训练家主要显示，更可靠
const TRAINER_IMAGES = {
    'trainer-red': null,    // 使用emoji 🔴
    'trainer-blue': null,   // 使用emoji 🟢
    'trainer-misty': null,  // 使用emoji 🔵
    'trainer-brock': null,  // 使用emoji 🟤
    'trainer-lance': null,  // 使用emoji 🐉
    'trainer-steven': null  // 使用emoji 💎
};

// 宝可梦图片缓存
const POKEMON_IMAGE_CACHE = {};

// 获取训练家图片URL
function getTrainerImageUrl(trainerId) {
    return TRAINER_IMAGES[trainerId] || null;
}

// 获取宝可梦图片URL
function getPokemonImageUrl(pokemonId, animated = false) {
    const id = typeof pokemonId === 'string' ? pokemonId.toLowerCase() : pokemonId;
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    
    // 处理特殊形态
    const formMapping = {
        'charizard-mega-x': 'mega-x/6',
        'charizard-mega-y': 'mega-y/6',
        'mewtwo-mega-x': 'mega-x/150',
        'mewtwo-mega-y': 'mega-y/150'
    };
    
    if (formMapping[id]) {
        return `${baseUrl}${formMapping[id]}.png`;
    }
    
    // 获取宝可梦编号
    const pokemonNumber = getPokemonNumber(id);
    if (pokemonNumber) {
        if (animated) {
            return `${baseUrl}versions/generation-v/black-white/animated/${pokemonNumber}.gif`;
        }
        return `${baseUrl}${pokemonNumber}.png`;
    }
    
    return null;
}

// 获取宝可梦编号
function getPokemonNumber(pokemonId) {
    if (!pokemonId) return null;
    
    const id = typeof pokemonId === 'string' ? pokemonId.toLowerCase() : String(pokemonId);
    
    const pokemonNumbers = {
        'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
        'charmander': 4, 'charmeleon': 5, 'charizard': 6,
        'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
        'pikachu': 25, 'raichu': 26,
        'caterpie': 10, 'metapod': 11, 'butterfree': 12,
        'weedle': 13, 'kakuna': 14, 'beedrill': 15,
        'rattata': 19, 'raticate': 20,
        'spearow': 21, 'fearow': 22,
        'ekans': 23, 'arbok': 24,
        'sandshrew': 27, 'sandslash': 28,
        'nidoran-f': 29, 'nidorina': 30, 'nidoqueen': 31,
        'nidoran-m': 32, 'nidorino': 33, 'nidoking': 34,
        'clefairy': 35, 'clefable': 36,
        'vulpix': 37, 'ninetales': 38,
        'jigglypuff': 39, 'wigglytuff': 40,
        'zubat': 41, 'golbat': 42,
        'oddish': 43, 'gloom': 44, 'vileplume': 45,
        'paras': 46, 'parasect': 47,
        'venonat': 48, 'venomoth': 49,
        'diglett': 50, 'dugtrio': 51,
        'meowth': 52, 'persian': 53,
        'psyduck': 54, 'golduck': 55,
        'mankey': 56, 'primeape': 57,
        'growlithe': 58, 'arcanine': 59,
        'poliwag': 60, 'poliwhirl': 61, 'poliwrath': 62,
        'abra': 63, 'kadabra': 64, 'alakazam': 65,
        'machop': 66, 'machoke': 67, 'machamp': 68,
        'bellsprout': 69, 'weepinbell': 70, 'victreebel': 71,
        'tentacool': 72, 'tentacruel': 73,
        'geodude': 74, 'graveler': 75, 'golem': 76,
        'ponyta': 77, 'rapidash': 78,
        'slowpoke': 79, 'slowbro': 80,
        'magnemite': 81, 'magneton': 82,
        'farfetchd': 83,
        'doduo': 84, 'dodrio': 85,
        'seel': 86, 'dewgong': 87,
        'grimer': 88, 'muk': 89,
        'shellder': 90, 'cloyster': 91,
        'gastly': 92, 'haunter': 93, 'gengar': 94,
        'onix': 95,
        'drowzee': 96, 'hypno': 97,
        'krabby': 98, 'kingler': 99,
        'voltorb': 100, 'electrode': 101,
        'exeggcute': 102, 'exeggutor': 103,
        'cubone': 104, 'marowak': 105,
        'hitmonlee': 106, 'hitmonchan': 107,
        'lickitung': 108,
        'koffing': 109, 'weezing': 110,
        'rhyhorn': 111, 'rhydon': 112,
        'chansey': 113,
        'tangela': 114,
        'kangaskhan': 115,
        'horsea': 116, 'seadra': 117,
        'goldeen': 118, 'seaking': 119,
        'staryu': 120, 'starmie': 121,
        'mr-mime': 122,
        'scyther': 123,
        'jynx': 124,
        'electabuzz': 125,
        'magmar': 126,
        'pinsir': 127,
        'tauros': 128,
        'magikarp': 129, 'gyarados': 130,
        'lapras': 131,
        'ditto': 132,
        'eevee': 133, 'vaporeon': 134, 'jolteon': 135, 'flareon': 136,
        'porygon': 137,
        'omanyte': 138, 'omastar': 139,
        'kabuto': 140, 'kabutops': 141,
        'aerodactyl': 142,
        'snorlax': 143,
        'articuno': 144, 'zapdos': 145, 'moltres': 146,
        'dratini': 147, 'dragonair': 148, 'dragonite': 149,
        'mewtwo': 150, 'mew': 151
    };
    
    return pokemonNumbers[id] || null;
}

// 显示消息（全局函数，如果未定义则创建）
if (typeof showMessage === 'undefined') {
    window.showMessage = function(text) {
        console.log('[消息]', text);
        const messageEl = document.getElementById('message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.style.display = 'block';
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 2000);
        }
    };
}

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
        // 根据血量变色 - 健康>60%绿色，中等30-60%黄色，危险<30%红色
        enemyHpBar.classList.remove('healthy', 'medium', 'low', 'danger');
        if (enemyHpPercent >= 60) {
            enemyHpBar.classList.add('healthy');
        } else if (enemyHpPercent >= 30) {
            enemyHpBar.classList.add('medium');
        } else {
            enemyHpBar.classList.add('danger');
        }
    }
    if (enemyHpText) {
        enemyHpText.textContent = `HP: ${Math.max(0, enemy.currentHp)}/${enemy.hp}`;
    }

    // 敌人精灵 - 使用图片
    const enemySprite = document.getElementById('enemy-sprite');
    if (enemySprite) {
        const enemyImgUrl = getPokemonImageUrl(enemy.id);
        if (enemyImgUrl) {
            enemySprite.innerHTML = `<img src="${enemyImgUrl}" alt="${enemy.name}" class="entity-sprite-img" onerror="this.parentElement.textContent='${enemy.sprite || '👾'}'">`;
        } else {
            enemySprite.textContent = enemy.sprite || '👾';
        }
    }

    // 敌人状态 - 显示在头顶
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
        // 根据血量变色 - 健康>60%绿色，中等30-60%黄色，危险<30%红色
        playerHpBar.classList.remove('healthy', 'medium', 'low', 'danger');
        if (playerHpPercent >= 60) {
            playerHpBar.classList.add('healthy');
        } else if (playerHpPercent >= 30) {
            playerHpBar.classList.add('medium');
        } else {
            playerHpBar.classList.add('danger');
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

    // 玩家精灵 - 显示当前宝可梦
    const playerSprite = document.getElementById('player-sprite');
    if (playerSprite) {
        const activePokemon = GameState.player.activePokemon;
        if (activePokemon) {
            const pokemonImgUrl = getPokemonImageUrl(activePokemon.id);
            if (pokemonImgUrl) {
                playerSprite.innerHTML = `<img src="${pokemonImgUrl}" alt="${activePokemon.name}" class="entity-sprite-img" onerror="this.parentElement.textContent='${activePokemon.sprite || '👤'}'">`;
            } else {
                playerSprite.textContent = activePokemon.sprite || '👤';
            }
        } else {
            const trainerImgUrl = GameState.character ? getTrainerImageUrl(GameState.character.id) : null;
            if (trainerImgUrl) {
                playerSprite.innerHTML = `<img src="${trainerImgUrl}" alt="训练家" class="entity-sprite-img" onerror="this.parentElement.textContent='${GameState.character?.sprite || '👤'}'">`;
            } else {
                playerSprite.textContent = GameState.character?.sprite || '👤';
            }
        }
    }

    // 玩家状态
    renderStatusEffects('player-status', player.statusEffects);

    // 护盾显示（单独处理，不与状态效果混合）
    renderShieldDisplay();

    // 渲染手牌
    renderHand();

    // 更新牌库信息
    updateDeckPilesInfo();

    // 更新结束回合按钮状态
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
        endTurnBtn.disabled = !GameState.battle.inBattle;
    }
}

// 更新牌库堆信息
function updateDeckPilesInfo() {
    // 抽牌堆
    const drawPileCount = document.getElementById('draw-pile-count');
    if (drawPileCount) {
        drawPileCount.textContent = GameState.player.drawPile.length;
    }

    // 弃牌堆
    const discardPileCount = document.getElementById('discard-pile-count');
    if (discardPileCount) {
        discardPileCount.textContent = GameState.player.discardPile.length;
    }

    // 消耗堆
    const exhaustPileCount = document.getElementById('exhaust-pile-count');
    if (exhaustPileCount) {
        exhaustPileCount.textContent = GameState.player.exhaustPile.length;
    }

    // 已消耗道具显示
    updateConsumedItemsDisplay();
}

// 更新已消耗道具显示
function updateConsumedItemsDisplay() {
    const container = document.getElementById('consumed-items-container');
    const list = document.getElementById('consumed-items-list');
    
    if (!container || !list) return;

    // 获取消耗堆中的道具卡
    const consumedItems = GameState.player.exhaustPile.filter(c => c.type === 'item' && c.consume);

    if (consumedItems.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    for (const item of consumedItems) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'consumed-item';
        itemDiv.innerHTML = `
            <span class="item-sprite">${item.sprite || '📦'}</span>
            <span>${item.name}</span>
        `;
        list.appendChild(itemDiv);
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
    
    // 道具卡特殊样式
    if (card.type === 'item') {
        cardDiv.classList.add('item-card');
    }

    let typeHtml = '';
    if (card.pokemonType) {
        typeHtml = `<div class="card-types"><span class="type-badge type-${card.pokemonType}">${getTypeName(card.pokemonType)}</span></div>`;
    }
    
    // 确定类型显示文本
    let typeText = '';
    if (card.type === 'item') {
        typeText = '📦 道具';
    } else if (card.isPokemonCard) {
        typeText = '🧬 宝可梦';
    } else {
        const cardTypeNames = {
            'attack': '⚔️ 攻击',
            'defense': '🛡️ 防御',
            'skill': '✨ 技能',
            'energy': '⚡ 能量'
        };
        typeText = cardTypeNames[card.type] || card.type || '技能';
    }

    // 确定稀有度显示文本
    let rarityText = '';
    if (card.rarity) {
        if (typeof CARD_RARITY !== 'undefined' && CARD_RARITY[card.rarity]) {
            rarityText = CARD_RARITY[card.rarity];
        } else {
            rarityText = card.rarity;
        }
    }
    if (card.consume) {
        rarityText += ' (消耗品)';
    }

    cardDiv.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-name">${card.sprite ? card.sprite + ' ' : ''}${card.name}</div>
        ${typeHtml}
        <div class="card-type">${typeText}</div>
        <div class="card-description">${card.description || ''}</div>
        <div class="card-rarity">${rarityText}</div>
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

// 当前选择状态
let selectedCharacter = null;
let selectedPokemon = null;

// 渲染角色选择 - 第一步：选择训练家
function renderCharacterSelect() {
    selectedCharacter = null;
    selectedPokemon = null;
    
    const container = document.getElementById('character-cards');
    if (!container) return;

    container.innerHTML = '';

    // 标题
    const header = document.createElement('h3');
    header.textContent = '第一步：选择训练家';
    header.style.width = '100%';
    header.style.textAlign = 'center';
    header.style.color = '#ffcb05';
    header.style.marginBottom = '20px';
    container.appendChild(header);

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

    // 训练家卡片容器
    const trainerContainer = document.createElement('div');
    trainerContainer.style.display = 'flex';
    trainerContainer.style.flexWrap = 'wrap';
    trainerContainer.style.gap = '15px';
    trainerContainer.style.justifyContent = 'center';
    trainerContainer.style.width = '100%';

    for (const char of characters) {
        const charDiv = document.createElement('div');
        charDiv.className = 'card pokemon-card trainer-card';
        charDiv.dataset.characterId = char.id;
        charDiv.style.cursor = 'pointer';
        charDiv.style.transition = 'all 0.3s ease';

        // 训练家图片URL
        const trainerImgUrl = getTrainerImageUrl(char.id);
        const trainerImageHtml = trainerImgUrl 
            ? `<img src="${trainerImgUrl}" alt="${char.name}" class="trainer-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="card-image" style="font-size: 4rem; display: none;">${char.sprite || '👤'}</div>`
            : `<div class="card-image" style="font-size: 4rem;">${char.sprite || '👤'}</div>`;

        charDiv.innerHTML = `
            ${trainerImageHtml}
            <div class="card-name">${char.name}</div>
            <div class="card-description">${char.description}</div>
            <div class="card-rarity">
                <p><strong>❤️ HP:</strong> ${char.startingHp}</p>
                <p><strong>💰 金币:</strong> ${char.startingGold}</p>
            </div>
            <div class="card-description" style="margin-top: 10px;">
                <strong>🔵 ${char.passive ? char.passive.name : ''}</strong><br>
                ${char.passive ? char.passive.description : ''}
            </div>
            ${char.uniqueCards ? `<div class="unique-cards" style="margin-top: 8px; font-size: 12px; color: #ffd700;">✨ 专属卡牌: ${char.uniqueCards.length}张</div>` : ''}
            ${char.startingItems ? `<div class="starting-items" style="font-size: 12px; color: #4caf50;">🎒 初始道具: ${char.startingItems.length}个</div>` : ''}
        `;

        charDiv.addEventListener('click', () => {
            selectTrainer(char);
        });

        trainerContainer.appendChild(charDiv);
    }
    
    container.appendChild(trainerContainer);

    // 宝可梦选择区域（初始隐藏）
    const pokemonSection = document.createElement('div');
    pokemonSection.id = 'pokemon-select-section';
    pokemonSection.style.display = 'none';
    pokemonSection.style.width = '100%';
    pokemonSection.style.marginTop = '30px';
    
    const pokemonHeader = document.createElement('h3');
    pokemonHeader.textContent = '第二步：选择初始宝可梦';
    pokemonHeader.style.textAlign = 'center';
    pokemonHeader.style.color = '#ffcb05';
    pokemonHeader.style.marginBottom = '20px';
    pokemonSection.appendChild(pokemonHeader);
    
    const pokemonContainer = document.createElement('div');
    pokemonContainer.id = 'pokemon-cards-container';
    pokemonContainer.style.display = 'flex';
    pokemonContainer.style.flexWrap = 'wrap';
    pokemonContainer.style.gap = '15px';
    pokemonContainer.style.justifyContent = 'center';
    pokemonSection.appendChild(pokemonContainer);
    
    container.appendChild(pokemonSection);
    
    // 开始游戏按钮（初始隐藏）
    const startBtn = document.createElement('button');
    startBtn.id = 'start-with-selections-btn';
    startBtn.className = 'menu-btn';
    startBtn.textContent = '开始冒险!';
    startBtn.style.display = 'none';
    startBtn.style.marginTop = '20px';
    startBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
    
    startBtn.addEventListener('click', () => {
        if (selectedCharacter && selectedPokemon) {
            startGameWithSelections(selectedCharacter, selectedPokemon);
        }
    });
    
    container.appendChild(startBtn);
}

// 选择训练家
function selectTrainer(character) {
    selectedCharacter = character;
    
    // 高亮选中的训练家
    document.querySelectorAll('.trainer-card').forEach(card => {
        card.style.border = '2px solid transparent';
        card.style.boxShadow = 'none';
    });
    
    const selectedCard = document.querySelector(`[data-character-id="${character.id}"]`);
    if (selectedCard) {
        selectedCard.style.border = '2px solid #ffcb05';
        selectedCard.style.boxShadow = '0 0 20px rgba(255, 203, 5, 0.5)';
    }
    
    // 显示宝可梦选择区域
    const pokemonSection = document.getElementById('pokemon-select-section');
    if (pokemonSection) {
        pokemonSection.style.display = 'block';
    }
    
    // 渲染可选的宝可梦
    renderPokemonOptions(character);
    
    showMessage(`已选择训练家: ${character.name}`);
}

// 渲染宝可梦选项
function renderPokemonOptions(character) {
    const container = document.getElementById('pokemon-cards-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 获取训练家可用的宝可梦
    let starters = [];
    if (character.starterPokemon && character.starterPokemon.length > 0) {
        // 训练家专属初始宝可梦
        starters = character.starterPokemon.map(id => {
            if (typeof getPokemonById === 'function') {
                return getPokemonById(id);
            }
            return POKEMON_DATA.starters.find(p => p.id === id);
        }).filter(p => p);
    }
    
    // 如果没有专属宝可梦，使用默认列表
    if (starters.length === 0) {
        starters = POKEMON_DATA ? POKEMON_DATA.starters : [];
    }

    for (const pokemon of starters) {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'card pokemon-card pokemon-option';
        pokemonDiv.dataset.pokemonId = pokemon.id;
        pokemonDiv.style.cursor = 'pointer';
        pokemonDiv.style.transition = 'all 0.3s ease';

        const typesHtml = pokemon.types ? pokemon.types.map(t =>
            `<span class="type-badge type-${t}">${getTypeName(t)}</span>`
        ).join('') : '';

        // 获取宝可梦图片
        const pokemonImgUrl = getPokemonImageUrl(pokemon.id);
        const pokemonImageHtml = pokemonImgUrl 
            ? `<img src="${pokemonImgUrl}" alt="${pokemon.name}" class="pokemon-sprite-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="card-image" style="font-size: 3rem; display: none;">${pokemon.sprite || '❓'}</div>`
            : `<div class="card-image" style="font-size: 3rem;">${pokemon.sprite || '❓'}</div>`;

        pokemonDiv.innerHTML = `
            ${pokemonImageHtml}
            <div class="card-name">${pokemon.name}</div>
            <div class="card-types">${typesHtml}</div>
            <div class="card-rarity">
                <p><strong>❤️ HP:</strong> ${pokemon.hp}</p>
                <p><strong>⚔️ 物攻/特攻:</strong> ${pokemon.attack || 50}/${pokemon.spAttack || 50}</p>
            </div>
            <div class="card-description">
                <p style="color: #9c27b0;">⭐ 特性: ${pokemon.abilityName || '未知'}</p>
                ${pokemon.skills ? pokemon.skills.map(s => `<p>${s.name}: ${s.damage ? s.damage + '伤害' : (s.block ? s.block + '护盾' : '')}</p>`).join('') : ''}
            </div>
            ${pokemon.evolution ? `<div style="font-size: 11px; color: #ffd700;">🔄 可进化</div>` : ''}
        `;

        pokemonDiv.addEventListener('click', () => {
            selectStarterPokemonOption(pokemon);
        });

        container.appendChild(pokemonDiv);
    }
}

// 选择初始宝可梦
function selectStarterPokemonOption(pokemon) {
    selectedPokemon = pokemon;
    
    // 高亮选中的宝可梦
    document.querySelectorAll('.pokemon-option').forEach(card => {
        card.style.border = '2px solid transparent';
        card.style.boxShadow = 'none';
    });
    
    const selectedCard = document.querySelector(`[data-pokemon-id="${pokemon.id}"]`);
    if (selectedCard) {
        selectedCard.style.border = '2px solid #4caf50';
        selectedCard.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
    }
    
    // 显示开始游戏按钮
    const startBtn = document.getElementById('start-with-selections-btn');
    if (startBtn) {
        startBtn.style.display = 'block';
    }
    
    showMessage(`已选择宝可梦: ${pokemon.name}`);
}

// 使用选择的训练家和宝可梦开始游戏
function startGameWithSelections(character, pokemon) {
    // 设置角色
    GameState.character = character;

    // 初始化玩家状态
    GameState.player.hp = character.startingHp;
    GameState.player.maxHp = character.startingHp;
    GameState.player.gold = character.startingGold;
    GameState.player.shield = 0;
    GameState.player.statusEffects = [];
    GameState.player.relics = [];
    GameState.player.pokemon = { ...pokemon };
    GameState.player.activePokemon = { ...pokemon };

    // 创建初始牌组（基础卡牌）
    console.log('创建初始牌组, 角色初始牌组:', character.startingDeck);
    
    // 定义本地卡牌数据（备用方案）
    const BASE_CARDS = {
        'scratch': { id: 'scratch', name: '抓', type: 'attack', cost: 1, rarity: 'common', description: '造成 4 点伤害。', effects: [{ type: 'damage', value: 4 }] },
        'defend': { id: 'defend', name: '防御', type: 'defense', cost: 1, rarity: 'common', description: '获得 4 点护盾。', effects: [{ type: 'block', value: 4 }] },
        'tackle': { id: 'tackle', name: '撞击', type: 'attack', cost: 1, rarity: 'common', description: '造成 5 点伤害。', effects: [{ type: 'damage', value: 5 }] },
        'bite': { id: 'bite', name: '咬住', type: 'attack', cost: 1, rarity: 'common', description: '造成 6 点伤害。', effects: [{ type: 'damage', value: 6 }] },
        'ember': { id: 'ember', name: '火花', type: 'attack', cost: 1, rarity: 'common', pokemonType: 'fire', description: '造成 6 点伤害。有 50% 概率使敌人灼伤。', effects: [{ type: 'damage', value: 6 }, { type: 'applyStatus', status: 'burn', chance: 0.5 }] },
        'water-gun': { id: 'water-gun', name: '水枪', type: 'attack', cost: 1, rarity: 'common', pokemonType: 'water', description: '造成 5 点伤害。', effects: [{ type: 'damage', value: 5, attackType: 'water' }] },
        'vine-whip': { id: 'vine-whip', name: '藤鞭', type: 'attack', cost: 1, rarity: 'common', pokemonType: 'grass', description: '造成 5 点伤害。', effects: [{ type: 'damage', value: 5, attackType: 'grass' }] },
        'thunder-shock': { id: 'thunder-shock', name: '电击', type: 'attack', cost: 1, rarity: 'common', pokemonType: 'electric', description: '造成 4 点伤害。有 25% 概率使敌人麻痹。', effects: [{ type: 'damage', value: 4 }, { type: 'applyStatus', status: 'paralysis', chance: 0.25 }] },
        'water-gun-char': { id: 'water-gun', name: '水枪', type: 'attack', cost: 1, rarity: 'common', pokemonType: 'water', description: '造成 5 点伤害。', effects: [{ type: 'damage', value: 5 }] },
        'withdraw': { id: 'withdraw', name: '缩入壳中', type: 'defense', cost: 0, rarity: 'common', description: '获得 4 点护盾。', effects: [{ type: 'block', value: 4 }] },
        'harden': { id: 'harden', name: '变硬', type: 'skill', cost: 0, rarity: 'common', description: '获得 5 点护盾。', effects: [{ type: 'block', value: 5 }] }
    };
    
    // 获取卡牌函数
    const getCard = (id) => {
        // 先尝试从全局函数获取
        if (typeof getCardById === 'function') {
            return getCardById(id);
        }
        // 尝试从 CARDS_DATA 获取
        if (typeof CARDS_DATA !== 'undefined') {
            const starter = CARDS_DATA.starter && CARDS_DATA.starter.find(c => c.id === id);
            if (starter) return { ...starter };
            const obtainable = CARDS_DATA.obtainable && CARDS_DATA.obtainable.find(c => c.id === id);
            if (obtainable) return { ...obtainable };
        }
        // 使用本地数据
        if (BASE_CARDS[id]) {
            return { ...BASE_CARDS[id] };
        }
        console.warn('找不到卡牌:', id);
        return null;
    };
    
    GameState.player.deck = character.startingDeck.map(cardId => {
        const card = getCard(cardId);
        console.log(`获取卡牌 ${cardId}:`, card ? card.name : 'null');
        return card;
    }).filter(c => c);
    
    console.log('初始牌组:', GameState.player.deck.length, '张');
    
    // 根据宝可梦属性添加对应属性技能卡
    if (pokemon && pokemon.types && pokemon.types.length > 0) {
        const primaryType = pokemon.types[0];
        const typeSkillMap = {
            'fire': 'ember',        // 火花
            'water': 'water-gun',   // 水枪
            'grass': 'vine-whip',   // 藤鞭
            'electric': 'thunder-shock' // 电击
        };
        
        const skillId = typeSkillMap[primaryType];
        if (skillId) {
            const typeCard = getCard(skillId);
            if (typeCard) {
                GameState.player.deck.push(typeCard);
                console.log(`添加${primaryType}属性技能: ${typeCard.name}`);
            }
        }
    }
    
    // 创建宝可梦卡牌并加入牌组
    if (typeof createPokemonCard === 'function') {
        const pokemonCard = createPokemonCard(pokemon);
        if (pokemonCard) {
            GameState.player.deck.push(pokemonCard);
            GameState.player.pokemonCards = [pokemonCard];
        }
    }
    
    // 添加初始道具
    if (character.startingItems && typeof ItemManager !== 'undefined') {
        for (const itemId of character.startingItems) {
            const item = ItemManager.getItemById(itemId);
            if (item) {
                GameState.player.deck.push({ ...item });
            }
        }
    }
    
    GameState.player.drawPile = [...GameState.player.deck];
    GameState.player.hand = [];
    GameState.player.discardPile = [];
    GameState.player.exhaustPile = [];

    // 重置进度
    GameState.progress.currentFloor = 1;
    GameState.progress.currentNode = null;
    GameState.progress.completedNodes = [];

    // 重置统计
    GameState.stats = {
        enemiesDefeated: 0,
        cardsPlayed: 0,
        damageDealt: 0,
        damageTaken: 0,
        floorsCleared: 0
    };

    // 初始化遗物管理器
    if (typeof RelicManager !== 'undefined' && typeof RelicManager.init === 'function') {
        RelicManager.init();
    }

    // 生成地图
    if (typeof generateMap === 'function') {
        GameState.progress.map = generateMap();
    }

    // 显示地图
    if (typeof showScreen === 'function') {
        showScreen('map-screen');
    }
    if (typeof renderMap === 'function') {
        renderMap();
    }
    updateUI();

    console.log('游戏开始! 角色:', character.name, '宝可梦:', pokemon.name);
    showMessage(`开始冒险! ${character.name} & ${pokemon.name}`);
}

// 选择角色（旧版兼容）
function selectCharacter(characterId) {
    const character = typeof getCharacterById === 'function' ? getCharacterById(characterId) : null;
    if (character) {
        selectTrainer(character);
    }
}

// 选择初始宝可梦（旧版兼容）
function selectStarterPokemon(pokemon) {
    selectStarterPokemonOption(pokemon);
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

    // 分类统计
    const pokemonCards = deck.filter(c => c.isPokemonCard);
    const itemCards = deck.filter(c => c.type === 'item');
    const skillCards = deck.filter(c => !c.isPokemonCard && c.type !== 'item');

    // 显示统计
    const statsDiv = document.createElement('div');
    statsDiv.style.cssText = 'width: 100%; text-align: center; margin-bottom: 20px; color: #aaa;';
    statsDiv.innerHTML = `
        <p>牌组总数: ${deck.length} 张</p>
        <p>宝可梦卡: ${pokemonCards.length} | 道具卡: ${itemCards.length} | 技能卡: ${skillCards.length}</p>
    `;
    container.appendChild(statsDiv);

    // 显示宝可梦卡区域
    if (pokemonCards.length > 0) {
        const pokemonHeader = document.createElement('h3');
        pokemonHeader.style.cssText = 'width: 100%; color: #9c27b0; margin: 10px 0;';
        pokemonHeader.textContent = `🧬 宝可梦卡 (${pokemonCards.length})`;
        container.appendChild(pokemonHeader);

        for (const card of pokemonCards) {
            const cardDiv = createDeckCardElement(card, 'pokemon');
            container.appendChild(cardDiv);
        }
    }

    // 显示道具卡区域
    if (itemCards.length > 0) {
        const itemHeader = document.createElement('h3');
        itemHeader.style.cssText = 'width: 100%; color: #4caf50; margin: 10px 0;';
        itemHeader.textContent = `📦 道具卡 (${itemCards.length})`;
        container.appendChild(itemHeader);

        for (const card of itemCards) {
            const cardDiv = createDeckCardElement(card, 'item');
            container.appendChild(cardDiv);
        }
    }

    // 显示技能卡区域
    if (skillCards.length > 0) {
        const skillHeader = document.createElement('h3');
        skillHeader.style.cssText = 'width: 100%; color: #2196f3; margin: 10px 0;';
        skillHeader.textContent = `⚔️ 技能卡 (${skillCards.length})`;
        container.appendChild(skillHeader);

        for (const card of skillCards) {
            const cardDiv = createDeckCardElement(card, 'skill');
            container.appendChild(cardDiv);
        }
    }
}

// 创建牌组卡牌元素
function createDeckCardElement(card, category) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.rarity || 'common'}`;

    let content = '';
    
    if (category === 'pokemon' && card.pokemonData) {
        const pokemon = card.pokemonData;
        const typesHtml = pokemon.types ? pokemon.types.map(t =>
            `<span class="type-badge type-${t}">${getTypeName ? getTypeName(t) : t}</span>`
        ).join('') : '';
        
        content = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${pokemon.sprite || '❓'} ${pokemon.name}</div>
            <div class="card-types">${typesHtml}</div>
            <div class="card-description" style="font-size: 11px;">
                HP: ${pokemon.hp} | 物攻: ${pokemon.attack || 50} | 特攻: ${pokemon.spAttack || 50}
            </div>
            <div class="card-rarity" style="color: #9c27b0;">🧬 宝可梦卡</div>
        `;
    } else if (category === 'item') {
        content = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.sprite || '📦'} ${card.name}</div>
            <div class="card-type" style="color: #4caf50;">📦 道具</div>
            <div class="card-description">${card.description || ''}</div>
            <div class="card-rarity">${card.consume ? '消耗品' : '特殊道具'}</div>
        `;
    } else {
        // 技能卡 - 如果是道具类型也显示为道具
        const displayType = card.type === 'item' ? '📦 道具' : (CARD_TYPES ? CARD_TYPES[card.type] : card.type || '技能');
        content = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${displayType}</div>
            <div class="card-description">${card.description || ''}</div>
            <div class="card-rarity">${CARD_RARITY ? CARD_RARITY[card.rarity] || '' : ''}</div>
        `;
    }

    cardDiv.innerHTML = content;
    return cardDiv;
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
