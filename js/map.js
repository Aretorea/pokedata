/**
 * 地图系统模块
 * 负责地图生成、节点管理和导航
 */

// 节点类型定义
const NODE_TYPES = {
    battle: { name: '战斗', icon: '⚔️', color: '#ff6b6b' },
    elite: { name: '精英战', icon: '💀', color: '#9c27b0' },
    boss: { name: 'Boss战', icon: '👑', color: '#ffcb05' },
    shop: { name: '商店', icon: '🏪', color: '#4caf50' },
    rest: { name: '休息', icon: '❤️', color: '#2196f3' },
    event: { name: '事件', icon: '❓', color: '#ff9800' },
    treasure: { name: '宝箱', icon: '📦', color: '#ffcb05' }
};

// 本地获取随机卡牌奖励
function getRandomCardRewardsLocal(count, minRarity) {
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const minIndex = rarityOrder.indexOf(minRarity);
    const availableCards = [];
    
    // 从 CARDS_DATA 获取卡牌
    if (typeof CARDS_DATA !== 'undefined') {
        if (CARDS_DATA.obtainable) {
            for (const card of CARDS_DATA.obtainable) {
                const cardRarityIndex = rarityOrder.indexOf(card.rarity);
                if (cardRarityIndex >= minIndex) {
                    availableCards.push(card);
                }
            }
        }
    }
    
    // 如果没有可用卡牌，返回基础卡牌
    if (availableCards.length === 0) {
        const baseCards = [
            { id: 'scratch', name: '抓', type: 'attack', cost: 1, rarity: 'common', description: '造成 4 点伤害。', effects: [{ type: 'damage', value: 4 }] },
            { id: 'defend', name: '防御', type: 'defense', cost: 1, rarity: 'common', description: '获得 4 点护盾。', effects: [{ type: 'block', value: 4 }] },
            { id: 'tackle', name: '撞击', type: 'attack', cost: 1, rarity: 'common', description: '造成 5 点伤害。', effects: [{ type: 'damage', value: 5 }] }
        ];
        return baseCards.slice(0, count);
    }
    
    // 随机选择卡牌
    const selected = [];
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        selected.push({ ...shuffled[i] });
    }
    
    return selected;
}

// 生成地图
function generateMap() {
    const map = [];
    let nodeId = 0;

    // 定义每一层的结构
    // 每层是一个数组，包含该层所有节点
    const layerCount = 7; // 总共7层（包括Boss层）

    // 第1层：起点（单个战斗节点）
    const layer0 = [{
        id: nodeId++,
        type: 'battle',
        layer: 0,
        column: 0,
        completed: false,
        available: true,  // 起点始终可用
        connections: []
    }];
    map.push(layer0);
    
    console.log('地图生成完成，起点节点ID:', layer0[0].id, '可用:', layer0[0].available);

    // 第2层：2个节点
    const layer1 = [
        { id: nodeId++, type: 'battle', layer: 1, column: 0, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'event', layer: 1, column: 1, completed: false, available: false, connections: [] }
    ];
    map.push(layer1);

    // 第3层：3个节点
    const layer2 = [
        { id: nodeId++, type: 'battle', layer: 2, column: 0, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'shop', layer: 2, column: 1, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'battle', layer: 2, column: 2, completed: false, available: false, connections: [] }
    ];
    map.push(layer2);

    // 第4层：3个节点
    const layer3 = [
        { id: nodeId++, type: 'elite', layer: 3, column: 0, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'event', layer: 3, column: 1, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'battle', layer: 3, column: 2, completed: false, available: false, connections: [] }
    ];
    map.push(layer3);

    // 第5层：2个节点
    const layer4 = [
        { id: nodeId++, type: 'rest', layer: 4, column: 0, completed: false, available: false, connections: [] },
        { id: nodeId++, type: 'treasure', layer: 4, column: 1, completed: false, available: false, connections: [] }
    ];
    map.push(layer4);

    // 第6层：休息点
    const layer5 = [{
        id: nodeId++,
        type: 'rest',
        layer: 5,
        column: 0,
        completed: false,
        available: false,
        connections: []
    }];
    map.push(layer5);

    // 第7层：Boss
    const layer6 = [{
        id: nodeId++,
        type: 'boss',
        layer: 6,
        column: 0,
        completed: false,
        available: false,
        connections: []
    }];
    map.push(layer6);

    // 设置节点连接关系
    setupNodeConnections(map);

    return map;
}

