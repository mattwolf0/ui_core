import { DataTable } from '../../components/common/DataTable.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'

export function StorageView({ panel, tables, onSort, onPageMove, onPageSizeChange }) {
    const srcRows = Array.isArray(panel.storage) ? panel.storage : []
    const rows = []

    // Storage actions are not exposed here, so rows are marked read-only.
    for (const entry of srcRows) {
        rows.push({
            ...entry,
            mode: 'readonly'
        })
    }

    const columns = [
        {
            key: 'item',
            label: 'Item',
            sortable: true,
            render: (row) => <span className="ui-mono">{row.item}</span>
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            sortValue: (row) => Number(row.amount || 0)
        },
        {
            key: 'weight',
            label: 'Weight (kg)',
            sortable: true,
            sortValue: (row) => Number(row.weight || 0)
        },
        {
            key: 'mode',
            label: 'Mode',
            sortable: false,
            render: (row) => <StatusPill status={row.mode} />
        }
    ]

    return (
        <DataTable
            tableId="storage"
            columns={columns}
            rows={rows}
            rowKey="item"
            tables={tables}
            emptyText="Storage is empty."
            onSort={onSort}
            onPageMove={onPageMove}
            onPageSizeChange={onPageSizeChange}
        />
    )
}
