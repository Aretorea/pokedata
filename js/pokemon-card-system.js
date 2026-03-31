/**
 * 宝可梦变身牌系统
 * 负责宝可梦牌的管理、变身机制和特殊效果
 */

// 宝可梦牌组管理
const PokemonCardSystem = {
    // 最大宝可梦数量
    MAX_POKEMON: 6,
    
    // 当前激活的宝可梦（战斗中）
    activePokemon: null,
    
    // 暂时离场的宝可梦（使用后）
    benchedPokemon: null,
    
    /**
     * 初始化宝可梦牌组
     */
    init() {
        // 只在未初始化时才初始化
        if (!GameState.player.pokemonCards) {
            GameState.player.pokemonCards = [];
        }
        this.activePokemon = null;
        this.benchedPokemon = null;
    },
    
    /**
     * 添加宝可梦到牌组
     * @param {Object} pokemon - 宝可梦数据
     * @returns {boolean} 是否成功添加
     */
    addPokemon(pokemon) {
        if (!pokemon) return false;
        
        // 检查是否已满
        if (GameState.player.pokemonCards.length >= this.MAX_POKEMON) {
            showMessage('宝可梦牌组已满！(最多6只)');
            return false;
        }
        
        // 检查是否已存在
        if (GameState.player.pokemonCards.some(p => p.id === pokemon.id)) {
            showMessage('这只宝可梦已经在你的牌组中！');
            return false;
        }
        
        // 创建宝可梦变身牌
        const pokemonCard = this.createPokemonCard(pokemon);
        GameState.player.pokemonCards.push(pokemonCard);
        
        // 同时添加到主牌组
        GameState.player.deck.push(pokemonCard);
        
        showMessage(`${pokemon.name} 加入了队伍！`);
        return true;
    },
    
    /**
     * 创建宝可梦变身牌
     * @param {Object} pokemon - 宝可梦数据
     * @returns {Object} 卡牌对象
     */
    createPokemonCard(pokemon) {
        const card = {
            id: `pokemon-${pokemon.id}`,
            name: pokemon.name,
            type: 'transform',  // 变身牌类型
            cost: 1,
            rarity: 'pokemon',
            pokemonType: pokemon.types ? pokemon.types[0] : 'normal',
            isPokemonCard: true,
            pokemonData: { ...pokemon },
            description: this.generateDescription(pokemon),
            effects: [
                { type: 'transform', pokemon: pokemon }
            ]
        };
        
        return card;
    },
    
    /**
     * 生成宝可梦牌描述
     */
    generateDescription(pokemon) {
        let desc = `变身成 ${pokemon.name}`;
        
        if (pokemon.skills && pokemon.skills.length > 0) {
            const skillNames = pokemon.skills.map(s => s.name).join('、');
            desc += `\n技能：${skillNames}`;
        }
        
        // 添加特性描述
        if (pokemon.ability) {
            desc += `\n特性：${pokemon.ability.name}`;
        }
        
        return desc;
    },
    
    /**
     * 移除宝可梦
     */
    removePokemon(pokemonId) {
        const index = GameState.player.pokemonCards.findIndex(p => p.id === pokemonId);
        if (index >= 0) {
            const removed = GameState.player.pokemonCards.splice(index, 1)[0];
            
            // 同时从主牌组移除
            const deckIndex = GameState.player.deck.findIndex(c => c.id === removed.id);
            if (deckIndex >= 0) {
                GameState.player.deck.splice(deckIndex, 1);
            }
            
            return removed;
        }
        return null;
    },
    
    /**
     * 使用宝可梦牌（变身）
     * @param {Object} card - 宝可梦卡牌
     */
    usePokemonCard(card) {
        if (!card.isPokemonCard || !card.pokemonData) return false;
        
        // 如果已有激活的宝可梦，将其放入候补
        if (this.activePokemon) {
            this.benchedPokemon = this.activePokemon;
            showMessage(`${this.benchedPokemon.name} 暂时离场`);
        }
        
        // 激活新的宝可梦
        this.activePokemon = card.pokemonData;
        GameState.player.activePokemon = this.activePokemon;
        
        // 应用宝可梦效果
        this.applyPokemonEffects(card.pokemonData);
        
        showMessage(`${card.pokemonData.name} 登场！`);
        
        // 从手牌移除（暂时离场）
        return { remove: true, pokemon: card.pokemonData };
    },
    
    /**
     * 应用宝可梦效果
     */
    applyPokemonEffects(pokemon) {
        // 更新玩家精灵显示
        const playerSprite = document.getElementById('player-sprite');
        if (playerSprite) {
            playerSprite.textContent = pokemon.sprite || '👤';
        }
        
        // 更新玩家名称显示
        const playerNameEl = document.getElementById('player-pokemon-name');
        if (playerNameEl) {
            playerNameEl.textContent = pokemon.name;
        }
        
        // 应用属性加成
        if (pokemon.types && pokemon.types.length > 0) {
            GameState.player.currentType = pokemon.types[0];
        }
        
        // 更新激活指示器
        this.updateActiveIndicator(pokemon);
    },
    
    /**
     * 更新激活指示器
     */
    updateActiveIndicator(pokemon) {
        const indicator = document.getElementById('active-pokemon-indicator');
        if (!indicator) return;
        
        indicator.style.display = 'block';
        indicator.innerHTML = `
            <div class="active-pokemon-badge">
                <span>${pokemon.sprite || '👤'}</span>
                <span>${pokemon.name}</span>
            </div>
        `;
    },
    
    /**
     * 回合结束时处理
     */
    onTurnEnd() {
        // 如果有候补宝可梦，将其返回手牌
        if (this.benchedPokemon) {
            const card = this.createPokemonCard(this.benchedPokemon);
            GameState.player.hand.push(card);
            showMessage(`${this.benchedPokemon.name} 回到了手牌！`);
            this.benchedPokemon = null;
        }
    },
    
    /**
     * 战斗结束时重置
     */
    onBattleEnd() {
        this.activePokemon = null;
        this.benchedPokemon = null;
        GameState.player.activePokemon = null;
        
        // 隐藏激活指示器
        const indicator = document.getElementById('active-pokemon-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    },
    
    /**
     * 获取宝可梦数量
     */
    getPokemonCount() {
        return GameState.player.pokemonCards ? GameState.player.pokemonCards.length : 0;
    },
    
    /**
     * 检查是否可以添加更多宝可梦
     */
    canAddPokemon() {
        return this.getPokemonCount() < this.MAX_POKEMON;
    },
    
    /**
     * 获取所有宝可梦牌
     */
    getAllPokemon() {
        return GameState.player.pokemonCards || [];
    },
    
    /**
     * 渲染宝可梦牌组查看界面
     */
    renderPokemonView() {
        const container = document.getElementById('pokemon-view-cards');
        if (!container) return;

        container.innerHTML = '';

        const pokemonCards = this.getAllPokemon();

        // 更新计数
        const countEl = document.getElementById('pokemon-view-count');
        if (countEl) {
            countEl.textContent = pokemonCards.length;
        }

        if (pokemonCards.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888;">还没有宝可梦<br>使用精灵球捕捉吧！</p>';
            return;
        }

        for (let i = 0; i < pokemonCards.length; i++) {
            const card = pokemonCards[i];
            const pokemon = card.pokemonData;
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card pokemon-card';
            cardDiv.draggable = true;
            cardDiv.dataset.index = i;
            cardDiv.style.cursor = 'move';

            // 第一张卡牌添加高亮
            if (i === 0) {
                cardDiv.style.border = '3px solid #4CAF50';
                cardDiv.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
            }

            const typesHtml = pokemon.types ? pokemon.types.map(t =>
                `<span class="type-badge type-${t}">${getTypeName(t)}</span>`
            ).join('') : '';

            cardDiv.innerHTML = `
                <div class="card-cost">${card.cost}</div>
                <div style="position: absolute; top: 5px; right: 5px; font-size: 12px; color: #4CAF50; font-weight: bold;">
                    ${i === 0 ? '⭐ 首发出战' : `#${i + 1}`}
                </div>
                <div class="card-name">${pokemon.name}</div>
                <div class="card-types">${typesHtml}</div>
                <div class="card-type">变身牌</div>
                <div class="card-description">
                    HP: ${pokemon.hp || pokemon.maxHp}<br>
                    ${pokemon.skills ? pokemon.skills.map(s => `${s.name}: ${s.damage ? s.damage + '伤害' : (s.block ? s.block + '护盾' : '')}`).join('<br>') : ''}
                </div>
                <div class="card-rarity">宝可梦</div>
            `;

            // 添加拖拽事件
            cardDiv.addEventListener('dragstart', (e) => this.handleDragStart(e, i));
            cardDiv.addEventListener('dragover', (e) => this.handleDragOver(e));
            cardDiv.addEventListener('drop', (e) => this.handleDrop(e, i));
            cardDiv.addEventListener('dragend', (e) => this.handleDragEnd(e));

            container.appendChild(cardDiv);
        }
    },

    /**
     * 处理拖拽开始
     */
    handleDragStart(e, index) {
        e.dataTransfer.setData('text/plain', index);
        e.target.style.opacity = '0.5';
    },

    /**
     * 处理拖拽经过
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // 添加拖拽悬停效果
        const card = e.target.closest('.pokemon-card');
        if (card) {
            card.style.borderTop = '3px solid #4CAF50';
            card.style.transform = 'scale(1.05)';
        }
    },

    /**
     * 处理拖拽离开
     */
    handleDragLeave(e) {
        const card = e.target.closest('.pokemon-card');
        if (card) {
            card.style.borderTop = '';
            card.style.transform = '';
        }
    },

    /**
     * 处理放置
     */
    handleDrop(e, targetIndex) {
        e.preventDefault();
        
        // 清除悬停效果
        const card = e.target.closest('.pokemon-card');
        if (card) {
            card.style.borderTop = '';
            card.style.transform = '';
        }
        
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (sourceIndex !== targetIndex) {
            this.reorderPokemonCards(sourceIndex, targetIndex);
            this.renderPokemonView(); // 重新渲染
        }
    },

    /**
     * 处理拖拽结束
     */
    handleDragEnd(e) {
        e.target.style.opacity = '1';
        
        // 清除所有可能的悬停效果
        const cards = document.querySelectorAll('.pokemon-card');
        cards.forEach(card => {
            card.style.borderTop = '';
            card.style.transform = '';
        });
    },

    /**
     * 对宝可梦牌进行排序
     * @param {number} fromIndex - 原位置
     * @param {number} toIndex - 目标位置
     */
    reorderPokemonCards(fromIndex, toIndex) {
        if (!GameState.player.pokemonCards) return false;

        const cards = GameState.player.pokemonCards;
        if (fromIndex < 0 || fromIndex >= cards.length) return false;
        if (toIndex < 0 || toIndex >= cards.length) return false;

        // 移动卡牌
        const [card] = cards.splice(fromIndex, 1);
        cards.splice(toIndex, 0, card);

        showMessage('宝可梦顺序已更新！');
        return true;
    },

    /**
     * 获取第一张宝可梦牌
     * @returns {Object|null} 第一张宝可梦牌或null
     */
    getFirstPokemonCard() {
        if (!GameState.player.pokemonCards || GameState.player.pokemonCards.length === 0) {
            return null;
        }
        const card = GameState.player.pokemonCards[0];
        return card || null;  // 确保 null 一致性
    },

    /**
     * 自动使用第一张宝可梦牌变身
     * 在战斗开始时自动调用
     */
    autoTransformOnBattleStart() {
        const firstPokemonCard = this.getFirstPokemonCard();

        if (!firstPokemonCard) {
            console.log('没有宝可梦牌可以自动变身');
            return false;
        }

        console.log('自动变身:', firstPokemonCard.name);

        // 使用宝可梦牌变身
        const result = this.usePokemonCard(firstPokemonCard);
        
        if (!result || result.remove !== true) {
            console.error('变身失败');
            return false;
        }

        // 从牌组中临时移除这张卡（战斗结束后会返回）
        // 将卡牌放到一边，不在抽牌堆中
        const deckIndex = GameState.player.drawPile.findIndex(c => c.id === firstPokemonCard.id);
        if (deckIndex >= 0) {
            GameState.player.drawPile.splice(deckIndex, 1);
        }

        return true;
    }
};


// 初始化
document.addEventListener('DOMContentLoaded', () => {
    PokemonCardSystem.init();
});
