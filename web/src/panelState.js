import { UI_CONFIG } from './config/uiConfig.js'
import { DEFAULT_CRAFTING_UI_STATE } from './craftingModel.js'
import { DEFAULT_SKILLS_UI_STATE } from './skillsModel.js'
import { defaultTableState } from './tableRows.js'

function copyInitialState(value) {
    return JSON.parse(JSON.stringify(value))
}

export const defaultPanel = {
    view: 'default',
    title: '',
    subtitle: '',
    showThemeSwitch: true,
    closeLabel: 'Close',
    headerBadge: null,
    localActions: {},
    context: null,
    activeTab: 'overview',
    tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'members', label: 'Members' },
        { id: 'ranks', label: 'Ranks' },
        { id: 'storage', label: 'Storage' },
        { id: 'logs', label: 'Logs' }
    ],
    overview: {
        stats: [],
        highlights: []
    },
    members: [],
    ranks: [],
    storage: [],
    logs: [],
    crafting: {
        recipes: [],
        stats: {},
        progression: {},
        inventory: {}
    },
    skills: {
        summary: {},
        list: [],
        activity: []
    }
}

export function createInitialState() {
    return {
        visible: false,
        theme: UI_CONFIG.defaultTheme,
        panel: copyInitialState(defaultPanel),
        modal: null,
        toasts: [],
        permissionDraft: {},
        filters: {
            memberSearch: '',
            memberStatus: 'all',
            logCategory: 'all',
            logActor: '',
            logSearch: ''
        },
        tables: copyInitialState(defaultTableState),
        craftingUi: copyInitialState(DEFAULT_CRAFTING_UI_STATE),
        skillsUi: copyInitialState(DEFAULT_SKILLS_UI_STATE)
    }
}

export function nextPanel(current, incoming) {
    const src = incoming && typeof incoming === 'object' ? incoming : {}
    const craftPatch = src.crafting && typeof src.crafting === 'object'
        ? src.crafting
        : {}
    const skillPatch = src.skills && typeof src.skills === 'object'
        ? src.skills
        : {}

    return {
        ...current,
        ...src,
        view: typeof src.view === 'string' ? src.view : current.view,
        tabs: Array.isArray(src.tabs) ? src.tabs : current.tabs,
        overview: {
            ...(current.overview || {}),
            ...((src.overview && typeof src.overview === 'object') ? src.overview : {})
        },
        members: Array.isArray(src.members) ? src.members : current.members,
        ranks: Array.isArray(src.ranks) ? src.ranks : current.ranks,
        storage: Array.isArray(src.storage) ? src.storage : current.storage,
        logs: Array.isArray(src.logs) ? src.logs : current.logs,
        localActions: src.localActions && typeof src.localActions === 'object'
            ? src.localActions
            : (current.localActions || {}),
        crafting: {
            ...(current.crafting || {}),
            ...craftPatch,
            recipes: Array.isArray(craftPatch.recipes)
                ? craftPatch.recipes
                : (current.crafting?.recipes || [])
        },
        skills: {
            ...(current.skills || {}),
            ...skillPatch,
            list: Array.isArray(skillPatch.list)
                ? skillPatch.list
                : (current.skills?.list || []),
            activity: Array.isArray(skillPatch.activity)
                ? skillPatch.activity
                : (current.skills?.activity || [])
        }
    }
}

export function buildPermissionDraft(ranks, currentDraft = {}) {
    const nextDraft = {}
    const rankRows = Array.isArray(ranks) ? ranks : []

    for (const rank of rankRows) {
        const rankId = String(rank?.id ?? '')
        if (!rankId) {
            continue
        }

        const existing = currentDraft[rankId] || {}
        const perms = rank?.permissions || {}
        const merged = {}

        for (const perm of Object.keys(perms)) {
            if (typeof existing[perm] === 'boolean') {
                merged[perm] = existing[perm]
            } else {
                merged[perm] = Boolean(perms[perm])
            }
        }

        nextDraft[rankId] = merged
    }

    return nextDraft
}
