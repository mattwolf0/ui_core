import { UI_CONFIG } from '../config/uiConfig.js'
import { buildPermissionDraft } from '../panelState.js'

function readRankName(value) {
    return String(value ?? '').trim().slice(0, UI_CONFIG.text.maxActionLength)
}

export function useRankActions({
    appState,
    setAppState,
    rankForm,
    setRankForm,
    sendAction,
    pushToast,
    promptLater,
    confirmLater
}) {
    function togglePermission(rankId, permission, enabled) {
        setAppState((prev) => ({
            ...prev,
            permissionDraft: {
                ...prev.permissionDraft,
                [rankId]: {
                    ...(prev.permissionDraft[rankId] || {}),
                    [permission]: enabled
                }
            }
        }))
    }

    async function handleCreateRank() {
        const rankName = readRankName(rankForm.name)
        const weight = Number(rankForm.weight)

        if (!rankName) {
            pushToast('warning', 'Rank name is required.')
            return
        }

        if (!Number.isFinite(weight) || weight < 0) {
            pushToast('warning', 'Rank weight must be zero or a positive number.')
            return
        }

        const ok = await sendAction('rank:create', { name: rankName, weight })
        if (ok) {
            pushToast('success', `Requested rank creation: ${rankName}`)
            setRankForm({ name: '', weight: '' })
        }
    }

    function handleRenameRank(rankId, rankName) {
        if (!rankId) {
            return
        }

        promptLater({
            title: 'Rename Rank',
            body: `Enter the display name for rank '${rankName || rankId}'.`,
            inputLabel: 'New rank name',
            inputPlaceholder: 'Rank name',
            inputValue: rankName,
            inputType: 'text',
            inputKey: 'name',
            inputRequired: true,
            maxLength: UI_CONFIG.text.maxActionLength,
            onConfirmAction: {
                action: 'rank:rename',
                payload: { rankId }
            },
            successMessage: 'Rename sent.'
        })
    }

    function handleDeleteRank(rankId) {
        if (!rankId) {
            return
        }

        confirmLater({
            title: 'Delete Rank',
            body: `Delete rank '${rankId}'?`,
            confirmLabel: 'Delete',
            onConfirmAction: {
                action: 'rank:delete',
                payload: { rankId }
            },
            successMessage: 'Delete sent.'
        })
    }

    async function handlePermissionsSave() {
        const ok = await sendAction('permissions:save', {
            permissions: JSON.parse(JSON.stringify(appState.permissionDraft))
        })

        if (ok) {
            pushToast('success', 'Permission changes sent.')
        }
    }

    function handlePermissionsReset() {
        setAppState((prev) => ({
            ...prev,
            permissionDraft: buildPermissionDraft(prev.panel.ranks, {})
        }))
        pushToast('info', 'Permission draft reset to current panel values.')
    }

    return {
        togglePermission,
        handleCreateRank,
        handleRenameRank,
        handleDeleteRank,
        handlePermissionsSave,
        handlePermissionsReset
    }
}
