import { DataTable } from '../../components/common/DataTable.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'

export function MembersView({
    panel,
    filters,
    tables,
    onFilterChange,
    onSort,
    onPageMove,
    onPageSizeChange,
    onHire,
    onRefresh,
    onPromote,
    onDemote,
    onSetRank,
    onFire
}) {
    const rows = Array.isArray(panel.members) ? panel.members : []
    const q = filters.memberSearch.trim().toLowerCase()
    const memberStatus = filters.memberStatus

    // This only filters the rows we already have.
    const filtered = []
    let idx = 0
    while (idx < rows.length) {
        const member = rows[idx]
        const status = String(member.status || 'offline').toLowerCase()
        const haystack = `${member.name || ''} ${member.rank || ''} ${member.charId || ''} ${member.serverId || ''}`.toLowerCase()

        if (memberStatus === 'all' || status === memberStatus) {
            if (!q || haystack.includes(q)) {
                filtered.push(member)
            }
        }

        idx += 1
    }
    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        {
            key: 'serverId',
            label: 'Server ID',
            sortable: true,
            sortValue: (row) => Number(row.serverId || 0),
            render: (row) => row.serverId ? <span className="ui-mono">{row.serverId}</span> : '-'
        },
        {
            key: 'charId',
            label: 'Char ID',
            sortable: true,
            sortValue: (row) => Number(row.charId || 0),
            render: (row) => <span className="ui-mono">{row.charId}</span>
        },
        { key: 'rank', label: 'Rank', sortable: true },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => <StatusPill status={row.status} />
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (row) => (
                <div className="ui-row ui-row-tight">
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onPromote(row.charId)}>Promote</button>
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onDemote(row.charId)}>Demote</button>
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onSetRank(row.charId, row.rank)}>Set rank</button>
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onFire(row.charId, row.name)}>Remove</button>
                </div>
            )
        }
    ]

    return (
        <>
            <div className="ui-row">
                <input
                    className="ui-input"
                    type="search"
                    placeholder="Search name, rank, character ID, or server ID"
                    value={filters.memberSearch}
                    onChange={(event) => onFilterChange('memberSearch', event.target.value, 'members')}
                />
                <select
                    className="ui-select"
                    value={filters.memberStatus}
                    onChange={(event) => onFilterChange('memberStatus', event.target.value, 'members')}
                >
                    <option value="all">All statuses</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
                <button type="button" className="ui-btn ui-btn-primary" onClick={onHire}>Hire member</button>
                <button type="button" className="ui-btn" onClick={onRefresh}>Refresh</button>
            </div>
            <DataTable
                tableId="members"
                columns={columns}
                rows={filtered}
                rowKey="charId"
                tables={tables}
                emptyText="No members found for the current filters."
                onSort={onSort}
                onPageMove={onPageMove}
                onPageSizeChange={onPageSizeChange}
            />
        </>
    )
}
