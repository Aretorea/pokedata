/**
 * 图鉴系统
 * 显示已收集的宝可梦、技能、道具、遗物
 */

const PokedexSystem = {
    currentTab: 'pokemon',
    
    // 初始化
    init() {
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents() {
        // 图鉴按钮
        const pokedexBtn = document.getElementById('pokedex-btn');
        if (pokedexBtn) {
            pokedexBtn.addEventListener('click', () => {
                this.show();
            });
        }
        
        // 关闭按钮
        const closeBtn = document.getElementById('close-pokedex-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                showScreen('main-menu');
            });
        }
        
        // 标签切换
        document.querySelectorAll('.pokedex-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },
    
    // 显示图鉴
    show() {
        showScreen('pokedex-screen');
        this.render();
    },
    
    // 切换标签
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新标签样式
        document.querySelectorAll('.pokedex-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
        
        this.render();
    },
    
    // 渲染当前标签内容
    render() {
        const content = document.getElementById('pokedex-content');
        if (!content) return;
        
        content.innerHTML = '';
        
        switch (this.currentTab) {
            case 'pokemon':
                this.renderPokemonPokedex(content);
                break;
            case 'skills':
                this.renderSkillPokedex(content);
                break;
            case 'items':
                this.renderItemPokedex(content);
                break;
            case 'relics':
                this.renderRelicPokedex(content);
                break;
        }
    },
    
    // 渲染宝可梦图鉴
    renderPokemonPokedex(container) {
        // 统计
        const allPokemon = this.getAllPokemon();
        const collected = this.getCollectedPokemon();
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'pokedex-stats';
        statsDiv.innerHTML = `已收集: ${collected.length} / ${allPokemon.length}`;
        container.appendChild(statsDiv);
        
        // 列表
        for (const pokemon of allPokemon) {
            const isCollected = collected.some(p => p.id === pokemon.id);
            const itemDiv = document.createElement('div');
            itemDiv.className = `pokedex-item ${isCollected ? 'collected' : 'uncollected'}`;
            
            const typesHtml = pokemon.types ? pokemon.types.map(t => 
                `<span class="type-badge type-${t}" style="font-size: 10px;">${getTypeName ? getTypeName(t) : t}</span>`
            ).join(' ') : '';
            
            itemDiv.innerHTML = `
                <div class="pokedex-item-sprite">${pokemon.sprite || '❓'}</div>
                <div class="pokedex-item-name">${pokemon.name}</div>
                <div style="margin: 5px 0;">${typesHtml}</div>
                <div class="pokedex-item-info">${isCollected ? '✓ 已收集' : '? 未发现'}</div>
            `;
            
            container.appendChild(itemDiv);
        }
    },
    
    // 渲染技能图鉴
    renderSkillPokedex(container) {
        const allSkills = this.getAllSkills();
        const collectedIds = this.getCollectedSkillIds();
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'pokedex-stats';
        statsDiv.innerHTML = `已收集: ${collectedIds.length} / ${allSkills.length}`;
        container.appendChild(statsDiv);
        
        for (const skill of allSkills) {
            const isCollected = collectedIds.includes(skill.id);
            const itemDiv = document.createElement('div');
            itemDiv.className = `pokedex-item ${isCollected ? 'collected' : 'uncollected'}`;
            
            const typeHtml = skill.pokemonType ? 
                `<span class="type-badge type-${skill.pokemonType}" style="font-size: 10px;">${getTypeName ? getTypeName(skill.pokemonType) : skill.pokemonType}</span>` : '';
            
            itemDiv.innerHTML = `
                <div style="font-size: 12px; color: #ffcb05;">⚡${skill.cost}</div>
                <div class="pokedex-item-name">${skill.name}</div>
                <div style="margin: 5px 0;">${typeHtml}</div>
                <div class="pokedex-item-info" style="font-size: 10px;">${skill.description || ''}</div>
                <div style="font-size: 10px; color: ${isCollected ? '#4caf50' : '#666'};">${isCollected ? '✓' : '?'}</div>
            `;
            
            container.appendChild(itemDiv);
        }
    },
    
    // 渲染道具图鉴
    renderItemPokedex(container) {
        const allItems = typeof ITEM_CARDS_DATA !== 'undefined' ? ITEM_CARDS_DATA : [];
        const collectedIds = this.getCollectedItemIds();
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'pokedex-stats';
        statsDiv.innerHTML = `已收集: ${collectedIds.length} / ${allItems.length}`;
        container.appendChild(statsDiv);
        
        for (const item of allItems) {
            const isCollected = collectedIds.includes(item.id);
            const itemDiv = document.createElement('div');
            itemDiv.className = `pokedex-item ${isCollected ? 'collected' : 'uncollected'}`;
            
            itemDiv.innerHTML = `
                <div class="pokedex-item-sprite">${item.sprite || '📦'}</div>
                <div class="pokedex-item-name">${item.name}</div>
                <div class="pokedex-item-info" style="font-size: 10px;">${item.description || ''}</div>
                <div style="font-size: 10px; color: ${isCollected ? '#4caf50' : '#666'};">${isCollected ? '✓' : '?'}</div>
            `;
            
            container.appendChild(itemDiv);
        }
    },
    
    // 渲染遗物图鉴
    renderRelicPokedex(container) {
        const allRelics = this.getAllRelics();
        const collectedIds = this.getCollectedRelicIds();
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'pokedex-stats';
        statsDiv.innerHTML = `已收集: ${collectedIds.length} / ${allRelics.length}`;
        container.appendChild(statsDiv);
        
        // 显示套装进度
        if (typeof RELIC_SETS !== 'undefined') {
            for (const [setId, setData] of Object.entries(RELIC_SETS)) {
                const completed = collectedIds.includes(setData.reward.id);
                const owned = setData.requiredRelics.filter(id => collectedIds.includes(id)).length;
                
                const progressDiv = document.createElement('div');
                progressDiv.className = 'set-progress';
                progressDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #9c27b0;">🎁 ${setData.name}</span>
                        <span style="color: #aaa; font-size: 12px;">${owned}/${setData.requiredRelics.length}</span>
                    </div>
                    <div class="set-progress-bar">
                        <div class="set-progress-fill" style="width: ${(owned / setData.requiredRelics.length) * 100}%"></div>
                    </div>
                    <div style="font-size: 11px; color: ${completed ? '#4caf50' : '#aaa'};">
                        ${completed ? '✓ 已完成' : `奖励: ${setData.reward.name}`}
                    </div>
                `;
                container.appendChild(progressDiv);
            }
        }
        
        // 显示所有遗物
        for (const relic of allRelics) {
            const isCollected = collectedIds.includes(relic.id);
            const itemDiv = document.createElement('div');
            itemDiv.className = `pokedex-item ${isCollected ? 'collected' : 'uncollected'}`;
            
            const rarityColor = RELIC_RARITY && RELIC_RARITY[relic.rarity] ? 
                RELIC_RARITY[relic.rarity].color : '#9e9e9e';
            
            itemDiv.innerHTML = `
                <div class="pokedex-item-sprite">${relic.sprite || '💎'}</div>
                <div class="pokedex-item-name">${relic.name}</div>
                <div style="color: ${rarityColor}; font-size: 10px; margin: 3px 0;">
                    ${RELIC_RARITY && RELIC_RARITY[relic.rarity] ? RELIC_RARITY[relic.rarity].name : relic.rarity}
                </div>
                <div class="pokedex-item-info" style="font-size: 9px;">${relic.description || ''}</div>
                <div style="font-size: 10px; color: ${isCollected ? '#4caf50' : '#666'};">${isCollected ? '✓' : '?'}</div>
            `;
            
            container.appendChild(itemDiv);
        }
    },
    
    // 获取所有宝可梦
    getAllPokemon() {
        const all = [];
        if (typeof POKEMON_DATA !== 'undefined') {
            if (POKEMON_DATA.obtainable) all.push(...POKEMON_DATA.obtainable);
            if (POKEMON_DATA.starters) all.push(...POKEMON_DATA.starters);
        }
        return all;
    },
    
    // 获取已收集的宝可梦
    getCollectedPokemon() {
        // 从游戏状态获取当前拥有的宝可梦
        if (typeof GameState !== 'undefined' && GameState.player && GameState.player.pokemonCards) {
            return GameState.player.pokemonCards.map(card => card.pokemonData || card).filter(p => p);
        }
        return [];
    },
    
    // 获取所有技能
    getAllSkills() {
        const skills = [];
        if (typeof CARDS_DATA !== 'undefined') {
            if (CARDS_DATA.obtainable) skills.push(...CARDS_DATA.obtainable);
            if (CARDS_DATA.starter) skills.push(...CARDS_DATA.starter);
        }
        return skills;
    },
    
    // 获取已收集的技能ID
    getCollectedSkillIds() {
        if (typeof GameState !== 'undefined' && GameState.player && GameState.player.deck) {
            return GameState.player.deck.filter(c => !c.isPokemonCard && c.type !== 'item').map(c => c.id);
        }
        return [];
    },
    
    // 获取已收集的道具ID
    getCollectedItemIds() {
        if (typeof GameState !== 'undefined' && GameState.player && GameState.player.deck) {
            return GameState.player.deck.filter(c => c.type === 'item').map(c => c.id);
        }
        return [];
    },
    
    // 获取所有遗物
    getAllRelics() {
        const all = [];
        if (typeof RELICS_DATA !== 'undefined') {
            for (const relics of Object.values(RELICS_DATA)) {
                all.push(...relics);
            }
        }
        if (typeof POKEMON_RELICS !== 'undefined') {
            all.push(...POKEMON_RELICS);
        }
        if (typeof RELIC_SETS !== 'undefined') {
            for (const setData of Object.values(RELIC_SETS)) {
                all.push(setData.reward);
            }
        }
        return all;
    },
    
    // 获取已收集的遗物ID
    getCollectedRelicIds() {
        if (typeof GameState !== 'undefined' && GameState.player && GameState.player.relics) {
            return GameState.player.relics.map(r => r.id);
        }
        return [];
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    PokedexSystem.init();
});
