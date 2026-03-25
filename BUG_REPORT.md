# 代码问题检查报告

## 发现的潜在问题

### 1. 🔴 严重问题 - 角色选择流程缺失

**位置**: `js/game.js` 第124行 `startNewGame` 函数

**问题描述**: 
- 当前代码直接调用 `getCharacterById(characterId)` 获取角色数据
- 但 `renderCharacterSelect` 函数实际上是让用户选择宝可梦，而非角色
- 点击宝可梦后会调用 `selectStarterPokemon`，然后再调用 `startNewGame('trainer-red')`
- 这意味着角色选择界面没有实际选择角色的功能

**影响**: 
- 角色选择按钮无响应或功能混乱
- 用户无法选择不同角色开始游戏

**修复建议**:
```javascript
// 方案A: 简化角色选择，直接让用户选择宝可梦开始
function startNewGameWithPokemon(pokemon) {
    GameState.player.pokemon = {...pokemon};
    // 使用默认角色"赤红"
    startNewGame('trainer-red');
}

// 方案B: 先选角色，再选宝可梦
// 需要重新设计角色选择流程
```

---

### 2. 🟡 中等问题 - 初始牌组卡牌引用可能失败

**位置**: `js/game.js` 第142行

**问题描述**:
```javascript
GameState.player.deck = character.startingDeck.map(cardId => getCardById(cardId)).filter(c => c);
```
- 如果 `getCardById` 返回 `null`，会被过滤掉
- 但没有提示用户哪些卡牌加载失败
- 可能导致牌组太小或战斗不平衡

**影响**: 如果卡牌数据加载失败，牌组可能为空

**修复建议**:
```javascript
GameState.player.deck = character.startingDeck.map(cardId => {
    const card = getCardById(cardId);
    if (!card) {
        console.warn(`无法找到卡牌: ${cardId}`);
    }
    return card;
}).filter(c => c);

// 检查牌组大小
if (GameState.player.deck.length < 5) {
    console.error('牌组太小，添加基础卡牌');
    GameState.player.deck.push(...createStarterDeck());
}
```

---

### 3. 🟡 中等问题 - 宝可梦进化系统未初始化

**位置**: `data/pokemon-data.js`

**问题描述**:
- `evolutionProgress` 属性在宝可梦数据中定义，但从未在游戏初始化时设置
- 进化触发时可能因为属性未初始化而出错

**影响**: 进化功能可能无法正常工作

**修复建议**:
```javascript
// 在选择宝可梦时初始化进化进度
function selectStarterPokemon(pokemon) {
    GameState.player.pokemon = {
        ...pokemon,
        evolutionProgress: 0  // 确保初始化
    };
    // ...
}
```

---

### 4. 🟡 中等问题 - 状态效果持续时间减少时机错误

**位置**: `js/battle.js` 第79-81行

**问题描述**:
```javascript
// 减少状态持续时间（回合结束时减少）
decreaseStatusDurations(GameState.player);
decreaseStatusDurations(GameState.battle.enemy);
```
- 这段代码在 `startTurn` 中调用，但注释说是"回合结束时减少"
- 应该在 `endTurn` 中调用，或者修改注释

**影响**: 状态效果持续时间可能比预期少一回合

**修复建议**:
将这段代码移到 `endTurn` 函数中，或修改注释说明。

---

### 5. 🟢 低风险 - 敌人意图渲染可能为空

**位置**: `js/ui.js` 第35-50行 `renderEnemyIntent` 函数

**问题描述**:
- 如果 `move` 为 `null`，函数会返回，不显示任何内容
- 这是正确的处理，但缺少默认状态显示

**影响**: 用户可能不知道敌人下一步会做什么

**修复建议**:
```javascript
function renderEnemyIntent(move) {
    const intentContainer = document.getElementById('enemy-intent');
    if (!intentContainer) return;

    if (!move) {
        intentContainer.innerHTML = '<span style="color: #888;">思考中...</span>';
        return;
    }
    // ...
}
```

---

### 6. 🟢 低风险 - 商店物品重复点击问题

**位置**: `js/map.js` 第562行

**问题描述**:
```javascript
itemDiv.addEventListener('click', () => {
    buyShopItem(item);
});
```
- 购买后商店会重新渲染，但事件监听器绑定在旧元素上
- 由于使用 `container.innerHTML = ''` 清空容器，这实际上是安全的

**影响**: 无明显问题，当前实现是正确的

---

### 7. 🟢 低风险 - 抽牌堆为空且弃牌堆为空时的处理

**位置**: `js/game.js` 第246-249行

**问题描述**:
```javascript
if (GameState.player.drawPile.length === 0) {
    if (GameState.player.discardPile.length === 0) {
        break; // 没有牌可抽
    }
    // ...
}
```
- 这是正确的处理，但可能导致玩家无法抽满5张牌
- 没有任何提示告知用户牌已抽完

**影响**: 极端情况下（牌组小于5张），用户可能困惑为何手牌不足

**修复建议**:
```javascript
if (GameState.player.drawPile.length === 0) {
    if (GameState.player.discardPile.length === 0) {
        console.log('牌组已空，无法继续抽牌');
        break;
    }
    // ...
}
```

---

### 8. 🟢 低风险 - createSkillCard 函数语法错误

**位置**: `js/ui.js` 第203-209行

**问题描述**:
```javascript
} else if (skill.effect === 'freeze') {
    card.description += ' 有概率使敌人麻痹。');  // 语法错误：多了右括号
    card.effects.push({ type: 'applyStatus', status: 'paralysis', chance: 0.3 });
}
```
- 括号不匹配，会导致JavaScript语法错误
- 逻辑上也应该是冰冻效果而非麻痹

**影响**: 代码无法正常执行

**修复建议**:
```javascript
} else if (skill.effect === 'freeze') {
    card.description += ' 有概率使敌人冰冻。';
    card.effects.push({ type: 'applyStatus', status: 'freeze', chance: 0.3 });
}
```

---

### 9. 🟡 中等问题 - 移除卡牌对话框中的索引问题

**位置**: `js/map.js` 第628-629行

**问题描述**:
```javascript
cardDiv.addEventListener('click', () => {
    GameState.player.deck.splice(i, 1);
    // ...
});
```
- 使用闭包捕获变量 `i`
- 当用户点击时，`i` 的值已经是循环结束后的值
- 这会导致移除错误的卡牌或索引越界

**影响**: 点击任何卡牌都可能移除错误的卡牌

**修复建议**:
```javascript
for (let i = 0; i < GameState.player.deck.length; i++) {
    const card = GameState.player.deck[i];
    const cardIndex = i;  // 捕获当前索引
    
    cardDiv.addEventListener('click', () => {
        GameState.player.deck.splice(cardIndex, 1);
        showMessage(`移除了 ${card.name}!`);
        overlay.remove();
        renderShop();
        updateUI();
    });
}
```

---

## 总结

### 需要立即修复的问题:
1. ✅ 角色选择流程混乱
2. ✅ createSkillCard 函数语法错误
3. ✅ 移除卡牌对话框索引问题

### 建议优化的问题:
4. 初始牌组验证
5. 进化进度初始化
6. 状态效果时机处理

### 低优先级问题:
7. 敌人意图默认显示
8. 抽牌提示

---

## 修复状态

- [x] 已创建本报告
- [ ] 待修复关键问题
