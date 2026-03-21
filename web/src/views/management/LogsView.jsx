import { DataTable } from '../../components/common/DataTable.jsx'
import { formatIsoDate } from '../../displayFormat.js'

export function LogsView({
    panel,
    filters,
    tables,
    onFilterChange,
    onSort,
    onPageMove,
    onPageSizeChange,
    onRefresh
}) {
    const logs = Array.isArray(panel.logs) ? panel.logs : []
    const category = filters.logCategory
    const actorNeedle = filters.logActor.trim().toLowerCase()
    const searchNeedle = filters.logSearch.trim().toLowerCase()

    const filtered = logs.filter((entry) => {
        if (category !== 'all' && entry.category !== category) {
            return false
        }

        if (actorNeedle && !String(entry.actor || '').toLowerCase().includes(actorNeedle)) {
            return false
        }

        if (searchNeedle) {
            const haystack = `${entry.actor || ''} ${entry.action || ''} ${entry.target || ''} ${entry.category || ''}`.toLowerCase()
            if (!haystack.includes(searchNeedle)) {
                return false
            }
        }

        return true
    })

    const columns = [
        { key: 'actor', label: 'Actor', sortable: true },
        { key: 'action', label: 'Action', sortable: true },
        { key: 'target', label: 'Target', sortable: true },
        {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (row) => <span className="ui-mono">{row.category}</span>
        },
        {
            key: 'time',
            label: 'Time',
            sortable: true,
            sortValue: (row) => new Date(row.time || 0).getTime(),
            render: (row) => formatIsoDate(row.time)
        }
    ]

    return (
        <>
            <div className="ui-row">
                <select
                    className="ui-select"
                    value={filters.logCategory}
                    onChange={(event) => onFilterChange('logCategory', event.target.value, 'logs')}
                >
                    <option value="all">All categories</option>
                    <option value="storage">Storage</option>
                    <option value="rank">Rank</option>
                    <option value="member">Member</option>
                </select>
                <input
                    className="ui-input"
                    type="search"
                    placeholder="Filter by actor"
                    value={filters.logActor}
                    onChange={(event) => onFilterChange('logActor', event.target.value, 'logs')}
                />
                <input
                    className="ui-input"
                    type="search"
                    placeholder="Search action or target"
                    value={filters.logSearch}
                    onChange={(event) => onFilterChange('logSearch', event.target.value, 'logs')}
                />
                <button type="button" className="ui-btn" onClick={onRefresh}>Refresh</button>
            </div>
            <DataTable
                tableId="logs"
                columns={columns}
                rows={filtered}
                rowKey="id"
                tables={tables}
                emptyText="No audit entries found for the current filters."
                onSort={onSort}
                onPageMove={onPageMove}
                onPageSizeChange={onPageSizeChange}
            />
        </>
    )
}
