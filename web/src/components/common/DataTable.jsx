import { UI_CONFIG } from '../../config/uiConfig.js'
import { paginateRows, sortRows, tableStateFor } from '../../tableRows.js'

export function DataTable({
    tableId,
    columns,
    rows,
    rowKey,
    tables,
    emptyText,
    onSort,
    onPageMove,
    onPageSizeChange
}) {
    const sort = tableStateFor(tables, tableId, columns)
    const sorted = sortRows(rows, columns, sort.sortKey, sort.sortDir)
    const pager = paginateRows(sorted, sort.page, sort.pageSize)

    return (
        <div className="ui-table-wrap ui-card" data-scroll-key={`table:${tableId}`}>
            <table className="ui-table">
                <thead>
                    <tr>
                        {columns.map((column) => {
                            if (column.sortable === false) {
                                return <th key={column.key}>{column.label}</th>
                            }

                            const isActive = sort.sortKey === column.key
                            const icon = isActive ? (sort.sortDir === 'desc' ? 'v' : '^') : '-'

                            return (
                                <th key={column.key}>
                                    <button
                                        type="button"
                                        className={`ui-th-btn ${isActive ? 'is-active' : ''}`}
                                        onClick={() => onSort(tableId, column.key)}
                                    >
                                        <span>{column.label}</span>
                                        <span className="ui-sort-icon">{icon}</span>
                                    </button>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {pager.items.length > 0 ? (
                        pager.items.map((row, index) => (
                            <tr key={row?.[rowKey] ?? index}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {typeof column.render === 'function'
                                            ? column.render(row)
                                            : String(row?.[column.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>
                                <div className="ui-empty">{emptyText}</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <footer className="ui-table-footer">
                <div className="ui-table-meta">
                    Showing {pager.start}-{pager.end} of {pager.totalItems}
                </div>
                <div className="ui-table-controls">
                    <select
                        className="ui-select ui-select-compact"
                        value={sort.pageSize}
                        onChange={(event) => onPageSizeChange(tableId, event.target.value)}
                    >
                        {UI_CONFIG.table.pageSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="ui-btn ui-btn-sm"
                        disabled={pager.page <= 1}
                        onClick={() => onPageMove(tableId, -1)}
                    >
                        Prev
                    </button>
                    <span className="ui-table-page">Page {pager.page} / {pager.totalPages}</span>
                    <button
                        type="button"
                        className="ui-btn ui-btn-sm"
                        disabled={pager.page >= pager.totalPages}
                        onClick={() => onPageMove(tableId, 1)}
                    >
                        Next
                    </button>
                </div>
            </footer>
        </div>
    )
}
