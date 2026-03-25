/**
 * Boss战斗修复补丁
 * 解决Boss战斗胜利后无法进入下一层的问题
 */

// 在endBattle函数中添加调试日志
function debugEndBattle(victory) {
    const enemy = GameState.battle.enemy;
    console.log('=== 调试信息 ===');
    console.log('战斗结束, 胜利:', victory);
    console.log('敌人:', enemy ? enemy.name : 'null');
    console.log('是否Boss:', enemy ? enemy.isBoss : false);
    console.log('当前层:', GameState.progress.currentFloor);
    console.log('最大层数:', GameState.progress.maxFloors);
    console.log('================');
}

// 确保Boss战斗胜利后正确处理
function fixBossBattleEnd() {
    // 检查是否有战斗正在进行
    if (!GameState.battle.enemy) {
        console.log('没有正在进行的战斗');
        return;
    }
    
    const enemy = GameState.battle.enemy;
    
    // 如果是Boss且已经击败
    if (enemy.isBoss && enemy.currentHp <= 0) {
        console.log('Boss已被击败，准备进入下一层');
        
        // 停止战斗
        GameState.battle.inBattle = false;
        
        // 清理战斗状态
        GameState.player.hand = [];
        GameState.player.drawPile = [];
        GameState.player.discardPile = [];
        GameState.player.shield = 0;
        
        // 增加金币
        const goldReward = getRandomGold(enemy.goldReward[0], enemy.goldReward[1]);
        GameState.player.gold += goldReward;
        GameState.stats.enemiesDefeated++;
        
        showMessage(`战斗胜利! 获得 ${goldReward} 金币!`);
        
        // 检查是否通关
        if (GameState.progress.currentFloor >= GameState.progress.maxFloors) {
            setTimeout(() => gameVictory(), 1500);
            return;
        }
        
        // 进入下一层
        GameState.stats.floorsCleared = GameState.progress.currentFloor;
        GameState.progress.currentFloor++;
        GameState.progress.currentNode = null;
        GameState.progress.completedNodes = [];
        
        // 生成新地图
        console.log('生成第', GameState.progress.currentFloor, '层地图');
        const newMap = generateMap();
        GameState.progress.map = newMap;
        
        // 确保第一个节点可用
        if (newMap[0] && newMap[0][0]) {
            newMap[0][0].available = true;
            newMap[0][0].completed = false;
            console.log('第一层第一个节点已设置为可用');
        }
        
        // 恢复HP
        const healAmount = Math.floor(GameState.player.maxHp * 0.2);
        GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + healAmount);
        
        // 延迟后显示地图
        setTimeout(() => {
            console.log('显示地图界面');
            showScreen('map-screen');
            renderMap();
            updateUI();
            showMessage(`进入第 ${GameState.progress.currentFloor} 层! 恢复 ${healAmount} HP`);
        }, 1500);
    }
}

console.log('Boss战斗修复补丁已加载');
