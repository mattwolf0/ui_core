import { startTransition, useEffect, useRef } from 'react'
import { fetchNui, onMessage } from '../bridge.js'
import { UI_CONFIG } from '../config/uiConfig.js'
import { syncCraftingUiState } from '../craftingModel.js'
import {
    buildPermissionDraft,
    nextPanel
} from '../panelState.js'
import { syncSkillsUiState } from '../skillsModel.js'

export function useNuiBridge({ appState, setAppState, pushToast, closeNui, confirmModalAction }) {
    const readySent = useRef(false)

    useEffect(() => {
        // Body-level theme survives CEF root remounts better than panel-only classes.
        document.body.setAttribute('data-theme', appState.theme)
    }, [appState.theme])

    useEffect(() => {
        const removeVisible = onMessage('ui_core:setVisible', (payload) => {
            if (UI_CONFIG.debug) console.log('[ui_core] visible payload', payload)
            startTransition(() => {
                setAppState((prev) => ({
                    ...prev,
                    visible: Boolean(payload?.visible),
                    // Closing focus clears modal state so buffered Enter cannot confirm after CEF hands input back.
                    modal: payload?.visible ? prev.modal : null
                }))
            })
        })

        const removeTheme = onMessage('ui_core:setTheme', (payload) => {
            if (!payload || typeof payload.theme !== 'string') {
                return
            }

            startTransition(() => {
                setAppState((prev) => ({ ...prev, theme: payload.theme }))
            })
        })

        const removePanel = onMessage('ui_core:setPanel', (payload) => {
            startTransition(() => {
                setAppState((prev) => {
                    const panel = nextPanel(prev.panel, payload)
                    return {
                        ...prev,
                        panel,
                        permissionDraft: buildPermissionDraft(panel.ranks, prev.permissionDraft),
                        craftingUi: syncCraftingUiState(panel, prev.craftingUi),
                        skillsUi: syncSkillsUiState(panel, prev.skillsUi)
                    }
                })
            })
        })

        const removeToast = onMessage('ui_core:toast', (payload) => {
            pushToast(
                payload?.toastType || 'info',
                payload?.message || '',
                payload?.duration || UI_CONFIG.toast.defaultDurationMs
            )
        })

        return () => {
            removeVisible()
            removeTheme()
            removePanel()
            removeToast()
        }
    }, [])

    useEffect(() => {
        if (readySent.current) {
            return
        }

        readySent.current = true
        // Ask Lua for the initial state after the browser mounts.
        fetchNui('ui_core:ready').catch(() => {})
    }, [])

    useEffect(() => {
        function handleKeydown(event) {
            if (event.key === 'Escape' && appState.visible) {
                closeNui()
                return
            }

            if (event.key === 'Enter' && appState.modal?.open) {
                confirmModalAction()
            }
        }

        window.addEventListener('keydown', handleKeydown)
        return () => {
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [appState.visible, appState.modal])
}
