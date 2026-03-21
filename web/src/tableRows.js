import { UI_CONFIG } from './config/uiConfig.js'

export const defaultTableState = {
    members: { sortKey: 'name', sortDir: 'asc', page: 1, pageSize: UI_CONFIG.table.defaultPageSize },
    ranks: { sortKey: 'weight', sortDir: 'desc', page: 1, pageSize: UI_CONFIG.table.defaultPageSize },
    storage: { sortKey: 'item', sortDir: 'asc', page: 1, pageSize: UI_CONFIG.table.defaultPageSize },
    logs: { sortKey: 'time', sortDir: 'desc', page: 1, pageSize: UI_CONFIG.table.defaultPageSize }
}

function toComparable(value) {
    if (typeof value === 'number') {
        return { type: 'number', value }
    }

    if (typeof value === 'boolean') {
        return { type: 'number', value: value ? 1 : 0 }
    }

    const numeric = Number(value)
    if (Number.isFinite(numeric) && value !== '' && value !== null && value !== undefined) {
        return { type: 'number', value: numeric }
    }

    return { type: 'string', value: String(value ?? '').toLowerCase() }
}

function getSortValue(row, column) {
    if (!column) {
        return ''
    }

    if (typeof column.sortValue === 'function') {
        return column.sortValue(row)
    }

    return row?.[column.key]
}

export function sortRows(rows = [], columns = [], sortKey = '', sortDir = 'asc') {
    const out = Array.isArray(rows) ? [...rows] : []
    if (!sortKey) {
        return out
    }

    const column = columns.find((entry) => entry.key === sortKey)
    if (!column || column.sortable === false) {
        return out
    }

    const direction = sortDir === 'desc' ? -1 : 1

    out.sort((aRow, bRow) => {
        const a = toComparable(getSortValue(aRow, column))
        const b = toComparable(getSortValue(bRow, column))

        if (a.type === 'number' && b.type === 'number') {
            return (a.value - b.value) * direction
        }

        if (a.value < b.value) {
            return -1 * direction
        }

        if (a.value > b.value) {
            return 1 * direction
        }

        return 0
    })

    return out
}

export function paginateRows(rows = [], page = 1, pageSize = 10) {
    const src = Array.isArray(rows) ? rows : []
    const size = Math.max(1, Number(pageSize) || UI_CONFIG.table.defaultPageSize)
    const totalItems = src.length
    const totalPages = Math.max(1, Math.ceil(totalItems / size))
    const pageNo = Math.min(totalPages, Math.max(1, Number(page) || 1))
    const start = (pageNo - 1) * size
    const end = Math.min(start + size, totalItems)

    return {
        items: src.slice(start, end),
        page: pageNo,
        pageSize: size,
        totalItems,
        totalPages,
        start: totalItems === 0 ? 0 : start + 1,
        end
    }
}

export function tableStateFor(tables, tableId, columns) {
    const fallback = defaultTableState[tableId] || { sortKey: '', sortDir: 'asc', page: 1, pageSize: UI_CONFIG.table.defaultPageSize }
    const saved = tables?.[tableId] || fallback
    const sortable = columns.filter((col) => col.sortable !== false)
    const sortStillExists = sortable.some((col) => col.key === saved.sortKey)
    const sortKey = sortStillExists
        ? saved.sortKey
        : (sortable[0]?.key || '')

    return {
        sortKey,
        sortDir: saved.sortDir === 'desc' ? 'desc' : 'asc',
        page: Math.max(1, Number(saved.page) || 1),
        pageSize: Math.max(1, Number(saved.pageSize) || UI_CONFIG.table.defaultPageSize)
    }
}
