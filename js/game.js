/**
 * 游戏主控制模块
 * 负责游戏状态管理、初始化和主要流程控制
 */

// 游戏状态
const GameState = {
    // 玩家状态
    player: {
        hp: 80,
        maxHp: 80,
        gold: 0,
        shield: 0,
        pokemon: null,  // 当前宝可梦
        deck: [],       // 完整牌组
        hand: [],       // 手牌
        drawPile: [],   // 抽牌堆
        discardPile: [],// 弃牌堆
        exhaustPile: [],// 消耗堆
        statusEffects: [] // 状态效果
    },

    // 游戏进度
    progress: {
        currentFloor: 1,
        maxFloors: 3,
        currentNode: null,
        completedNodes: [],
        map: []
    },

    // 战斗状态
    battle: {
        inBattle: false,
        turn: 0,
        enemy: null,
        energy: 3,
        maxEnergy: 3
    },

    // 统计数据
    stats: {
        enemiesDefeated: 0,
        cardsPlayed: 0,
        damageDealt: 0,
        damageTaken: 0,
        floorsCleared: 0
    },

    // 角色信息
    character: null,

    // 游戏设置
    settings: {
        soundEnabled: true,
        animationsEnabled: true
    }
};

// 初始化游戏
function initGame() {
    console.log('宝可梦塔 - 游戏初始化...');

    // 绑定UI事件
    bindEvents();

    // 显示主菜单
    showScreen('main-menu');
}

// 绑定事件监听器
function bindEvents() {
    // 主菜单按钮
    document.getElementById('start-game-btn').addEventListener('click', () => {
        showScreen('character-select');
        renderCharacterSelect();
    });

    document.getElementById('how-to-play-btn').addEventListener('click', () => {
        showScreen('how-to-play-screen');
    });

    document.getElementById('close-how-to-play-btn').addEventListener('click', () => {
        showScreen('main-menu');
    });

    // 角色选择返回按钮
    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        showScreen('main-menu');
    });

    // 地图界面按钮
    document.getElementById('view-deck-btn').addEventListener('click', () => {
        showDeckView();
    });

    document.getElementById('close-deck-btn').addEventListener('click', () => {
        showScreen('map-screen');
    });

    // 战斗界面按钮
    document.getElementById('end-turn-btn').addEventListener('click', () => {
        endTurn();
    });

    // 奖励界面按钮
    document.getElementById('skip-reward-btn').addEventListener('click', () => {
        handleRewardSkipped();
    });

    // 商店界面按钮
    document.getElementById('leave-shop-btn').addEventListener('click', () => {
        leaveShop();
    });

    // 游戏结束按钮
    document.getElementById('main-menu-btn').addEventListener('click', () => {
        resetGame();
        showScreen('main-menu');
    });
}

// 开始新游戏
function startNewGame(characterId) {
    const character = getCharacterById(characterId);
    if (!character) {
        console.error('角色不存在:', characterId);
        return;
    }

    // 设置角色
    GameState.character = character;

    // 初始化玩家状态
    GameState.player.hp = character.startingHp;
    GameState.player.maxHp = character.startingHp;
    GameState.player.gold = character.startingGold;
    GameState.player.shield = 0;
    GameState.player.statusEffects = [];

    // 创建初始牌组
    GameState.player.deck = character.startingDeck.map(cardId => getCardById(cardId)).filter(c => c);
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

    // 生成地图
    GameState.progress.map = generateMap();

    // 显示地图
    showScreen('map-screen');
    renderMap();
    updateUI();

    console.log('游戏开始! 角色:', character.name);
}

// 重置游戏
function resetGame() {
    GameState.player = {
        hp: 80,
        maxHp: 80,
        gold: 0,
        shield: 0,
        pokemon: null,
        deck: [],
        hand: [],
        drawPile: [],
        discardPile: [],
        exhaustPile: [],
        statusEffects: []
    };

    GameState.progress = {
        currentFloor: 1,
        maxFloors: 3,
        currentNode: null,
        completedNodes: [],
        map: []
    };

    GameState.battle = {
        inBattle: false,
        turn: 0,
        enemy: null,
        energy: 3,
        maxEnergy: 3
    };

    GameState.stats = {
        enemiesDefeated: 0,
        cardsPlayed: 0,
        damageDealt: 0,
        damageTaken: 0,
        floorsCleared: 0
    };

    GameState.character = null;
}

// 显示指定屏幕
function showScreen(screenId) {
    // 隐藏所有屏幕
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // 显示目标屏幕
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// 洗牌
function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 抽牌
function drawCards(count) {
    const drawn = [];

    for (let i = 0; i < count; i++) {
        // 如果抽牌堆为空，重置弃牌堆
        if (GameState.player.drawPile.length === 0) {
            if (GameState.player.discardPile.length === 0) {
                break; // 没有牌可抽
            }
            GameState.player.drawPile = shuffleDeck(GameState.player.discardPile);
            GameState.player.discardPile = [];
        }

        const card = GameState.player.drawPile.pop();
        drawn.push(card);
        GameState.player.hand.push(card);
    }

    updateUI();
    return drawn;
}

// 获取随机金币
function getRandomGold(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 游戏胜利
function gameVictory() {
    const stats = GameState.stats;

    document.getElementById('game-over-title').textContent = '胜利!';
    document.getElementById('game-over-message').textContent =
        `恭喜你成功登顶宝可梦塔!`;

    document.getElementById('run-stats').innerHTML = `
        <p>击败敌人: ${stats.enemiesDefeated}</p>
        <p>打出卡牌: ${stats.cardsPlayed}</p>
        <p>造成伤害: ${stats.damageDealt}</p>
        <p>通关层数: ${stats.floorsCleared + 1}</p>
    `;

    showScreen('game-over-screen');
}

// 游戏失败
function gameOver() {
    const stats = GameState.stats;

    document.getElementById('game-over-title').textContent = '游戏结束';
    document.getElementById('game-over-message').textContent =
        `你在第 ${GameState.progress.currentFloor} 层倒下了...`;

    document.getElementById('run-stats').innerHTML = `
        <p>击败敌人: ${stats.enemiesDefeated}</p>
        <p>打出卡牌: ${stats.cardsPlayed}</p>
        <p>造成伤害: ${stats.damageDealt}</p>
        <p>到达层数: ${GameState.progress.currentFloor}</p>
    `;

    showScreen('game-over-screen');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGame);
