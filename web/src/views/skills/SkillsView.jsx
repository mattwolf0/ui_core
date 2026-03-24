import { SkillIcon } from '../../icons.jsx'
import {
    formatClock,
    formatDecimal,
    formatLevelLabel,
    formatNumber,
    progressWidth
} from '../../displayFormat.js'
import {
    buildSkillsModel
} from '../../skillsModel.js'

function SkillSummary({ summary }) {
    const cards = [
        { label: 'Total XP', value: formatNumber(summary?.xp || 0) },
        { label: 'Tracked Skills', value: formatNumber(summary?.trackedSkills || 0) },
        { label: 'Combined Skill Levels', value: formatNumber(summary?.totalSkillLevels || 0) },
        { label: 'Average Skill Level', value: formatDecimal(summary?.averageLevel || 0) }
    ]

    const totalUnlocks = Number(summary?.totalUnlocks || 0)
    const nextUnlockLabel = totalUnlocks > 0
        ? (summary?.nextUnlockLevel ? formatLevelLabel(summary.nextUnlockLevel) : 'Complete')
        : 'Waiting'

    const unlockCards = [
        { label: 'Unlocked Extras', value: formatNumber(summary?.unlockCount || 0) },
        { label: 'Total Extras', value: formatNumber(totalUnlocks) },
        { label: 'Next Unlock', value: nextUnlockLabel }
    ]

    return (
        <article className="skills-hero ui-card">
            <div className="skills-hero-main">
                <div className="skills-hero-icon"><SkillIcon skillId="main" /></div>
                <div className="skills-hero-copy">
                    <span className="skills-kicker">{summary?.label || 'Main Level'}</span>
                    <h2>Level {summary?.level || 1}</h2>
                    <p>{summary?.description || 'Combined progression from every tracked discipline.'}</p>
                </div>
            </div>
            <div className="skills-meter">
                <div className="skills-meter-fill" style={{ width: `${progressWidth(summary?.progress || 0)}%` }} />
            </div>
            <div className="skills-meter-copy">
                <span>{formatNumber(summary?.currentLevelXp || 0)} / {formatNumber(summary?.nextLevelXp || 0)} XP this level</span>
                <strong>{formatNumber(summary?.remainingXp || 0)} XP to next</strong>
            </div>
            <div className="skills-summary-grid">
                {cards.map((card) => (
                    <article key={card.label} className="skills-summary-card">
                        <span>{card.label}</span>
                        <strong>{card.value}</strong>
                    </article>
                ))}
            </div>
            <div className="skills-unlock-overview">
                {unlockCards.map((card) => (
                    <article key={card.label} className="skills-unlock-summary-card">
                        <span>{card.label}</span>
                        <strong>{card.value}</strong>
                    </article>
                ))}
            </div>
        </article>
    )
}

function SkillActivity({ activity }) {
    if (!activity.length) {
        return (
            <article className="skills-activity ui-card">
                <div className="skills-section-head">
                    <div>
                        <h3>Recent Activity</h3>
                        <p>Fresh progression will appear here as you play.</p>
                    </div>
                </div>
                <div className="skills-empty-state">No tracked activity yet.</div>
            </article>
        )
    }

    return (
        <article className="skills-activity ui-card">
            <div className="skills-section-head">
                <div>
                    <h3>Recent Activity</h3>
                    <p>Latest skill gains synced from gameplay.</p>
                </div>
            </div>
            <div className="skills-activity-list">
                {activity.map((entry, index) => (
                    <article key={`${entry?.skill || 'skill'}-${index}`} className="skills-activity-item">
                        <div className="skills-activity-badge" style={{ '--skill-accent': entry?.accent || '#ffffff' }}>
                            <SkillIcon skillId={entry?.skill} />
                        </div>
                        <div className="skills-activity-copy">
                            <strong>{entry?.skillLabel || entry?.skill || 'Skill'}</strong>
                        <span>{entry?.sourceLabel || entry?.source || 'Activity'} - +{formatNumber(entry?.xp || 0)} XP</span>
                        </div>
                        <time>{formatClock(entry?.at)}</time>
                    </article>
                ))}
            </div>
        </article>
    )
}