// 设置节点连接（改进版）
function setupNodeConnections(map) {
    for (let layer = 0; layer < map.length - 1; layer++) {
        const currentLayer = map[layer];
        const nextLayer = map[layer + 1];

        for (const node of currentLayer) {
            node.connections = [];

            // 连接逻辑：根据列位置连接到下一层相邻的节点
            for (const nextNode of nextLayer) {
                // 判断是否应该连接
                const shouldConnect = shouldNodesConnect(node, nextNode, currentLayer, nextLayer);
                if (shouldConnect) {
                    node.connections.push(nextNode.id);
                }
            }

            // 确保至少有一个连接
            if (node.connections.length === 0 && nextLayer.length > 0) {
                // 连接到最近的节点
                const nearest = findNearestNode(node, nextLayer);
                if (nearest) {
                    node.connections.push(nearest.id);
                }
            }
        }
    }
}

// 判断两个节点是否应该连接
function shouldNodesConnect(node, nextNode, currentLayer, nextLayer) {
    // 如果下一层只有一个节点，所有节点都连接到它
    if (nextLayer.length === 1) {
        return true;
    }

    // 如果当前层只有一个节点，它连接到下一层所有节点
    if (currentLayer.length === 1) {
        return true;
    }

    // 根据列位置判断连接
    // 节点连接到下一层列位置相邻的节点（差值不超过1）
    const columnDiff = Math.abs(nextNode.column - node.column);
    return columnDiff <= 1;
}

// 找到最近的节点
function findNearestNode(node, targetLayer) {
    if (targetLayer.length === 0) return null;

    let nearest = targetLayer[0];
    let minDiff = Math.abs(nearest.column - node.column);

    for (const target of targetLayer) {
        const diff = Math.abs(target.column - node.column);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = target;
        }
    }

    return nearest;
}

// 渲染地图
function renderMap() {
    const container = document.getElementById('map-container');
    if (!container) return;

    container.innerHTML = '';

    const map = GameState.progress.map;

    // 添加敌人意图提示区域
    const intentDiv = document.createElement('div');
    intentDiv.className = 'map-intent-info';
    intentDiv.style.cssText = 'text-align: center; margin-bottom: 20px; color: #888;';
    intentDiv.innerHTML = '<p>点击绿色高亮的节点继续前进</p>';
    container.appendChild(intentDiv);

    for (let layer = 0; layer < map.length; layer++) {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'map-floor';
        layerDiv.style.display = 'flex';
        layerDiv.style.justifyContent = 'center';
        layerDiv.style.gap = '30px';
        layerDiv.style.margin = '15px 0';

        const layerNodes = map[layer];

        for (const node of layerNodes) {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'map-node';
            nodeDiv.classList.add(node.type);

            if (node.completed) {
                nodeDiv.classList.add('completed');
                nodeDiv.style.cursor = 'default';
            } else if (node.available) {
                nodeDiv.classList.add('available');
            }

            if (GameState.progress.currentNode && GameState.progress.currentNode.id === node.id) {
                nodeDiv.classList.add('current');
            }

            const nodeType = NODE_TYPES[node.type];
            nodeDiv.textContent = nodeType ? nodeType.icon : '?';
            nodeDiv.title = `${nodeType ? nodeType.name : '未知'} (ID: ${node.id})`;

            // 点击事件
            if (node.available && !node.completed) {
                nodeDiv.addEventListener('click', () => {
                    selectMapNode(node);
                });
                nodeDiv.style.cursor = 'pointer';
            }

            layerDiv.appendChild(nodeDiv);
        }

        container.appendChild(layerDiv);
    }

    // 显示进度
    const progressDiv = document.createElement('div');
    progressDiv.style.cssText = 'text-align: center; margin-top: 20px; color: #888;';
    progressDiv.innerHTML = `<p>第 ${GameState.progress.currentFloor} 层 / 共 ${GameState.progress.maxFloors} 层</p>`;
    container.appendChild(progressDiv);
}

