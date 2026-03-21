import { UI_CONFIG } from '../config/uiConfig.js'

function readModalInput(value, maxLength = UI_CONFIG.text.modalInputMaxLength) {
    return String(value ?? '').trim().slice(0, maxLength)
}

export function useModalState({ appState, setAppState, sendAction, pushToast }) {
    function confirmLater({ title, body, onConfirmAction, confirmLabel, successMessage }) {
        setAppState((prev) => ({
            ...prev,
            modal: {
                open: true,
                kind: 'confirm',
                title,
                body,
                confirmLabel: confirmLabel || 'Confirm',
                cancelLabel: 'Cancel',
                onConfirmAction,
                successMessage: successMessage || 'Sent.'
            }
        }))
    }

    function promptLater({
        title,
        body,
        inputLabel,
        inputPlaceholder,
        inputValue,
        inputType,
        inputKey,
        inputRequired,
        maxLength,
        onConfirmAction,
        confirmLabel,
        successMessage
    }) {
        setAppState((prev) => ({
            ...prev,
            modal: {
                open: true,
                kind: 'prompt',
                title,
                body,
                inputLabel,
                inputPlaceholder,
                inputValue: inputValue ?? '',
                inputType: inputType || 'text',
                inputKey: inputKey || 'value',
                inputRequired: inputRequired !== false,
                maxLength: maxLength || UI_CONFIG.text.modalInputMaxLength,
                confirmLabel: confirmLabel || 'Save',
                cancelLabel: 'Cancel',
                onConfirmAction,
                successMessage: successMessage || 'Sent.'
            }
        }))
    }

    function updateModalInput(value) {
        setAppState((prev) => ({
            ...prev,
            modal: prev.modal ? { ...prev.modal, inputValue: value } : null
        }))
    }

    function closeModal() {
        setAppState((prev) => ({ ...prev, modal: null }))
    }

    async function confirmModalAction() {
        const modal = appState.modal
        if (!modal?.onConfirmAction?.action) {
            closeModal()
            return
        }

        const action = modal.onConfirmAction.action
        const payload = {
            ...(modal.onConfirmAction.payload || {})
        }

        if (modal.kind === 'prompt') {
            const raw = readModalInput(modal.inputValue || '', modal.maxLength || UI_CONFIG.text.modalInputMaxLength)

            if (modal.inputRequired && !raw) {
                pushToast('warning', 'This field is required.')
                return
            }

            if (modal.inputType === 'number') {
                const numeric = Number(raw)
                if (!Number.isFinite(numeric)) {
                    pushToast('warning', 'That needs to be a valid number.')
                    return
                }

                payload[modal.inputKey || 'value'] = numeric
            } else {
                payload[modal.inputKey || 'value'] = raw
            }
        }

        const ok = await sendAction(action, payload)
        if (ok) {
            pushToast('success', modal.successMessage || 'Sent.')
            closeModal()
        }
    }

    return {
        confirmLater,
        promptLater,
        updateModalInput,
        closeModal,
        confirmModalAction
    }
}
