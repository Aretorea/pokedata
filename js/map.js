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

// 生成地图
function generateMap() {
    const map = [];
    const floors = GameState.progress.maxFloors;

    // 每层的节点布局
    const floorLayout = [
        // 第一层布局 (起点)
        { rows: 1, nodesPerRow: [1], types: ['battle'] },
        { rows: 2, nodesPerRow: [2, 2], types: ['battle', 'battle', 'event', 'shop'] },
        { rows: 2, nodesPerRow: [3, 2], types: ['battle', 'battle', 'elite', 'rest'] },

        // 中间层
        { rows: 2, nodesPerRow: [2, 3], types: ['battle', 'event', 'shop', 'battle'] },
        { rows: 2, nodesPerRow: [3, 2], types: ['battle', 'elite', 'treasure', 'battle'] },

        // Boss前
        { rows: 1, nodesPerRow: [1], types: ['rest'] },
        { rows: 1, nodesPerRow: [1], types: ['boss'] }
    ];

    let nodeId = 0;

    for (let row = 0; row < floorLayout.length; row++) {
        const layout = floorLayout[row];
        const rowData = [];

        for (let r = 0; r < layout.rows; r++) {
            const nodeCount = layout.nodesPerRow[r];
            const rowNodes = [];

            for (let n = 0; n < nodeCount; n++) {
                const typeIndex = (row + n) % layout.types.length;
                let type = layout.types[typeIndex];

                // 确保第一行第一个是战斗
                if (row === 0 && r === 0 && n === 0) {
                    type = 'battle';
                }

                // 确保最后一行是Boss
                if (row === floorLayout.length - 1) {
                    type = 'boss';
                }

                rowNodes.push({
                    id: nodeId++,
                    type: type,
                    row: row,
                    position: n,
                    completed: false,
                    available: row === 0 && r === 0 && n === 0 // 第一个节点可用
                });
            }

            rowData.push(rowNodes);
        }

        map.push(rowData);
    }

    // 设置节点连接关系
    setupNodeConnections(map);

    return map;
}

// 设置节点连接
function setupNodeConnections(map) {
    for (let row = 0; row < map.length - 1; row++) {
        const currentRow = map[row].flat();
        const nextRow = map[row + 1].flat();

        for (const node of currentRow) {
            node.connections = [];

            // 连接到下一行的节点
            for (const nextNode of nextRow) {
                // 简单的连接逻辑：每个节点连接到下一行相邻位置的节点
                if (Math.abs(nextNode.position - node.position) <= 1) {
                    node.connections.push(nextNode.id);
                }
            }
        }
    }
}

// 渲染地图
function renderMap() {
    const container = document.getElementById('map-container');
    if (!container) return;

    container.innerHTML = '';

    const map = GameState.progress.map;

    for (let row = 0; row < map.length; row++) {
        const floorDiv = document.createElement('div');
        floorDiv.className = 'map-floor';

        const rowData = map[row].flat();

        for (const node of rowData) {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'map-node';
            nodeDiv.classList.add(node.type);

            if (node.completed) {
                nodeDiv.classList.add('completed');
            } else if (node.available) {
                nodeDiv.classList.add('available');
            }

            if (GameState.progress.currentNode && GameState.progress.currentNode.id === node.id) {
                nodeDiv.classList.add('current');
            }

            const nodeType = NODE_TYPES[node.type];
            nodeDiv.textContent = nodeType ? nodeType.icon : '?';
            nodeDiv.title = nodeType ? nodeType.name : '未知';

            // 点击事件
            if (node.available && !node.completed) {
                nodeDiv.addEventListener('click', () => {
                    selectMapNode(node);
                });
            }

            floorDiv.appendChild(nodeDiv);
        }

        container.appendChild(floorDiv);
    }
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

// 更新节点可用性
function updateNodeAvailability(completedNode) {
    const map = GameState.progress.map;

    // 找到当前节点所在的行
    let currentRowIndex = -1;
    for (let row = 0; row < map.length; row++) {
        const flatRow = map[row].flat();
        if (flatRow.some(n => n.id === completedNode.id)) {
            currentRowIndex = row;
            break;
        }
    }

    // 启用下一行节点
    if (currentRowIndex >= 0 && currentRowIndex < map.length - 1) {
        const nextRow = map[currentRowIndex + 1].flat();
        for (const node of nextRow) {
            // 检查连接关系
            if (completedNode.connections && completedNode.connections.includes(node.id)) {
                node.available = true;
            }
        }
    }
}

// 执行节点事件
function executeNodeEvent(node) {
    switch (node.type) {
        case 'battle':
            const enemy = getRandomEnemy(GameState.progress.currentFloor);
            startBattle(enemy);
            break;

        case 'elite':
            const elite = getRandomElite();
            startBattle(elite);
            break;

        case 'boss':
            const boss = getRandomBoss();
            startBattle(boss);
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
    }
}

// 处理休息节点
function handleRestNode() {
    const healAmount = Math.floor(GameState.player.maxHp * 0.3);
    GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + healAmount);

    showMessage(`在休息点恢复了 ${healAmount} HP!`);

    setTimeout(() => {
        renderMap();
        updateUI();
    }, 1500);
}