// 选择地图节点
function selectMapNode(node) {
    console.log('选择节点:', node);

    // 标记当前节点
    const previousNode = GameState.progress.currentNode;
    if (previousNode) {
        previousNode.completed = true;
        GameState.progress.completedNodes.push(previousNode.id);
    }

    GameState.progress.currentNode = node;
    node.available = false;
    node.completed = true;

    // 更新下一层节点的可用性
    updateNodeAvailability(node);

    // 执行节点事件
    executeNodeEvent(node);
}

// 更新节点可用性（改进版）
function updateNodeAvailability(completedNode) {
    const map = GameState.progress.map;

    // 找到当前节点所在的层
    let currentLayerIndex = -1;
    for (let layer = 0; layer < map.length; layer++) {
        if (map[layer].some(n => n.id === completedNode.id)) {
            currentLayerIndex = layer;
            break;
        }
    }

    // 如果找不到或已是最后一层，不更新
    if (currentLayerIndex < 0 || currentLayerIndex >= map.length - 1) {
        return;
    }

    // 获取下一层
    const nextLayer = map[currentLayerIndex + 1];

    // 根据当前节点的连接来启用下一层节点
    for (const nextNode of nextLayer) {
        if (completedNode.connections && completedNode.connections.includes(nextNode.id)) {
            nextNode.available = true;
        }
    }

    // 如果下一层没有可用节点（备份逻辑），启用所有下一层节点
    const hasAvailable = nextLayer.some(n => n.available);
    if (!hasAvailable) {
        for (const nextNode of nextLayer) {
            nextNode.available = true;
        }
    }
}

// 执行节点事件
function executeNodeEvent(node) {
    switch (node.type) {
        case 'battle':
            const enemy = getRandomEnemy(GameState.progress.currentFloor);
            if (typeof startBattle === 'function') {
                startBattle(enemy);
            }
            break;

        case 'elite':
            const elite = getRandomElite();
            if (typeof startBattle === 'function') {
                startBattle(elite);
            }
            break;

        case 'boss':
            const boss = getRandomBoss();
            if (typeof startBattle === 'function') {
                startBattle(boss);
            }
            break;

        case 'shop':
            showShop();
            break;

        case 'rest':
            handleRestNode();
            break;

        case 'event':
            handleEventNode();
            break;

        case 'treasure':
            handleTreasureNode();
            break;

        default:
            console.log('未知节点类型:', node.type);
            // 即使是未知类型，也要更新地图，避免卡死
            setTimeout(() => {
                renderMap();
                updateUI();
            }, 500);
    }
}

// 处理休息节点
function handleRestNode() {
    const healAmount = Math.floor(GameState.player.maxHp * 0.3);
    GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + healAmount);

    showMessage(`在休息点恢复了 ${healAmount} HP!`);

    setTimeout(() => {
        showScreen('map-screen');
        renderMap();
        updateUI();
    }, 1500);
}

