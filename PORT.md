# 宝可梦塔 (Pokemon Tower) - 项目移植包

## 项目简介

这是一款融合杀戮尖塔的DBG玩法与宝可梦世界观的Roguelike卡牌游戏。

**游戏预览**: 运行 `index.html` 或使用本地服务器

## 当前开发进度 (MVP v0.1)

### 已完成功能

| 模块 | 状态 | 说明 |
|------|------|------|
| 战斗系统 | 完成 | 回合制、能量管理、手牌操作 |
| 宝可梦系统 | 完成 | 属性克制、状态异常、技能 |
| 卡牌系统 | 完成 | 4种卡牌类型、稀有度、奖励 |
| 地图系统 | 完成 | 随机生成、多节点类型 |
| UI系统 | 完成 | 主菜单、战斗界面、地图界面 |

### 待开发功能

| 优先级 | 功能 | 说明 |
|--------|------|------|
| 高 | 进化系统 | 战斗中即时进化宝可梦 |
| 高 | 更多卡牌/宝可梦 | 丰富游戏内容 |
| 中 | 商店系统 | 完整的购买/出售功能 |
| 中 | 遗物系统 | 永久被动效果 |
| 中 | 多角色解锁 | 角色解锁条件 |
| 低 | 存档系统 | 保存游戏进度 |
| 低 | 音效/动画 | 提升游戏体验 |

## 技术架构

纯前端项目，无需后端

```
├── HTML5 + CSS3 + JavaScript
├── 无框架依赖
├── 数据存储在JS文件中
└── 可直接浏览器运行
```

## 开发指南

### 如何继续开发

- **添加新宝可梦**: 编辑 `data/pokemon-data.js`
- **添加新卡牌**: 编辑 `data/cards-data.js`
- **添加新敌人**: 编辑 `data/enemies-data.js`
- **修改战斗逻辑**: 编辑 `js/battle.js`
- **修改UI**: 编辑 `styles.css` 和 `js/ui.js`

### 建议的开发顺序

1. 完善进化系统
2. 增加卡牌和宝可梦数量
3. 实现完整的商店系统
4. 添加遗物系统
5. 优化UI和动画效果

## 关键代码说明

### 属性克制计算

```javascript
// 在 pokemon-data.js 中
function getTypeEffectiveness(attackType, defenderTypes) {
    let multiplier = 1;
    for (const defenderType of defenderTypes) {
        if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defenderType] !== undefined) {
            multiplier *= TYPE_EFFECTIVENESS[attackType][defenderType];
        }
    }
    return multiplier;
}
```

### 战斗流程

```javascript
// 在 battle.js 中
// 1. startBattle() - 初始化战斗
// 2. startTurn() - 开始回合(抽牌、恢复能量)
// 3. playCard() - 打出卡牌
// 4. endTurn() - 结束回合(敌人行动)
```

### 卡牌效果系统

```javascript
// 在 cards-data.js 中定义效果类型:
// - damage: 造成伤害
// - block: 获得护盾
// - heal: 恢复HP
// - attachEnergy: 贴附能量
// - draw: 抽牌
// - cureStatus: 治愈状态
```

## 文件清单

```
/workspace/pokemon-tower/
├── index.html                 # 主页面
├── styles.css                 # 样式
├── game-design-document.md    # 设计文档
├── PORT.md                    # 本文件(移植包说明)
├── data/
│   ├── pokemon-data.js        # 宝可梦数据
│   ├── cards-data.js          # 卡牌数据
│   ├── enemies-data.js        # 敌人数据
│   └── characters-data.js     # 角色数据
└── js/
    ├── game.js                # 游戏主控制
    ├── battle.js              # 战斗系统
    ├── map.js                 # 地图系统
    └── ui.js                  # UI控制
```

## 给新对话的提示词

在新对话中，您可以使用以下提示词继续开发：

```
我有一个宝可梦杀戮尖塔like卡牌游戏项目，位于 /workspace/pokemon-tower/
请帮我继续开发以下功能：
[具体描述您想要添加的功能]
```

或者：

```
请查看 /workspace/pokemon-tower/PORT.md 了解项目详情，帮我继续开发这个游戏。
```

## 游戏设计文档摘要

详见 `game-design-document.md`

### 核心玩法

- **卡牌构筑(DBG)**: 战斗获取卡牌，优化牌组
- **Roguelike**: 随机地图、永久死亡
- **宝可梦元素**: 属性克制、进化、状态异常

### 创新点

- 宝可梦作为"活卡牌"，有HP、属性、技能
- 双资源系统：能量点(回合) + 能量卡(累积)
- 18种属性克制网络
- 战斗中即时进化
