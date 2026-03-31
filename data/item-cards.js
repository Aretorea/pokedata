/**
 * 道具卡系统
 * 道具卡为消耗卡，使用后移出牌库（特殊道具除外）
 */

// 道具类型定义
const ITEM_TYPES = {
    pokeball: { name: '精灵球', category: 'capture', consume: true },
    greatball: { name: '超级球', category: 'capture', consume: true },
    ultraball: { name: '高级球', category: 'capture', consume: true },
    potion: { name: '伤药', category: 'heal', consume: true },
    super_potion: { name: '好伤药', category: 'heal', consume: true },
    hyper_potion: { name: '厉害伤药', category: 'heal', consume: true },
    full_heal: { name: '全复药', category: 'heal', consume: true },
    revive: { name: '复活药', category: 'heal', consume: true },
    
    // 进化石 - 特殊道具，战斗结束后返回牌库
    fire_stone: { name: '火之石', category: 'evolution', consume: false, returnAfterBattle: true },
    water_stone: { name: '水之石', category: 'evolution', consume: false, returnAfterBattle: true },
    thunder_stone: { name: '雷之石', category: 'evolution', consume: false, returnAfterBattle: true },
    moon_stone: { name: '月之石', category: 'evolution', consume: false, returnAfterBattle: true },
    sun_stone: { name: '日之石', category: 'evolution', consume: false, returnAfterBattle: true },
    leaf_stone: { name: '叶之石', category: 'evolution', consume: false, returnAfterBattle: true },
    
    // 超进化石 - 战斗中临时移除，战斗结束后返回
    mega_charizard_x: { name: '喷火龙X超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_charizard_y: { name: '喷火龙Y超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_blastoise: { name: '水箭龟超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_venusaur: { name: '妙蛙花超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_gengar: { name: '耿鬼超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_alakazam: { name: '胡地超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_gyarados: { name: '暴鲤龙超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    mega_garchomp: { name: '烈咬陆鲨超进化石', category: 'mega', consume: false, returnAfterBattle: true },
    
    // 战斗道具
    x_attack: { name: '攻击增强', category: 'battle', consume: true },
    x_defense: { name: '防御增强', category: 'battle', consume: true },
    x_speed: { name: '速度增强', category: 'battle', consume: true },
    guard_spec: { name: '防守强化', category: 'battle', consume: true },
    dire_hit: { name: '要害攻击', category: 'battle', consume: true }
};

// 道具卡数据
const ITEM_CARDS_DATA = [
    // ====== 精灵球类 ======
    {
        id: 'item-pokeball',
        name: '精灵球',
        type: 'item',
        itemType: 'pokeball',
        cost: 1,
        rarity: 'common',
        description: '对敌人使用，尝试捕捉。成功率基于敌人HP百分比。',
        effects: [{ type: 'capture', ballType: 'pokeball' }],
        consume: true,
        sprite: '🔴'
    },
    {
        id: 'item-greatball',
        name: '超级球',
        type: 'item',
        itemType: 'greatball',
        cost: 1,
        rarity: 'uncommon',
        description: '对敌人使用，捕捉成功率更高。',
        effects: [{ type: 'capture', ballType: 'greatball' }],
        consume: true,
        sprite: '🔵'
    },
    {
        id: 'item-ultraball',
        name: '高级球',
        type: 'item',
        itemType: 'ultraball',
        cost: 1,
        rarity: 'rare',
        description: '对敌人使用，捕捉成功率最高。',
        effects: [{ type: 'capture', ballType: 'ultraball' }],
        consume: true,
        sprite: '🟡'
    },
    
    // ====== 伤药类 ======
    {
        id: 'item-potion',
        name: '伤药',
        type: 'item',
        itemType: 'potion',
        cost: 0,
        rarity: 'common',
        description: '恢复 15 HP。',
        effects: [{ type: 'heal', value: 15 }],
        consume: true,
        sprite: '💊'
    },
    {
        id: 'item-super-potion',
        name: '好伤药',
        type: 'item',
        itemType: 'super_potion',
        cost: 0,
        rarity: 'uncommon',
        description: '恢复 30 HP。',
        effects: [{ type: 'heal', value: 30 }],
        consume: true,
        sprite: '💊'
    },
    {
        id: 'item-hyper-potion',
        name: '厉害伤药',
        type: 'item',
        itemType: 'hyper_potion',
        cost: 1,
        rarity: 'rare',
        description: '恢复 50 HP。',
        effects: [{ type: 'heal', value: 50 }],
        consume: true,
        sprite: '💊'
    },
    {
        id: 'item-full-heal',
        name: '全复药',
        type: 'item',
        itemType: 'full_heal',
        cost: 1,
        rarity: 'rare',
        description: '恢复所有HP并治愈状态异常。',
        effects: [
            { type: 'fullHeal' },
            { type: 'cureStatus' }
        ],
        consume: true,
        sprite: '💊'
    },
    
    // ====== 进化石（成功后消失，失败后本战斗不出现） ======
    {
        id: 'item-fire-stone',
        name: '火之石',
        type: 'item',
        itemType: 'fire_stone',
        cost: 1,
        rarity: 'rare',
        description: '使特定火系宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'fire' }],
        consume: true,  // 成功后永久消失
        sprite: '🔥'
    },
    {
        id: 'item-water-stone',
        name: '水之石',
        type: 'item',
        itemType: 'water_stone',
        cost: 1,
        rarity: 'rare',
        description: '使特定水系宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'water' }],
        consume: true,
        sprite: '💧'
    },
    {
        id: 'item-thunder-stone',
        name: '雷之石',
        type: 'item',
        itemType: 'thunder_stone',
        cost: 1,
        rarity: 'rare',
        description: '使皮卡丘等电系宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'electric' }],
        consume: true,
        sprite: '⚡'
    },
    {
        id: 'item-moon-stone',
        name: '月之石',
        type: 'item',
        itemType: 'moon_stone',
        cost: 1,
        rarity: 'rare',
        description: '使特定宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'moon' }],
        consume: true,
        sprite: '🌙'
    },
    {
        id: 'item-sun-stone',
        name: '日之石',
        type: 'item',
        itemType: 'sun_stone',
        cost: 1,
        rarity: 'rare',
        description: '使特定宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'sun' }],
        consume: true,
        sprite: '☀️'
    },
    {
        id: 'item-leaf-stone',
        name: '叶之石',
        type: 'item',
        itemType: 'leaf_stone',
        cost: 1,
        rarity: 'rare',
        description: '使特定草系宝可梦进化。成功后消失。',
        effects: [{ type: 'evolve', elementType: 'grass' }],
        consume: true,
        sprite: '🌿'
    },
    
    // ====== 超进化石 ======
    {
        id: 'item-mega-charizard-x',
        name: '喷火龙X超进化石',
        type: 'item',
        itemType: 'mega_charizard_x',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使喷火龙超级进化为X形态。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'charizard', form: 'x' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '🔴'
    },
    {
        id: 'item-mega-charizard-y',
        name: '喷火龙Y超进化石',
        type: 'item',
        itemType: 'mega_charizard_y',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使喷火龙超级进化为Y形态。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'charizard', form: 'y' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '🟠'
    },
    {
        id: 'item-mega-blastoise',
        name: '水箭龟超进化石',
        type: 'item',
        itemType: 'mega_blastoise',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使水箭龟超级进化。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'blastoise' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '🔵'
    },
    {
        id: 'item-mega-venusaur',
        name: '妙蛙花超进化石',
        type: 'item',
        itemType: 'mega_venusaur',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使妙蛙花超级进化。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'venusaur' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '🌿'
    },
    {
        id: 'item-mega-gengar',
        name: '耿鬼超进化石',
        type: 'item',
        itemType: 'mega_gengar',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使耿鬼超级进化。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'gengar' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '👻'
    },
    {
        id: 'item-mega-alakazam',
        name: '胡地超进化石',
        type: 'item',
        itemType: 'mega_alakazam',
        cost: 2,
        rarity: 'legendary',
        description: '战斗中使胡地超级进化。需要进化钥匙遗物。',
        effects: [{ type: 'megaEvolve', pokemon: 'alakazam' }],
        consume: false,
        returnAfterBattle: true,
        requiresRelic: 'evolution-key',
        sprite: '🔮'
    },
    
    // ====== 战斗道具 ======
    {
        id: 'item-x-attack',
        name: '攻击增强',
        type: 'item',
        itemType: 'x_attack',
        cost: 0,
        rarity: 'uncommon',
        description: '本回合攻击牌伤害+5。',
        effects: [{ type: 'buff', buff: 'damageBonus', value: 5, duration: 1 }],
        consume: true,
        sprite: '⚔️'
    },
    {
        id: 'item-x-defense',
        name: '防御增强',
        type: 'item',
        itemType: 'x_defense',
        cost: 0,
        rarity: 'uncommon',
        description: '本回合受到的伤害-30%。',
        effects: [{ type: 'buff', buff: 'damageReduction', value: 0.3, duration: 1 }],
        consume: true,
        sprite: '🛡️'
    },
    {
        id: 'item-dire-hit',
        name: '要害攻击',
        type: 'item',
        itemType: 'dire_hit',
        cost: 0,
        rarity: 'rare',
        description: '本回合暴击率+30%。',
        effects: [{ type: 'buff', buff: 'critBonus', value: 0.3, duration: 1 }],
        consume: true,
        sprite: '🎯'
    }
];

// 道具管理器
const ItemManager = {
    // 战斗中临时移除的道具（战斗结束后返回）
    battleRemovedItems: [],
    
    // 战斗中使用的消耗道具（永久消失）
    consumedItems: [],
    
    // 战斗中使用失败的道具（本战斗不再出现）
    failedItems: [],
    
    // 本战斗已使用过的特殊道具（不会再次刷出）
    usedSpecialItems: [],
    
    /**
     * 获取道具卡
     */
    getItemById(itemId) {
        return ITEM_CARDS_DATA.find(item => item.id === itemId);
    },
    
    /**
     * 检查道具是否可以使用
     */
    canUseItem(item, context = {}) {
        // 检查是否需要特定遗物
        if (item.requiresRelic) {
            if (typeof RelicManager !== 'undefined' && typeof RelicManager.hasRelic === 'function') {
                if (!RelicManager.hasRelic(item.requiresRelic)) {
                    showMessage(`需要 ${this.getRelicName(item.requiresRelic)} 才能使用此道具！`);
                    // 使用失败，记录到失败列表
                    this.failedItems.push(item.id);
                    return false;
                }
            }
        }
        
        // 检查超进化条件
        if (item.itemType && item.itemType.startsWith('mega_')) {
            const canEvolve = this.canMegaEvolve(item, context);
            if (!canEvolve) {
                // 使用失败，记录到失败列表
                this.failedItems.push(item.id);
            }
            return canEvolve;
        }
        
        // 检查进化条件
        if (item.itemType && ITEM_TYPES[item.itemType] && ITEM_TYPES[item.itemType].category === 'evolution') {
            const canEvolve = this.checkEvolutionCondition(item);
            if (!canEvolve) {
                this.failedItems.push(item.id);
            }
            return canEvolve;
        }
        
        return true;
    },
    
    /**
     * 检查是否可以超进化
     */
    canMegaEvolve(item, context) {
        // 检查是否有进化钥匙遗物
        if (typeof RelicManager !== 'undefined' && typeof RelicManager.hasRelic === 'function') {
            if (!RelicManager.hasRelic('evolution-key')) {
                showMessage('需要进化钥匙才能超级进化！');
                return false;
            }
        }
        
        // 检查当前宝可梦是否匹配
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        if (!activePokemon) {
            showMessage('没有激活的宝可梦！');
            return false;
        }
        
        const effect = item.effects && item.effects[0];
        if (effect && effect.pokemon) {
            // 检查是否已经超进化
            if (activePokemon.isMegaEvolved) {
                showMessage('已经处于超进化状态！');
                return false;
            }
            
            // 检查宝可梦是否匹配
            if (activePokemon.id !== effect.pokemon && !activePokemon.id.startsWith(effect.pokemon)) {
                showMessage(`此超进化石只能用于 ${this.getPokemonName(effect.pokemon)}！`);
                return false;
            }
        }
        
        // 检查本战斗是否已使用过超进化
        if (GameState.battle.megaEvolutionUsed) {
            showMessage('本战斗已使用过超进化！');
            return false;
        }
        
        return true;
    },
    
    /**
     * 使用道具
     */
    useItem(item, context = {}) {
        // 先检查是否可用
        if (!this.canUseItem(item, context)) {
            // 使用失败
            // 超进化石：无论成功失败都本战斗不出现
            if (item.itemType && item.itemType.startsWith('mega_')) {
                this.usedSpecialItems.push(item.id);
                this.battleRemovedItems.push(item.id);
            }
            return { success: false, reason: '条件不满足' };
        }
        
        // 处理道具效果
        for (const effect of (item.effects || [])) {
            this.executeItemEffect(effect, context);
        }
        
        // 处理道具消耗/移除
        if (item.consume) {
            // 普通道具/进化石：永久消失
            this.consumedItems.push(item.id);
            console.log(`道具 ${item.name} 已消耗，从牌库永久移除`);
            return { success: true, consumed: true };
        } else if (item.returnAfterBattle) {
            // 超进化石：本战斗不刷出，战斗后返回
            this.battleRemovedItems.push(item.id);
            this.usedSpecialItems.push(item.id);
            console.log(`道具 ${item.name} 已使用，本战斗不再出现，战斗结束后返回`);
            return { success: true, removed: true, returnAfterBattle: true };
        }
        
        return { success: true };
    },
    
    /**
     * 执行道具效果
     */
    executeItemEffect(effect, context) {
        switch (effect.type) {
            case 'heal':
                if (typeof healPlayer === 'function') {
                    healPlayer(effect.value);
                }
                break;
                
            case 'fullHeal':
                GameState.player.hp = GameState.player.maxHp;
                showMessage('HP完全恢复！');
                break;
                
            case 'cureStatus':
                GameState.player.statusEffects = [];
                showMessage('状态异常已治愈！');
                break;
                
            case 'capture':
                if (typeof PokeballSystem !== 'undefined' && typeof PokeballSystem.attemptCapture === 'function') {
                    const result = PokeballSystem.attemptCapture(effect.ballType);
                    if (result.success) {
                        showMessage(result.message);
                        // 战斗胜利
                        if (typeof endBattle === 'function') {
                            setTimeout(() => endBattle(true), 1000);
                        }
                    } else {
                        showMessage(result.message);
                    }
                }
                break;
                
            case 'evolve':
                this.attemptItemEvolution(effect.elementType);
                break;
                
            case 'megaEvolve':
                this.performMegaEvolution(effect.pokemon, effect.form);
                break;
                
            case 'buff':
                this.applyItemBuff(effect);
                break;
        }
    },
    
    /**
     * 尝试道具进化
     */
    attemptItemEvolution(elementType) {
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        
        if (!activePokemon || !activePokemon.evolution) {
            showMessage('无法进化！');
            return;
        }
        
        // 检查进化条件是否为道具进化
        if (activePokemon.evolution.trigger !== 'item') {
            showMessage('这只宝可梦不能使用道具进化！');
            return;
        }
        
        // 检查道具类型是否匹配
        const requiredItem = activePokemon.evolution.requiredItem;
        if (requiredItem) {
            const itemTypes = {
                'fire': 'fire_stone',
                'water': 'water_stone',
                'electric': 'thunder_stone',
                'thunder': 'thunder_stone',
                'grass': 'leaf_stone',
                'moon': 'moon_stone',
                'sun': 'sun_stone'
            };
            
            const expectedType = itemTypes[elementType];
            if (requiredItem !== expectedType && requiredItem !== elementType + '_stone') {
                showMessage('道具类型不匹配！');
                return;
            }
        }
        
        // 执行进化
        if (typeof showEvolutionChoice === 'function') {
            showEvolutionChoice(activePokemon);
        }
    },
    
    /**
     * 执行超进化
     */
    performMegaEvolution(pokemonId, form = null) {
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        
        if (!activePokemon) {
            showMessage('没有激活的宝可梦！');
            return;
        }
        
        // 超进化数据
        const megaForms = {
            'charizard': {
                'x': { 
                    name: '超级喷火龙X', 
                    attack: 150, defense: 120, spAttack: 130, spDefense: 100,
                    types: ['fire', 'dragon'],
                    ability: 'tough_claws',
                    abilityName: '硬爪',
                    sprite: '🐉🔥'
                },
                'y': { 
                    name: '超级喷火龙Y', 
                    attack: 110, defense: 95, spAttack: 160, spDefense: 120,
                    types: ['fire', 'flying'],
                    ability: 'drought',
                    abilityName: '日照',
                    sprite: '🐉☀️'
                }
            },
            'blastoise': {
                name: '超级水箭龟',
                attack: 130, defense: 130, spAttack: 135, spDefense: 115,
                types: ['water'],
                ability: 'mega_launcher',
                abilityName: '超级发射器',
                sprite: '🐢💨'
            },
            'venusaur': {
                name: '超级妙蛙花',
                attack: 120, defense: 120, spAttack: 125, spDefense: 120,
                types: ['grass', 'poison'],
                ability: 'thick_fat',
                abilityName: '厚脂肪',
                sprite: '🌸💪'
            },
            'gengar': {
                name: '超级耿鬼',
                attack: 85, defense: 90, spAttack: 175, spDefense: 110,
                types: ['ghost', 'poison'],
                ability: 'shadow_tag',
                abilityName: '踩影',
                sprite: '👻👁️'
            },
            'alakazam': {
                name: '超级胡地',
                attack: 60, defense: 70, spAttack: 175, spDefense: 115,
                types: ['psychic'],
                ability: 'trace',
                abilityName: '追踪',
                sprite: '🔮✨'
            }
        };
        
        const baseKey = pokemonId.split('-')[0];
        let megaData = megaForms[baseKey];
        
        if (!megaData) {
            showMessage('无法超进化！');
            return;
        }
        
        // 处理多形态
        if (form && megaData[form]) {
            megaData = megaData[form];
        } else if (megaData.name) {
            // 单形态
        } else {
            megaData = megaData['x'] || Object.values(megaData)[0];
        }
        
        // 保存原始数据
        if (!activePokemon.originalData) {
            activePokemon.originalData = {
                name: activePokemon.name,
                attack: activePokemon.attack,
                defense: activePokemon.defense,
                spAttack: activePokemon.spAttack,
                spDefense: activePokemon.spDefense,
                types: [...activePokemon.types],
                ability: activePokemon.ability,
                abilityName: activePokemon.abilityName,
                sprite: activePokemon.sprite
            };
        }
        
        // 应用超进化
        activePokemon.name = megaData.name;
        activePokemon.attack = megaData.attack;
        activePokemon.defense = megaData.defense;
        activePokemon.spAttack = megaData.spAttack;
        activePokemon.spDefense = megaData.spDefense;
        activePokemon.types = megaData.types;
        activePokemon.ability = megaData.ability;
        activePokemon.abilityName = megaData.abilityName;
        activePokemon.sprite = megaData.sprite;
        activePokemon.isMegaEvolved = true;
        
        // 标记本战斗已使用超进化
        GameState.battle.megaEvolutionUsed = true;
        
        showMessage(`${megaData.name} 超进化成功！`);
        
        // 更新UI
        if (typeof updateBattleUI === 'function') {
            updateBattleUI();
        }
    },
    
    /**
     * 超进化还原
     */
    revertMegaEvolution() {
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        
        if (!activePokemon || !activePokemon.isMegaEvolved || !activePokemon.originalData) {
            return;
        }
        
        const original = activePokemon.originalData;
        activePokemon.name = original.name;
        activePokemon.attack = original.attack;
        activePokemon.defense = original.defense;
        activePokemon.spAttack = original.spAttack;
        activePokemon.spDefense = original.spDefense;
        activePokemon.types = original.types;
        activePokemon.ability = original.ability;
        activePokemon.abilityName = original.abilityName;
        activePokemon.sprite = original.sprite;
        activePokemon.isMegaEvolved = false;
        delete activePokemon.originalData;
        
        console.log(`${activePokemon.name} 超进化状态已解除`);
    },
    
    /**
     * 应用道具buff
     */
    applyItemBuff(effect) {
        if (effect.buff === 'damageBonus') {
            GameState.player.damageBonus = (GameState.player.damageBonus || 0) + effect.value;
            showMessage(`攻击增强！伤害+${effect.value}`);
        } else if (effect.buff === 'damageReduction') {
            GameState.player.damageReduction = (GameState.player.damageReduction || 0) + effect.value;
            showMessage('防御增强！');
        } else if (effect.buff === 'critBonus') {
            GameState.player.critBonus = (GameState.player.critBonus || 0) + effect.value;
            showMessage('暴击率提升！');
        }
    },
    
    /**
     * 战斗开始时重置
     */
    onBattleStart() {
        this.battleRemovedItems = [];
        this.failedItems = [];
        this.usedSpecialItems = [];
        // 重置超进化使用标记
        if (GameState.battle) {
            GameState.battle.megaEvolutionUsed = false;
        }
    },
    
    /**
     * 战斗结束时处理
     */
    onBattleEnd() {
        // 返回临时移除的特殊道具（超进化石等）
        for (const item of this.battleRemovedItems) {
            // 检查牌组中是否还有该道具，避免重复
            const itemId = item.id || item;
            const existingItem = GameState.player.deck.find(c => c.id === itemId);
            if (!existingItem) {
                const itemData = this.getItemById(itemId);
                if (itemData) {
                    GameState.player.deck.push({ ...itemData });
                    console.log(`道具 ${itemData.name} 已返回牌组`);
                }
            }
        }
        this.battleRemovedItems = [];
        
        // 还原超进化状态
        this.revertMegaEvolution();
        
        // 清空失败列表和使用记录
        this.failedItems = [];
        this.usedSpecialItems = [];
        
        // 消耗的道具从牌组永久移除
        for (const item of this.consumedItems) {
            // 找到并移除牌组中对应的道具卡
            const itemId = item.id || item;
            const index = GameState.player.deck.findIndex(c => c.id === itemId);
            if (index >= 0) {
                const removed = GameState.player.deck.splice(index, 1)[0];
                console.log(`道具 ${removed.name} 已从牌组永久移除`);
            }
        }
        this.consumedItems = [];
    },
    
    /**
     * 检查道具是否可用（用于抽牌时过滤）
     */
    isItemAvailable(itemId) {
        // 检查是否是使用失败且本战斗不应出现的道具
        if (this.failedItems.includes(itemId)) {
            return false;
        }
        // 检查是否是已使用的特殊道具
        if (this.usedSpecialItems.includes(itemId)) {
            return false;
        }
        // 检查是否是已消耗的道具
        if (this.consumedItems.includes(itemId)) {
            return false;
        }
        return true;
    },
    
    /**
     * 过滤可用的道具卡（用于抽牌）
     */
    filterAvailableItems(items) {
        return items.filter(item => {
            if (item.type === 'item') {
                return this.isItemAvailable(item.id);
            }
            return true;
        });
    },
    
    /**
     * 检查进化条件
     */
    checkEvolutionCondition(item) {
        const activePokemon = GameState.player.activePokemon || (typeof PokemonCardSystem !== 'undefined' ? PokemonCardSystem.activePokemon : null);
        
        if (!activePokemon || !activePokemon.evolution) {
            showMessage('当前宝可梦无法进化！');
            return false;
        }
        
        // 检查进化条件是否为道具进化
        if (activePokemon.evolution.trigger !== 'item') {
            showMessage('这只宝可梦不能使用道具进化！');
            return false;
        }
        
        // 检查道具类型是否匹配
        const elementType = item.itemType.replace('_stone', '').replace('item-', '');
        const itemTypeMap = {
            'fire': 'fire_stone',
            'water': 'water_stone',
            'electric': 'thunder_stone',
            'thunder': 'thunder_stone',
            'grass': 'leaf_stone',
            'leaf': 'leaf_stone',
            'moon': 'moon_stone',
            'sun': 'sun_stone'
        };
        
        const requiredItem = activePokemon.evolution.requiredItem;
        if (requiredItem && requiredItem !== itemTypeMap[elementType] && !requiredItem.includes(elementType)) {
            showMessage('道具类型不匹配！');
            return false;
        }
        
        return true;
    },
    
    /**
     * 获取遗物名称
     */
    getRelicName(relicId) {
        const names = {
            'evolution-key': '进化钥匙'
        };
        return names[relicId] || relicId;
    },
    
    /**
     * 获取宝可梦名称
     */
    getPokemonName(pokemonId) {
        const names = {
            'charizard': '喷火龙',
            'blastoise': '水箭龟',
            'venusaur': '妙蛙花',
            'gengar': '耿鬼',
            'alakazam': '胡地',
            'gyarados': '暴鲤龙',
            'garchomp': '烈咬陆鲨'
        };
        return names[pokemonId] || pokemonId;
    },
    
    /**
     * 获取随机道具奖励
     */
    getRandomItemReward(rarity = null) {
        let pool = ITEM_CARDS_DATA;
        
        if (rarity) {
            pool = pool.filter(item => item.rarity === rarity);
        }
        
        if (pool.length === 0) return null;
        return { ...pool[Math.floor(Math.random() * pool.length)] };
    }
};