// 处理事件节点（改进版，使用自定义对话框而非confirm）
function handleEventNode() {
    const events = [
        {
            name: '神秘的宝可梦',
            description: '你遇到了一只受伤的野生宝可梦...',
            options: [
                { text: '救助它 (+15 HP)', effect: () => { healPlayer(15); showMessage('你救助了宝可梦，获得祝福!'); } },
                { text: '离开', effect: () => { showMessage('你离开了。'); } }
            ]
        },
        {
            name: '幸运金币',
            description: '你发现了一袋金币!',
            options: [
                { text: '拿走 (+30 金币)', effect: () => { GameState.player.gold += 30; showMessage('获得 30 金币!'); } }
            ]
        },
        {
            name: '神秘的训练家',
            description: '一位神秘的训练家提出与你交换卡牌...',
            options: [
                { text: '交换 (随机卡牌)', effect: () => {
                    if (GameState.player.deck.length > 5) {
                        const randomIndex = Math.floor(Math.random() * GameState.player.deck.length);
                        GameState.player.deck.splice(randomIndex, 1);
                        const newCard = getRandomCardRewards(1)[0];
                        GameState.player.deck.push(newCard);
                        showMessage(`获得 ${newCard.name}!`);
                    } else {
                        showMessage('你的牌组太小了，无法交换。');
                    }
                }},
                { text: '拒绝', effect: () => { showMessage('你拒绝了交换。'); } }
            ]
        },
        {
            name: '危险的陷阱',
            description: '你踩到了一个陷阱!',
            options: [
                { text: '承受伤害', effect: () => {
                    const damage = 10;
                    GameState.player.hp = Math.max(1, GameState.player.hp - damage);
                    showMessage(`受到 ${damage} 点伤害!`);
                }}
            ]
        },
        {
            name: '能量源泉',
            description: '你发现了一个神秘的能量源泉...',
            options: [
                { text: '吸收能量 (永久+1能量上限)', effect: () => {
                    GameState.battle.maxEnergy++;
                    showMessage('能量上限提升!');
                }},
                { text: '离开', effect: () => { showMessage('你离开了源泉。'); } }
            ]
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    showEventDialog(event);
}

// 显示事件对话框
function showEventDialog(event) {
    // 移除现有对话框
    const existingDialog = document.querySelector('.event-dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    // 创建对话框
    const overlay = document.createElement('div');
    overlay.className = 'event-dialog-overlay';
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
    dialog.className = 'event-dialog';
    dialog.style.cssText = `
        background: linear-gradient(145deg, #2a2a4a 0%, #1a1a3a 100%);
        border: 2px solid #3d7dca;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        text-align: center;
    `;

    dialog.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #ffcb05;">${event.name}</h3>
        <p style="margin-bottom: 20px; color: #ccc;">${event.description}</p>
        <div class="event-options" style="display: flex; flex-direction: column; gap: 10px;"></div>
    `;

    const optionsContainer = dialog.querySelector('.event-options');

    for (const option of event.options) {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.style.cssText = `
            padding: 12px 20px;
            background: linear-gradient(135deg, #3d7dca 0%, #2a5a9e 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s;
        `;
        btn.addEventListener('click', () => {
            option.effect();
            overlay.remove();
            setTimeout(() => {
                showScreen('map-screen');
                renderMap();
                updateUI();
            }, 500);
        });
        optionsContainer.appendChild(btn);
    }

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

// 处理宝箱节点
function handleTreasureNode() {
    const gold = getRandomGold(20, 50);
    GameState.player.gold += gold;

    showMessage(`发现宝箱! 获得 ${gold} 金币!`);

    // 有几率获得随机卡牌
    if (Math.random() < 0.5) {
        const card = getRandomCardRewards(1, { minRarity: 'uncommon' })[0];
        if (card) {
            GameState.player.deck.push(card);
            setTimeout(() => {
                showMessage(`还发现了 ${card.name} 卡牌!`);
            }, 1600);
        }
    }

    setTimeout(() => {
        showScreen('map-screen');
        renderMap();
        updateUI();
    }, 1500);
}

// 进入商店
function showShop() {
    showScreen('shop-screen');
    renderShop();
}

// 渲染商店
function renderShop() {
    const container = document.getElementById('shop-items');
    if (!container) return;

    container.innerHTML = '';
    document.getElementById('shop-gold').textContent = GameState.player.gold;

    // 初始化刷新次数
    if (typeof GameState.shopRefreshCount === 'undefined') {
        GameState.shopRefreshCount = 0;
    }

    // 计算刷新价格（阶梯式：首次免费，之后每次+50金币）
    const refreshCost = GameState.shopRefreshCount === 0 ? 0 : 50 * GameState.shopRefreshCount;
    
    // 添加刷新按钮和遗物购买区
    const shopHeader = document.createElement('div');
    shopHeader.style.cssText = 'width: 100%; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;';
    shopHeader.innerHTML = `
        <button id="refresh-shop-btn" class="action-btn" style="background: #2196f3;">
            🔄 刷新商店 ${refreshCost > 0 ? `(${refreshCost}💰)` : '(免费)'}
        </button>
        <span style="color: #aaa;">已刷新: ${GameState.shopRefreshCount}次</span>
    `;
    container.appendChild(shopHeader);

    // 遗物购买区
    const relicSection = document.createElement('div');
    relicSection.style.cssText = 'width: 100%; margin: 20px 0;';
    relicSection.innerHTML = `
        <h3 style="color: #9c27b0; margin-bottom: 10px;">💎 遗物商店</h3>
        <div id="relic-shop-items" class="card-grid" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
    `;
    container.appendChild(relicSection);

    // 生成遗物商品
    renderRelicShop();

    // 卡牌购买区
    const cardSectionTitle = document.createElement('h3');
    cardSectionTitle.style.cssText = 'width: 100%; color: #ffcb05; margin: 20px 0 10px 0;';
    cardSectionTitle.textContent = '🃏 卡牌商店';
    container.appendChild(cardSectionTitle);

    // 商店物品
    const shopItems = [
        ...getRandomCardRewards(3, { minRarity: 'uncommon' }),
        { id: 'potion-shop', name: '伤药', type: 'item', cost: 50, description: '恢复 20 HP', effect: () => healPlayer(20) },
        { id: 'super-potion-shop', name: '好伤药', type: 'item', cost: 80, description: '恢复 40 HP', effect: () => healPlayer(40) },
        { id: 'energy-shop', name: '能量饮料', type: 'item', cost: 100, description: '永久 +1 能量上限', effect: () => { GameState.battle.maxEnergy++; showMessage('能量上限提升!'); } },
        { id: 'card-remove', name: '移除卡牌', type: 'item', cost: 75, description: '从牌组中移除一张卡牌', effect: () => showRemoveCardDialog() }
    ];

    // 分配价格
    shopItems.forEach(item => {
        if (!item.cost) {
            const rarityPrices = {
                common: 30,
                uncommon: 50,
                rare: 80,
                epic: 120,
                legendary: 200
            };
            item.cost = rarityPrices[item.rarity] || 50;
        }
    });

    for (const item of shopItems) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'card';

        if (item.rarity) {
            itemDiv.classList.add(item.rarity);
        }

        itemDiv.innerHTML = `
            <div class="card-name">${item.name}</div>
            <div class="card-type">${item.type === 'item' ? '📦 道具' : (CARD_TYPES ? CARD_TYPES[item.type] : item.type)}</div>
            <div class="card-description">${item.description}</div>
            <div class="card-cost" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">${item.cost}💰</div>
        `;

        if (GameState.player.gold >= item.cost) {
            itemDiv.addEventListener('click', () => {
                buyShopItem(item);
            });
            itemDiv.style.cursor = 'pointer';
        } else {
            itemDiv.style.opacity = '0.5';
            itemDiv.style.cursor = 'not-allowed';
        }

        container.appendChild(itemDiv);
    }

    // 绑定刷新按钮事件
    const refreshBtn = document.getElementById('refresh-shop-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (GameState.player.gold >= refreshCost) {
                GameState.player.gold -= refreshCost;
                GameState.shopRefreshCount++;
                renderShop();
                showMessage(`商店已刷新！花费 ${refreshCost} 金币`);
            } else {
                showMessage('金币不足！');
            }
        });
    }
}

// 渲染遗物商店
function renderRelicShop() {
    const container = document.getElementById('relic-shop-items');
    if (!container) return;

    // 获取一些随机遗物出售
    const availableRelics = [
        { id: 'burning-charcoal', name: '燃烧木炭', rarity: 'common', cost: 80, description: '火属性技能伤害+20%', sprite: '🔥' },
        { id: 'mystic-water', name: '神秘水滴', rarity: 'common', cost: 80, description: '水属性技能伤害+20%', sprite: '💧' },
        { id: 'miracle-seed', name: '奇迹种子', rarity: 'common', cost: 80, description: '草属性技能伤害+20%', sprite: '🌿' },
        { id: 'magnet', name: '磁铁', rarity: 'common', cost: 80, description: '电属性技能伤害+20%', sprite: '🧲' },
        { id: 'kings-rock', name: '王者之印', rarity: 'uncommon', cost: 150, description: '攻击有15%概率眩晕敌人', sprite: '👑' },
        { id: 'scope-lens', name: '聚焦镜', rarity: 'uncommon', cost: 150, description: '暴击伤害+50%', sprite: '🔍' },
        { id: 'leftovers', name: '剩饭', rarity: 'uncommon', cost: 180, description: '每回合恢复5HP', sprite: '🍚' },
        { id: 'expert-belt', name: '博识眼镜', rarity: 'rare', cost: 250, description: '效果拔群时伤害+25%', sprite: '👓' },
        { id: 'friendship-ribbon', name: '友情丝带', rarity: 'rare', cost: 200, description: '亲密度获取+50%', sprite: '🎗️' }
    ];

    // 随机选择3个遗物
    const shuffled = [...availableRelics].sort(() => Math.random() - 0.5);
    const shopRelics = shuffled.slice(0, 3);

    for (const relic of shopRelics) {
        // 检查是否已拥有
        const owned = GameState.player.relics && GameState.player.relics.some(r => r.id === relic.id);
        
        const relicDiv = document.createElement('div');
        relicDiv.className = `card ${relic.rarity}`;
        relicDiv.style.cssText = 'cursor: pointer;';

        relicDiv.innerHTML = `
            <div class="card-name">${relic.sprite || '💎'} ${relic.name}</div>
            <div class="card-type" style="color: #9c27b0;">💎 遗物</div>
            <div class="card-description">${relic.description}</div>
            <div class="card-cost" style="background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);">${owned ? '已拥有' : relic.cost + '💰'}</div>
        `;

        if (!owned && GameState.player.gold >= relic.cost) {
            relicDiv.addEventListener('click', () => {
                buyRelic(relic);
            });
        } else if (owned) {
            relicDiv.style.opacity = '0.5';
        } else {
            relicDiv.style.opacity = '0.5';
            relicDiv.style.cursor = 'not-allowed';
        }

        container.appendChild(relicDiv);
    }
}

// 购买遗物
function buyRelic(relic) {
    if (GameState.player.gold < relic.cost) {
        showMessage('金币不足！');
        return;
    }

    GameState.player.gold -= relic.cost;
    
    // 添加遗物到玩家
    if (!GameState.player.relics) {
        GameState.player.relics = [];
    }
    
    GameState.player.relics.push({
        id: relic.id,
        name: relic.name,
        description: relic.description,
        rarity: relic.rarity,
        sprite: relic.sprite
    });

    showMessage(`购买了 ${relic.name}！`);
    
    // 刷新遗物商店
    renderRelicShop();
    updateUI();
}

// 显示移除卡牌对话框
function showRemoveCardDialog() {
    if (GameState.player.deck.length <= 5) {
        showMessage('牌组太小，无法移除卡牌!');
        return;
    }

    // 移除现有对话框
    const existingDialog = document.querySelector('.remove-card-dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    // 创建对话框
    const overlay = document.createElement('div');
    overlay.className = 'remove-card-dialog-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        overflow-y: auto;
        padding: 20px;
    `;

    const title = document.createElement('h3');
    title.textContent = '选择要移除的卡牌';
    title.style.cssText = 'color: #ffcb05; margin-bottom: 20px;';
    overlay.appendChild(title);

    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 800px;';

    for (let i = 0; i < GameState.player.deck.length; i++) {
        const card = GameState.player.deck[i];
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity || 'common'}`;
        cardDiv.style.cssText = 'cursor: pointer; min-width: 120px;';

        cardDiv.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${CARD_TYPES ? CARD_TYPES[card.type] : card.type}</div>
            <div class="card-description">${card.description}</div>
        `;

        cardDiv.addEventListener('click', () => {
            GameState.player.deck.splice(i, 1);
            showMessage(`移除了 ${card.name}!`);
            overlay.remove();
            renderShop();
            updateUI();
        });

        cardsContainer.appendChild(cardDiv);
    }

    overlay.appendChild(cardsContainer);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '取消';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => {
        overlay.remove();
        renderShop();
    });
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);
}

// 购买商店物品
function buyShopItem(item) {
    if (GameState.player.gold < item.cost) {
        showMessage('金币不足!');
        return;
    }

    GameState.player.gold -= item.cost;

    if (item.effect) {
        // 道具效果
        item.effect();
    } else {
        // 添加卡牌到牌组
        GameState.player.deck.push({ ...item });
        showMessage(`购买了 ${item.name}!`);
    }

    renderShop();
    updateUI();
}

// 离开商店
function leaveShop() {
    showScreen('map-screen');
    renderMap();
    updateUI();
}

// 显示遗物奖励界面
function showRelicRewardScreen(type) {
    // type: 'elite' 或 'boss'
    const container = document.createElement('div');
    container.className = 'relic-reward-overlay';
    container.style.cssText = `
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
        z-index: 3000;
        overflow-y: auto;
        padding: 20px;
    `;

    const title = document.createElement('h2');
    title.style.cssText = 'color: #ffcb05; margin-bottom: 10px; font-size: 1.5rem;';
    title.textContent = type === 'boss' ? '👑 Boss遗物奖励！' : '💀 精英遗物奖励！';
    container.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.style.cssText = 'color: #aaa; margin-bottom: 20px;';
    subtitle.textContent = '选择一个遗物加入你的收藏';
    container.appendChild(subtitle);

    // 获取遗物选择
    const rarity = type === 'boss' ? 'boss' : 'rare';
    const relicCount = type === 'boss' ? 3 : 2;
    
    const availableRelics = [];
    const usedRarities = [rarity];
    
    // Boss可以额外获得稀有遗物选项
    if (type === 'boss') {
        usedRarities.push('rare');
    }
    
    for (const r of usedRarities) {
        const relics = RELICS_DATA[r];
        if (relics) {
            const shuffled = [...relics].sort(() => Math.random() - 0.5);
            const count = r === rarity ? relicCount : 1;
            for (let i = 0; i < Math.min(count, shuffled.length); i++) {
                // 排除已拥有的遗物
                if (typeof RelicManager !== 'undefined' && !RelicManager.hasRelic(shuffled[i].id)) {
                    availableRelics.push({ ...shuffled[i], rarity: r });
                }
            }
        }
    }

    if (availableRelics.length === 0) {
        subtitle.textContent = '没有可用的遗物奖励';
        setTimeout(() => {
            container.remove();
            continueAfterRelicReward(type);
        }, 1500);
        return;
    }

    // 遗物卡片容器
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; max-width: 800px;';

    for (const relic of availableRelics) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${relic.rarity}`;
        cardDiv.style.cssText = 'cursor: pointer; min-width: 150px; transition: transform 0.2s;';

        const rarityColor = RELIC_RARITY[relic.rarity] ? RELIC_RARITY[relic.rarity].color : '#9e9e9e';

        cardDiv.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">${relic.sprite || '💎'}</div>
            <div style="font-weight: bold; margin-bottom: 5px;">${relic.name}</div>
            <div style="color: ${rarityColor}; font-size: 12px; margin-bottom: 5px;">
                ${RELIC_RARITY[relic.rarity] ? RELIC_RARITY[relic.rarity].name : relic.rarity}
            </div>
            <div style="font-size: 12px; color: #ccc;">${relic.description}</div>
        `;

        cardDiv.addEventListener('mouseenter', () => {
            cardDiv.style.transform = 'scale(1.05)';
        });
        cardDiv.addEventListener('mouseleave', () => {
            cardDiv.style.transform = 'scale(1)';
        });

        cardDiv.addEventListener('click', () => {
            if (typeof RelicManager !== 'undefined') {
                RelicManager.addRelic(relic.id);
            }
            container.remove();
            continueAfterRelicReward(type);
        });

        cardsContainer.appendChild(cardDiv);
    }

    container.appendChild(cardsContainer);

    // 跳过按钮
    const skipBtn = document.createElement('button');
    skipBtn.textContent = '跳过遗物';
    skipBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background: #555;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    `;
    skipBtn.addEventListener('click', () => {
        container.remove();
        continueAfterRelicReward(type);
    });
    container.appendChild(skipBtn);

    document.body.appendChild(container);
}

