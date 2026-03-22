export function PermissionMatrix({ ranks, draft, onToggle }) {
    if (!Array.isArray(ranks) || ranks.length === 0) {
        return <div className="ui-empty">No rank permissions to show.</div>
    }

    const permissionSet = new Set()
    for (const rank of ranks) {
        for (const permission of Object.keys(rank?.permissions || {})) {
            permissionSet.add(permission)
        }
    }

    const permissions = [...permissionSet]
    if (permissions.length === 0) {
        return <div className="ui-empty">These ranks do not have permission flags yet.</div>
    }

    return (
        <section className="ui-card ui-perm-card">
            <div className="ui-section-head">
                <h3 className="ui-section-title">Rank Permissions</h3>
                <p className="ui-subtle">Toggle what each rank can do, then save the draft.</p>
            </div>
            <div className="ui-table-wrap" data-scroll-key="permission-matrix">
                <table className="ui-table ui-perm-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            {permissions.map((permission) => (
                                <th key={permission}><span className="ui-mono">{permission}</span></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ranks.map((rank) => {
                            const rankId = String(rank?.id ?? '')
                            const rankDraft = draft[rankId] || {}

                            return (
                                <tr key={rankId}>
                                    <td><strong>{rank?.name ?? rankId}</strong></td>
                                    {permissions.map((permission) => (
                                        <td key={permission}>
                                            <label className="ui-checkbox-wrap">
                                                <input
                                                    type="checkbox"
                                                    className="ui-perm-checkbox"
                                                    checked={Boolean(rankDraft[permission])}
                                                    onChange={(event) => onToggle(rankId, permission, event.target.checked)}
                                                />
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