// 处理事件节点
function handleEventNode() {
    // 随机事件
    const events = [
        {
            name: '神秘的宝可梦',
            description: '你遇到了一只受伤的野生宝可梦...',
            options: [
                { text: '救助它', effect: () => { healPlayer(15); showMessage('你救助了宝可梦，获得祝福!'); } },
                { text: '离开', effect: () => { showMessage('你离开了。'); } }
            ]
        },
        {
            name: '幸运金币',
            description: '你发现了一袋金币!',
            options: [
                { text: '拿走', effect: () => { GameState.player.gold += 30; showMessage('获得 30 金币!'); } }
            ]
        },
        {
            name: '神秘的训练家',
            description: '一位神秘的训练家提出与你交换卡牌...',
            options: [
                { text: '交换', effect: () => {
                    if (GameState.player.deck.length > 5) {
                        // 移除一张随机卡牌，添加一张新卡牌
                        const randomIndex = Math.floor(Math.random() * GameState.player.deck.length);
                        GameState.player.deck.splice(randomIndex, 1);
                        const newCard = getRandomCardRewards(1)[0];
                        GameState.player.deck.push(newCard);
                        showMessage(`获得 ${newCard.name}!`);
                    }
                }},
                { text: '拒绝', effect: () => { showMessage('你拒绝了交换。'); } }
            ]
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    // 简单的事件处理（可以改进为更复杂的UI）
    const choice = confirm(`${event.name}\n\n${event.description}\n\n选择: ${event.options[0].text}?`);

    if (choice && event.options[0]) {
        event.options[0].effect();
    } else if (event.options[1]) {
        event.options[1].effect();
    }

    setTimeout(() => {
        renderMap();
        updateUI();
    }, 1500);
}

// 处理宝箱节点
function handleTreasureNode() {
    const gold = getRandomGold(20, 50);
    GameState.player.gold += gold;

    showMessage(`发现宝箱! 获得 ${gold} 金币!`);

    // 有几率获得随机卡牌
    if (Math.random() < 0.5) {
        const card = getRandomCardRewards(1, { minRarity: 'uncommon' })[0];
        GameState.player.deck.push(card);
        showMessage(`还发现了 ${card.name} 卡牌!`);
    }

    setTimeout(() => {
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

    // 商店物品
    const shopItems = [
        ...getRandomCardRewards(3, { minRarity: 'uncommon' }),
        { id: 'potion-shop', name: '伤药', type: 'item', cost: 50, description: '恢复 20 HP', effect: () => healPlayer(20) },
        { id: 'energy-shop', name: '能量饮料', type: 'item', cost: 75, description: '永久 +1 能量上限', effect: () => { GameState.battle.maxEnergy++; showMessage('能量上限提升!'); } }
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
            <div class="card-type">${item.type === 'item' ? '道具' : CARD_TYPES[item.type]}</div>
            <div class="card-description">${item.description}</div>
            <div class="card-cost" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">${item.cost}💰</div>
        `;

        if (GameState.player.gold >= item.cost) {
            itemDiv.addEventListener('click', () => {
                buyShopItem(item);
            });
        } else {
            itemDiv.style.opacity = '0.5';
        }

        container.appendChild(itemDiv);
    }
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

// 显示奖励界面
function showRewardScreen(isElite) {
    showScreen('reward-screen');

    const container = document.getElementById('reward-cards');
    if (!container) return;

    container.innerHTML = '';

    const cards = getRandomCardRewards(3, {
        minRarity: isElite ? 'uncommon' : 'common'
    });

    for (const card of cards) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity} pokemon-card`;

        cardDiv.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${CARD_TYPES[card.type]}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-rarity">${CARD_RARITY[card.rarity]}</div>
        `;

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
