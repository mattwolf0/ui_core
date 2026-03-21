import { UI_CONFIG } from '../config/uiConfig.js'
import { defaultTableState } from '../tableRows.js'

const fallbackTable = {
    sortKey: '',
    sortDir: 'asc',
    page: 1,
    pageSize: UI_CONFIG.table.defaultPageSize
}

export function useTableFilters(setAppState) {
    function setActiveTab(tabId) {
        setAppState((prev) => ({
            ...prev,
            panel: {
                ...prev.panel,
                activeTab: tabId
            }
        }))
    }

    function updateFilter(name, value, tableId) {
        setAppState((prev) => ({
            ...prev,
            filters: {
                ...prev.filters,
                [name]: value
            },
            tables: tableId ? {
                ...prev.tables,
                [tableId]: {
                    ...(prev.tables?.[tableId] || defaultTableState[tableId]),
                    page: 1
                }
            } : prev.tables
        }))
    }

    function tableSort(tableId, sortKey) {
        setAppState((prev) => {
            const current = prev.tables?.[tableId] || defaultTableState[tableId] || fallbackTable
            const sameKey = current.sortKey === sortKey

            return {
                ...prev,
                tables: {
                    ...prev.tables,
                    [tableId]: {
                        ...current,
                        sortKey,
                        sortDir: sameKey && current.sortDir === 'asc' ? 'desc' : 'asc',
                        page: 1
                    }
                }
            }
        })
    }

    function tablePageMove(tableId, delta) {
        setAppState((prev) => {
            const current = prev.tables?.[tableId] || defaultTableState[tableId] || fallbackTable

            return {
                ...prev,
                tables: {
                    ...prev.tables,
                    [tableId]: {
                        ...current,
                        page: Math.max(1, (Number(current.page) || 1) + delta)
                    }
                }
            }
        })
    }

    function tableSizeChange(tableId, pageSize) {
        const safeSize = Number(pageSize)
        if (!Number.isFinite(safeSize)) {
            return
        }

        setAppState((prev) => {
            const current = prev.tables?.[tableId] || defaultTableState[tableId] || fallbackTable

            return {
                ...prev,
                tables: {
                    ...prev.tables,
                    [tableId]: {
                        ...current,
                        pageSize: Math.max(1, Math.min(UI_CONFIG.table.maxPageSize, safeSize)),
                        page: 1
                    }
                }
            }
        })
    }

    return {
        setActiveTab,
        updateFilter,
        tableSort,
        tablePageMove,
        tableSizeChange
    }
}
