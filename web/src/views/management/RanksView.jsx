import { DataTable } from '../../components/common/DataTable.jsx'
import { PermissionMatrix } from '../../components/common/PermissionMatrix.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'

export function RanksView({
    panel,
    tables,
    permissionDraft,
    rankForm,
    setRankForm,
    onSort,
    onPageMove,
    onPageSizeChange,
    onRename,
    onDelete,
    onCreate,
    onPermissionsSave,
    onPermissionsReset,
    onPermissionToggle
}) {
    const ranks = Array.isArray(panel.ranks) ? panel.ranks : []
    // HTML input limits are only hints; server-side rank rules still win.
    const maxRankWeight = 999

    const columns = [
        {
            key: 'name',
            label: 'Rank',
            sortable: true,
            render: (row) => <strong>{row.name}</strong>
        },
        {
            key: 'weight',
            label: 'Weight',
            sortable: true,
            sortValue: (row) => Number(row.weight || 0),
            render: (row) => <span className="ui-mono">{row.weight}</span>
        },
        {
            key: 'permissions',
            label: 'Enabled Permissions',
            sortable: true,
            sortValue: (row) => Object.values(row.permissions || {}).filter(Boolean).length,
            render: (row) => {
                const total = Object.keys(row.permissions || {}).length
                const enabled = Object.values(row.permissions || {}).filter(Boolean).length
                return <span className="ui-mono">{enabled} / {total}</span>
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            sortable: false,
            render: (row) => (
                <div className="ui-row ui-row-tight">
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onRename(row.id, row.name)}>Rename</button>
                    <button type="button" className="ui-btn ui-btn-sm" onClick={() => onDelete(row.id)}>Delete</button>
                </div>
            )
        }
    ]

    return (
        <>
            <div className="ui-row">
                <input
                    className="ui-input"
                    type="text"
                    placeholder="Rank name"
                    value={rankForm.name}
                    onChange={(event) => setRankForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                    className="ui-input"
                    type="number"
                    placeholder="Rank weight"
                    min="0"
                    max={maxRankWeight}
                    value={rankForm.weight}
                    onChange={(event) => setRankForm((prev) => ({ ...prev, weight: event.target.value }))}
                />
                <button type="button" className="ui-btn ui-btn-primary" onClick={onCreate}>Create rank</button>
                <button type="button" className="ui-btn" onClick={onPermissionsSave}>Save permissions</button>
                <button type="button" className="ui-btn" onClick={onPermissionsReset}>Reset permissions</button>
            </div>
            <DataTable
                tableId="ranks"
                columns={columns}
                rows={ranks}
                rowKey="id"
                tables={tables}
                emptyText="No ranks added yet."
                onSort={onSort}
                onPageMove={onPageMove}
                onPageSizeChange={onPageSizeChange}
            />
            <PermissionMatrix ranks={ranks} draft={permissionDraft} onToggle={onPermissionToggle} />
        </>
    )
}
