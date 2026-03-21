import { CraftingIcon, MainIcon } from '../../icons.jsx'

export function DefaultHeader({ panel, theme, onThemeCycle, onClose }) {
    return (
        <header className="ui-header">
            <div className="ui-heading">
                <h1 className="ui-title">{panel.title || 'Resource Panel'}</h1>
                <p className="ui-subtitle">{panel.subtitle || ''}</p>
            </div>
            <div className="ui-controls">
                {panel.showThemeSwitch === false ? null : (
                    <button type="button" className="ui-btn ui-btn-ghost" onClick={() => onThemeCycle(theme)}>
                        Theme: {theme}
                    </button>
                )}
                <button type="button" className="ui-btn" onClick={onClose}>
                    {panel.closeLabel || 'Close'}
                </button>
            </div>
        </header>
    )
}

export function CraftingHeader({ panel, onClose }) {
    return (
        <header className="ui-header crafting-header">
            <div className="crafting-heading-wrap">
                <div className="crafting-heading-icon"><CraftingIcon /></div>
                <div className="ui-heading">
                    <h1 className="ui-title">{panel.title || 'Crafting Bench'}</h1>
                    <p className="ui-subtitle">{panel.subtitle || 'Recipes, materials, and batch checks'}</p>
                </div>
                <div className="crafting-header-badge">
                    <span>{panel?.headerBadge?.label || 'Crafting level'}</span>
                    <strong>{panel?.headerBadge?.value || '1'}</strong>
                </div>
            </div>
            <div className="ui-controls">
                <button type="button" className="ui-btn" onClick={onClose}>
                    {panel.closeLabel || 'Close'}
                </button>
            </div>
        </header>
    )
}

export function SkillsHeader({ panel, onClose }) {
    return (
        <header className="ui-header skills-header">
            <div className="skills-header-wrap">
                <div className="skills-header-icon"><MainIcon /></div>
                <div className="ui-heading">
                    <h1 className="ui-title">{panel.title || 'Skill Matrix'}</h1>
                    <p className="ui-subtitle">{panel.subtitle || 'Levels, XP, and recent gains'}</p>
                </div>
                <div className="skills-header-badge">
                    <span>{panel?.headerBadge?.label || 'Main level'}</span>
                    <strong>{panel?.headerBadge?.value || '1'}</strong>
                </div>
            </div>
            <div className="ui-controls">
                <button type="button" className="ui-btn" onClick={onClose}>
                    {panel.closeLabel || 'Close'}
                </button>
            </div>
        </header>
    )
}
