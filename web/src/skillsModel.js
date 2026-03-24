export const DEFAULT_SKILLS_UI_STATE = {
    selectedSkillId: ''
}

export function syncSkillsUiState(panel, currentState = DEFAULT_SKILLS_UI_STATE) {
    if (panel?.view !== 'skills') {
        return { ...DEFAULT_SKILLS_UI_STATE }
    }

    const next = {
        ...DEFAULT_SKILLS_UI_STATE,
        ...(currentState || {})
    }

    const skills = Array.isArray(panel?.skills?.list) ? panel.skills.list : []
    const selectedExists = skills.some((skill) => String(skill?.id || '') === String(next.selectedSkillId || ''))

    if (!selectedExists) {
        next.selectedSkillId = skills[0] ? String(skills[0].id || '') : ''
    }

    return next
}

export function buildSkillsModel(panel, skillsUi) {
    const skills = panel?.skills || {}
    const list = Array.isArray(skills.list) ? skills.list : []
    const selectedSkillId = String(skillsUi?.selectedSkillId || '')
    const selectedSkill = list.find((skill) => String(skill?.id || '') === selectedSkillId) || list[0] || null

    return {
        summary: skills.summary || {},
        activity: Array.isArray(skills.activity) ? skills.activity : [],
        list,
        selectedSkill
    }
}
