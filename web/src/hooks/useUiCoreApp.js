import { useDebugValue, useState } from 'react'
import { emitAction, fetchNui } from '../bridge.js'
import { UI_CONFIG } from '../config/uiConfig.js'
import { createInitialState } from '../panelState.js'
import { useCraftingActions } from './useCraftingActions.js'
import { useMemberActions } from './useMemberActions.js'
import { useModalState } from './useModalState.js'
import { useNotifications } from './useNotifications.js'
import { useNuiBridge } from './useNuiBridge.js'
import { useRankActions } from './useRankActions.js'
import { useTableFilters } from './useTableFilters.js'

export function useUiCoreApp() {
    const [appState, setAppState] = useState(() => createInitialState())
    const [rankForm, setRankForm] = useState({ name: '', weight: '' })

    useDebugValue(`${appState.visible ? 'visible' : 'hidden'}:${appState.panel.view}`)

    const { pushToast } = useNotifications(setAppState)

    async function sendAction(action, payload = {}) {
        try {
            if (UI_CONFIG.debug) console.log('[ui_core] action ->', action, payload)
            const response = await emitAction(action, payload)
            if (!response?.ok) {
                if (UI_CONFIG.debug) console.log('[ui_core] refused', action, response?.reason)
                pushToast('error', `Request was refused: ${response?.reason || 'unknown'}`)
                return false
            }

            return true
        } catch {
            pushToast('error', 'Could not send that request.')
            return false
        }
    }

    function closeNui() {
        fetchNui('ui_core:close').catch(() => {})
    }

    function cycleTheme(currentTheme) {
        const themes = UI_CONFIG.themeOrder
        const idx = themes.indexOf(currentTheme)
        const nextTheme = themes[(idx + 1) % themes.length]
        setAppState((prev) => ({ ...prev, theme: nextTheme }))
        emitAction('theme:changed', { theme: nextTheme }).catch(() => {})
    }

    function selectSkill(skillId) {
        setAppState((prev) => ({
            ...prev,
            skillsUi: {
                ...prev.skillsUi,
                selectedSkillId: String(skillId || '')
            }
        }))
    }

    const modal = useModalState({ appState, setAppState, sendAction, pushToast })
    const tables = useTableFilters(setAppState)
    const crafting = useCraftingActions({ appState, setAppState, sendAction, pushToast })
    const members = useMemberActions({
        sendAction,
        pushToast,
        promptLater: modal.promptLater,
        confirmLater: modal.confirmLater
    })
    const ranks = useRankActions({
        appState,
        setAppState,
        rankForm,
        setRankForm,
        sendAction,
        pushToast,
        promptLater: modal.promptLater,
        confirmLater: modal.confirmLater
    })

    async function handleLogsRefresh() {
        const ok = await sendAction('logs:refresh')
        if (ok) {
            pushToast('info', 'Refreshing logs.')
        }
    }

    useNuiBridge({
        appState,
        setAppState,
        pushToast,
        closeNui,
        confirmModalAction: modal.confirmModalAction
    })

    return {
        appState,
        rankForm,
        setRankForm,
        closeNui,
        setActiveTab: tables.setActiveTab,
        updateFilter: tables.updateFilter,
        tableSort: tables.tableSort,
        tablePageMove: tables.tablePageMove,
        tableSizeChange: tables.tableSizeChange,
        cycleTheme,
        togglePermission: ranks.togglePermission,
        selectSkill,
        selectCraftingRecipe: crafting.selectCraftingRecipe,
        setCraftingFilter: crafting.setCraftingFilter,
        setCraftingSearch: crafting.setCraftingSearch,
        adjustCraftingQuantity: crafting.adjustCraftingQuantity,
        closeModal: modal.closeModal,
        confirmModalAction: modal.confirmModalAction,
        updateModalInput: modal.updateModalInput,
        handleCraftingSubmit: crafting.handleCraftingSubmit,
        handleMembersRefresh: members.handleMembersRefresh,
        handleLogsRefresh,
        handleCreateRank: ranks.handleCreateRank,
        handleRenameRank: ranks.handleRenameRank,
        handleDeleteRank: ranks.handleDeleteRank,
        handleHireMember: members.handleHireMember,
        handleFireMember: members.handleFireMember,
        handlePromoteMember: members.handlePromoteMember,
        handleDemoteMember: members.handleDemoteMember,
        handleSetMemberRank: members.handleSetMemberRank,
        handlePermissionsSave: ranks.handlePermissionsSave,
        handlePermissionsReset: ranks.handlePermissionsReset
    }
}
