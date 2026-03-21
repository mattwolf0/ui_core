import { UI_CONFIG } from '../config/uiConfig.js'

export function useMemberActions({ sendAction, pushToast, promptLater, confirmLater }) {
    async function handleMembersRefresh() {
        const ok = await sendAction('members:refresh')
        if (ok) {
            pushToast('info', 'Refreshing members.')
        }
    }

    function handleHireMember() {
        promptLater({
            title: 'Hire Member',
            body: 'Enter the character ID to hire.',
            inputLabel: 'Character ID',
            inputPlaceholder: 'Character ID',
            inputType: 'number',
            inputKey: 'charId',
            inputRequired: true,
            maxLength: UI_CONFIG.text.characterIdMaxLength,
            onConfirmAction: {
                action: 'member:hire',
                payload: {}
            },
            successMessage: 'Hire sent.'
        })
    }

    function handleFireMember(charId, memberName) {
        const numericCharId = Number(charId)
        if (!Number.isFinite(numericCharId)) {
            return
        }

        confirmLater({
            title: 'Remove Member',
            body: `Remove '${memberName || numericCharId}' from the organization?`,
            confirmLabel: 'Remove',
            onConfirmAction: {
                action: 'member:fire',
                payload: { charId: numericCharId }
            },
            successMessage: 'Removal sent.'
        })
    }

    async function handlePromoteMember(charId) {
        const numericCharId = Number(charId)
        if (!Number.isFinite(numericCharId)) {
            return
        }

        const ok = await sendAction('member:promote', { charId: numericCharId })
        if (ok) {
            pushToast('success', 'Promotion sent.')
        }
    }

    async function handleDemoteMember(charId) {
        const numericCharId = Number(charId)
        if (!Number.isFinite(numericCharId)) {
            return
        }

        const ok = await sendAction('member:demote', { charId: numericCharId })
        if (ok) {
            pushToast('success', 'Demotion sent.')
        }
    }

    function handleSetMemberRank(charId, rankName) {
        const numericCharId = Number(charId)
        if (!Number.isFinite(numericCharId)) {
            return
        }

        promptLater({
            title: 'Set Member Rank',
            body: `Enter a rank for character '${numericCharId}'.`,
            inputLabel: 'Rank',
            inputPlaceholder: 'Rank ID or name',
            inputValue: rankName,
            inputType: 'text',
            inputKey: 'rank',
            inputRequired: true,
            maxLength: UI_CONFIG.text.maxActionLength,
            onConfirmAction: {
                action: 'member:setRank',
                payload: { charId: numericCharId }
            },
            successMessage: 'Rank update sent.'
        })
    }

    return {
        handleMembersRefresh,
        handleHireMember,
        handleFireMember,
        handlePromoteMember,
        handleDemoteMember,
        handleSetMemberRank
    }
}