function SkillUnlockCards({ unlocks, mode, emptyText }) {
    if (!unlocks.length) {
        return <div className="skills-empty-inline is-compact">{emptyText}</div>
    }

    return (
        <div className="skills-unlock-grid">
            {unlocks.map((unlock, index) => (
                <article key={`${unlock?.label || 'unlock'}-${index}`} className="skills-unlock-card">
                    <div className="skills-unlock-head">
                        <strong>{unlock?.label || 'Unlock'}</strong>
                        <span className={`skills-unlock-chip ${mode === 'next' ? 'is-next' : 'is-unlocked'}`}>
                            {mode === 'next' ? formatLevelLabel(unlock?.level) : 'Unlocked'}
                        </span>
                    </div>
                    <p>{unlock?.description || 'No details yet.'}</p>
                </article>
            ))}
        </div>
    )
}

function SkillUnlockTrack({ skill }) {
    const unlocked = Array.isArray(skill?.unlocks) ? skill.unlocks : []
    const nextUnlocks = Array.isArray(skill?.nextUnlocks) ? skill.nextUnlocks : []
    const totalUnlocks = Number(skill?.totalUnlocks || 0)
    const overview = totalUnlocks > 0
        ? `${formatNumber(skill?.unlockCount || 0)} / ${formatNumber(totalUnlocks)} unlocked`
        : 'No extras yet'
    const nextCopy = skill?.nextUnlockLevel
        ? `Next unlock threshold: ${formatLevelLabel(skill.nextUnlockLevel)}`
        : (totalUnlocks > 0 ? 'All extras are unlocked.' : 'No unlock track yet.')

    return (
        <section className="skills-block">
            <div className="skills-section-head">
                <div>
                    <h3>Level Unlocks</h3>
                    <p>{overview}. {nextCopy}</p>
                </div>
            </div>
            <div className="skills-unlock-columns">
                <section className="skills-unlock-group">
                    <div className="skills-unlock-group-head">
                        <strong>Unlocked</strong>
                        <span>{formatNumber(unlocked.length)}</span>
                    </div>
                    <SkillUnlockCards unlocks={unlocked} mode="unlocked" emptyText="No extras unlocked on this track yet." />
                </section>
                <section className="skills-unlock-group">
                    <div className="skills-unlock-group-head">
                        <strong>Coming Next</strong>
                        <span>{skill?.nextUnlockLevel ? formatLevelLabel(skill.nextUnlockLevel) : 'None'}</span>
                    </div>
                    <SkillUnlockCards unlocks={nextUnlocks} mode="next" emptyText="No upcoming extras right now." />
                </section>
            </div>
        </section>
    )
}

