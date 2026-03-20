export function StatusPill({ status }) {
    const clean = typeof status === 'string' ? status.toLowerCase() : 'offline'
    const cls = clean === 'online'
        ? 'ui-pill-online'
        : clean === 'readonly'
            ? 'ui-pill-readonly'
            : 'ui-pill-offline'
    const label = clean === 'readonly' ? 'Read only' : clean

    return <span className={`ui-pill ${cls}`}>{label}</span>
}
