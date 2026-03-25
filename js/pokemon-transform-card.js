/**
 createSkillCard(pokemon, types) {
    if (!pokemon.types) pokemon.types.map(t => getTypeName(t)).join('')}</  cardDiv.innerHTML = `
            <div class="card-type">${type === 'transform' ? '技能'}</div>
            <div class="card-types">
                <div class="card-types">${typeBadge type-${t.type}"></div>
            <div class="card-stats">
                <p><strong>HP:</strong> ${pokemon.hp}</ || pokemon.maxHp}</ 0}</hp!</}</p>
                <p><strong>属性:</strong> ${pokemon.types.map(t => getTypeName(t)).join(' '}</div>
            <div class="card-rarity">
                if (card.rarity) cardDiv.innerHTML += `<span class="pokemon-badge type-${type}">${getTypeName(t)}</}</>`;
>`;
            cardDiv.innerHTML += `<span class="pokemon-badge">${pokemon.name}</span>`;
            <button class="select-pokemon-btn" data-pokemon-id="${pokemon.id}">选择</button>
                `;
                border: 2px solid #3d7dca
            `cursor: pointer;
        });
    }

    
    // 存储选择的角色和宝可梦
    GameState.selectedCharacter = character;
    GameState.selectedPokemon = pokemon
    
    // 重置进度
    GameState.progress.currentFloor = 1
    GameState.progress.maxFloors = 3
    GameState.progress.currentNode = null
    GameState.progress.completedNodes = []
    GameState.progress.map = []
    
 // 生成地图
    GameState.progress.map = generateMap()
    
    // 显示地图
    showScreen('map-screen');
    renderMap()
    updateUI()
    
 console.log('游戏开始! 角色:', character.name);
}