export function OverviewView({ panel }) {
    const stats = Array.isArray(panel?.overview?.stats) ? panel.overview.stats : []
    const highlights = Array.isArray(panel?.overview?.highlights) ? panel.overview.highlights : []

    return (
        <section className="ui-grid">
            {stats.length > 0 ? stats.map((stat, index) => (
                <article key={`${stat.label}-${index}`} className="ui-card ui-stat">
                    <div className="ui-stat-label">{stat.label}</div>
                    <div className="ui-stat-value">{stat.value}</div>
                </article>
            )) : <div className="ui-empty">No overview stats yet.</div>}
            {highlights.length > 0 ? (
                <article className="ui-card ui-highlight">
                    <ul>
                        {highlights.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                    </ul>
                </article>
            ) : (
                <div className="ui-empty">No notes for this panel yet.</div>
            )}
        </section>
    )
}