// 遗物奖励后继续
function continueAfterRelicReward(type) {
    if (type === 'boss') {
        // Boss战后处理
        GameState.stats.floorsCleared = GameState.progress.currentFloor;

        if (GameState.progress.currentFloor >= GameState.progress.maxFloors) {
            // 游戏胜利
            console.log('游戏胜利！');
            setTimeout(() => gameVictory(), 500);
        } else {
            // 进入下一层
            GameState.progress.currentFloor++;
            GameState.progress.currentNode = null;
            GameState.progress.completedNodes = [];
            
            const newMap = generateMap();
            GameState.progress.map = newMap;
            
            if (newMap[0] && newMap[0][0]) {
                newMap[0][0].available = true;
            }

            const healAmount = Math.floor(GameState.player.maxHp * 0.2);
            GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + healAmount);

            if (typeof RelicManager !== 'undefined' && typeof RelicManager.onFloorStart === 'function') {
                RelicManager.onFloorStart();
            }

            setTimeout(() => {
                showScreen('map-screen');
                renderMap();
                updateUI();
                showMessage(`进入第 ${GameState.progress.currentFloor} 层! 恢复 ${healAmount} HP`);
            }, 500);
        }
    } else {
        // 精英战后显示卡牌奖励
        showRewardScreen(true);
    }
}

