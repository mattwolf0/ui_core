import { Modal } from './components/common/Modal.jsx'
import { Tabs } from './components/common/Tabs.jsx'
import { Toasts } from './components/common/Toasts.jsx'
import { CraftingHeader, DefaultHeader, SkillsHeader } from './components/layout/PanelHeaders.jsx'
import { useUiCoreApp } from './hooks/useUiCoreApp.js'
import { CraftingView } from './views/crafting/CraftingView.jsx'
import { LogsView } from './views/management/LogsView.jsx'
import { MembersView } from './views/management/MembersView.jsx'
import { OverviewView } from './views/management/OverviewView.jsx'
import { RanksView } from './views/management/RanksView.jsx'
import { StorageView } from './views/management/StorageView.jsx'
import { SkillsView } from './views/skills/SkillsView.jsx'

function pickPanelBody(ui) {
    const { appState, rankForm, setRankForm } = ui
    const panel = appState.panel

    // Crafting and skills use standalone views; management panels stay tab-driven.
    if (panel.view === 'crafting') {
        return (
            <CraftingView
                panel={panel}
                craftingUi={appState.craftingUi}
                onSearchChange={ui.setCraftingSearch}
                onFilterChange={ui.setCraftingFilter}
                onSelectRecipe={ui.selectCraftingRecipe}
                onQuantityChange={ui.adjustCraftingQuantity}
                onSubmit={ui.handleCraftingSubmit}
            />
        )
    }

    if (panel.view === 'skills') {
        return (
            <SkillsView
                panel={panel}
                skillsUi={appState.skillsUi}
                onSelectSkill={ui.selectSkill}
            />
        )
    }

    if (panel.activeTab === 'members') {
        return (
            <MembersView
                panel={panel}
                filters={appState.filters}
                tables={appState.tables}
                onFilterChange={ui.updateFilter}
                onSort={ui.tableSort}
                onPageMove={ui.tablePageMove}
                onPageSizeChange={ui.tableSizeChange}
                onHire={ui.handleHireMember}
                onRefresh={ui.handleMembersRefresh}
                onPromote={ui.handlePromoteMember}
                onDemote={ui.handleDemoteMember}
                onSetRank={ui.handleSetMemberRank}
                onFire={ui.handleFireMember}
            />
        )
    }

    if (panel.activeTab === 'ranks') {
        return (
            <RanksView
                panel={panel}
                tables={appState.tables}
                permissionDraft={appState.permissionDraft}
                rankForm={rankForm}
                setRankForm={setRankForm}
                onSort={ui.tableSort}
                onPageMove={ui.tablePageMove}
                onPageSizeChange={ui.tableSizeChange}
                onRename={ui.handleRenameRank}
                onDelete={ui.handleDeleteRank}
                onCreate={ui.handleCreateRank}
                onPermissionsSave={ui.handlePermissionsSave}
                onPermissionsReset={ui.handlePermissionsReset}
                onPermissionToggle={ui.togglePermission}
            />
        )
    }

    if (panel.activeTab === 'storage') {
        return (
            <StorageView
                panel={panel}
                tables={appState.tables}
                onSort={ui.tableSort}
                onPageMove={ui.tablePageMove}
                onPageSizeChange={ui.tableSizeChange}
            />
        )
    }

    if (panel.activeTab === 'logs') {
        return (
            <LogsView
                panel={panel}
                filters={appState.filters}
                tables={appState.tables}
                onFilterChange={ui.updateFilter}
                onSort={ui.tableSort}
                onPageMove={ui.tablePageMove}
                onPageSizeChange={ui.tableSizeChange}
                onRefresh={ui.handleLogsRefresh}
            />
        )
    }

    return <OverviewView panel={panel} />
}

function App() {
    const ui = useUiCoreApp()
    const { appState } = ui
    const panel = appState.panel
    const isCraftingView = panel.view === 'crafting'
    const isSkillsView = panel.view === 'skills'
    const content = pickPanelBody(ui)

    return (
        <div className={`ui-root ${appState.visible ? 'is-visible' : ''}`} aria-hidden={String(!appState.visible)}>
            {appState.visible ? (
                <>
                    <div className="ui-backdrop" onClick={ui.closeNui} />
                    <section
                        className={`ui-shell${isCraftingView ? ' ui-shell-crafting' : ''}${isSkillsView ? ' ui-shell-skills' : ''}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="ui_core panel"
                    >
                        {isCraftingView ? (
                            <CraftingHeader panel={panel} onClose={ui.closeNui} />
                        ) : isSkillsView ? (
                            <SkillsHeader panel={panel} onClose={ui.closeNui} />
                        ) : (
                            <DefaultHeader panel={panel} theme={appState.theme} onThemeCycle={ui.cycleTheme} onClose={ui.closeNui} />
                        )}

                        {isCraftingView || isSkillsView ? null : (
                            <nav className="ui-tabs">
                                <Tabs tabs={panel.tabs} activeTab={panel.activeTab} onSelect={ui.setActiveTab} />
                            </nav>
                        )}

                        <main className={`ui-main${isCraftingView ? ' ui-main-crafting' : ''}${isSkillsView ? ' ui-main-skills' : ''}`}>
                            {content}
                        </main>

                        <Modal modal={appState.modal} onCancel={ui.closeModal} onConfirm={ui.confirmModalAction} onInputChange={ui.updateModalInput} />
                        <Toasts toasts={appState.toasts} />
                    </section>
                </>
            ) : null}
        </div>
    )
}

export default App
