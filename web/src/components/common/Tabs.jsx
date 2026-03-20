export function Tabs({ tabs, activeTab, onSelect }) {
    if (!Array.isArray(tabs) || tabs.length === 0) {
        return null
    }

    return (
        <>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`ui-btn ui-btn-tab ${tab.id === activeTab ? 'is-active' : ''}`}
                    onClick={() => onSelect(tab.id)}
                >
                    {tab.label ?? tab.id}
                </button>
            ))}
        </>
    )
}