// 显示奖励界面
function showRewardScreen(isElite) {
    showScreen('reward-screen');

    const container = document.getElementById('reward-cards');
    if (!container) return;

    container.innerHTML = '';

    // 获取卡牌奖励（包含道具卡）
    const cards = getRandomCardRewardsLocal(3, isElite ? 'uncommon' : 'common');

    if (cards.length === 0) {
        showMessage('没有可用的奖励卡牌!');
        setTimeout(() => {
            showScreen('map-screen');
            renderMap();
            updateUI();
        }, 1000);
        return;
    }

    for (const card of cards) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity} pokemon-card`;
        cardDiv.style.cursor = 'pointer';
        
        // 道具卡特殊样式
        if (card.type === 'item') {
            cardDiv.classList.add('item-card');
        }

        // 根据卡牌类型显示不同内容
        let cardContent = '';
        if (card.type === 'item') {
            cardContent = `
                <div class="card-cost">${card.cost}</div>
                <div class="card-name">${card.sprite || '📦'} ${card.name}</div>
                <div class="card-type" style="color: #4caf50;">📦 道具</div>
                <div class="card-description">${card.description}</div>
                <div class="card-rarity">${CARD_RARITY ? CARD_RARITY[card.rarity] : card.rarity}</div>
                ${card.consume ? '<div style="font-size: 11px; color: #f44336;">消耗品</div>' : ''}
                ${card.returnAfterBattle ? '<div style="font-size: 11px; color: #2196f3;">战斗后返回</div>' : ''}
            `;
        } else if (card.isPokemonCard) {
            const pokemon = card.pokemonData;
            const typesHtml = pokemon.types ? pokemon.types.map(t =>
                `<span class="type-badge type-${t}">${getTypeName(t)}</span>`
            ).join('') : '';
            cardContent = `
                <div class="card-cost">${card.cost}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-types">${typesHtml}</div>
                <div class="card-description">${card.description}</div>
                <div class="card-rarity">${CARD_RARITY ? CARD_RARITY[card.rarity] : card.rarity}</div>
                <div style="font-size: 11px; color: #9c27b0;">宝可梦卡</div>
            `;
        } else {
            const typeNames = {
                'attack': '⚔️ 攻击',
                'defense': '🛡️ 防御',
                'skill': '✨ 技能',
                'energy': '⚡ 能量'
            };
            cardContent = `
                <div class="card-cost">${card.cost}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-type">${typeNames[card.type] || card.type}</div>
                <div class="card-description">${card.description}</div>
                <div class="card-rarity">${card.rarity || ''}</div>
            `;
        }
        
        cardDiv.innerHTML = cardContent;

        cardDiv.addEventListener('click', () => {
            selectRewardCard(card);
        });

        container.appendChild(cardDiv);
    }
}

// 选择奖励卡牌
function selectRewardCard(card) {
    GameState.player.deck.push(card);
    showMessage(`获得 ${card.name}!`);

    // 返回地图
    setTimeout(() => {
        showScreen('map-screen');
        renderMap();
        updateUI();
    }, 1000);
}

// 跳过奖励
function handleRewardSkipped() {
    showScreen('map-screen');
    renderMap();
    updateUI();
}
