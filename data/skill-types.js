/**
 * 技能类型定义
 * 物理攻击：使用攻击者的物攻 vs 防御者的物防计算伤害
 * 特殊攻击：使用攻击者的特攻 vs 防御者的特防计算伤害
 * 能力：不直接造成伤害，提供增益/减益效果
 * 道具：消耗品，各种效果
 */
const SKILL_TYPES = {
    physical: { name: '物理', icon: '⚔️', description: '物理攻击，使用物攻计算伤害' },
    special: { name: '特殊', icon: '✨', description: '特殊攻击，使用特攻计算伤害' },
    ability: { name: '能力', icon: '💫', description: '能力技能，提供增益或减益效果' },
    item: { name: '道具', icon: '🎒', description: '道具卡，使用后消耗' }
};

// 获取技能类型图标
function getSkillTypeIcon(skillType) {
    return SKILL_TYPES[skillType]?.icon || '⚔️';
}

// 获取技能类型名称
function getSkillTypeName(skillType) {
    return SKILL_TYPES[skillType]?.name || '物理';
}