function SkillDetail({ skill }) {
    if (!skill) {
        return (
            <aside className="skills-detail ui-card">
                <div className="skills-empty-state">Select a skill to inspect its progression details.</div>
            </aside>
        )
    }

    const metrics = [
        { label: 'Current Level', value: `Lv ${formatNumber(skill?.level || 1)}` },
        { label: 'Total XP', value: formatNumber(skill?.xp || 0) },
        { label: 'Earn Rate', value: `${formatDecimal(skill?.gainMultiplier || 0)}%` },
        { label: 'Next Level', value: `${formatNumber(skill?.remainingXp || 0)} XP` }
    ]

    const stats = [
        { label: 'Tracked Actions', value: formatNumber(skill?.actions || 0) },
        { label: skill?.statLabel || 'Tracked Units', value: formatDecimal(skill?.totalUnits || 0) },
        { label: 'Skill Pressure', value: `x${formatDecimal(skill?.skillPenalty || 1)}` },
        { label: 'Global Pressure', value: `x${formatDecimal(skill?.globalPenalty || 1)}` }
    ]

    const sources = Array.isArray(skill?.sources) ? skill.sources : []

    return (
        <aside className="skills-detail ui-card">
            <div className="skills-detail-hero">
                <div className="skills-detail-icon" style={{ '--skill-accent': skill?.accent || '#ffffff' }}>
                    <SkillIcon skillId={skill?.id} />
                </div>
                <div className="skills-detail-copy">
                    <span className="skills-pill">Main Level {skill?.mainLevel || 1}</span>
                    <h3>{skill?.label || 'Skill'}</h3>
                    <p>{skill?.description || 'No notes for this skill yet.'}</p>
                </div>
            </div>

            <div className="skills-metric-grid">
                {metrics.map((metric) => (
                    <article key={metric.label} className="skills-metric">
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                    </article>
                ))}
            </div>

            <div className="skills-meter">
                <div
                    className="skills-meter-fill"
                    style={{ width: `${progressWidth(skill?.progress || 0)}%`, '--skill-accent': skill?.accent || '#ffffff' }}
                />
            </div>
            <div className="skills-meter-copy">
                <span>{formatNumber(skill?.currentLevelXp || 0)} / {formatNumber(skill?.nextLevelXp || 0)} XP this level</span>
                <strong>{skill?.topSourceLabel || 'No activity yet'}</strong>
            </div>

            <div className="skills-stat-strip">
                {stats.map((stat) => (
                    <article key={stat.label} className="skills-stat-pill">
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                    </article>
                ))}
            </div>

            <section className="skills-block">
                <div className="skills-section-head">
                    <div>
                        <h3>XP Sources</h3>
                        <p>Where this skill has gained XP.</p>
                    </div>
                </div>
                {sources.length > 0 ? (
                    <div className="skills-source-grid">
                        {sources.map((source, index) => (
                            <article key={`${source?.label || 'source'}-${index}`} className="skills-source-card">
                                <div className="skills-source-head">
                                    <strong>{source?.label || 'Activity'}</strong>
                                    <span>{formatNumber(source?.xp || 0)} XP</span>
                                </div>
                                <p>{source?.description || 'No notes for this activity yet.'}</p>
                                <div className="skills-source-meta">
                                    <span>{formatNumber(source?.actions || 0)} actions</span>
                                    <span>{formatDecimal(source?.units || 0)} {source?.unitLabel || 'units'}</span>
                                    <span>{source?.share || 0}% share</span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="skills-empty-inline">No XP activity found for this skill.</div>
                )}
            </section>

            <SkillUnlockTrack skill={skill} />
        </aside>
    )
}

export function SkillsView({ panel, skillsUi, onSelectSkill }) {
    const model = buildSkillsModel(panel, skillsUi)

    return (
        <>
            <section className="skills-overview-grid">
                <SkillSummary summary={model.summary} />
                <SkillActivity activity={model.activity} />
            </section>
            <section className="skills-layout">
                <div className="skills-list ui-card">
                    <div className="skills-section-head">
                        <div>
                            <h3>Tracked Disciplines</h3>
                            <p>Each discipline levels on its own and feeds the main level.</p>
                        </div>
                    </div>
                    <div className="skills-card-grid">
                        {model.list.map((skill) => (
                            <button
                                key={skill?.id || skill?.label}
                                type="button"
                                className={`skills-card ${String(skill?.id || '') === String(model.selectedSkill?.id || '') ? 'is-selected' : ''}`}
                                onClick={() => onSelectSkill(skill?.id)}
                            >
                                <div className="skills-card-icon" style={{ '--skill-accent': skill?.accent || '#ffffff' }}>
                                    <SkillIcon skillId={skill?.id} />
                                </div>
                                <div className="skills-card-copy">
                                    <div className="skills-card-topline">
                                        <div>
                                            <h3>{skill?.label || 'Unnamed skill'}</h3>
                                            <p>{skill?.topSourceLabel || 'No activity yet'}</p>
                                        </div>
                                        <span className="skills-pill">Lv {skill?.level || 1}</span>
                                    </div>
                                    <div className="skills-meter is-compact">
                                        <div
                                            className="skills-meter-fill"
                                            style={{ width: `${progressWidth(skill?.progress || 0)}%`, '--skill-accent': skill?.accent || '#ffffff' }}
                                        />
                                    </div>
                                    <div className="skills-card-meta">
                                        <span>{formatNumber(skill?.xp || 0)} XP</span>
                                        <span>{skill?.gainMultiplier || 0}% earn rate</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <SkillDetail skill={model.selectedSkill} />
            </section>
        </>
    )
}
