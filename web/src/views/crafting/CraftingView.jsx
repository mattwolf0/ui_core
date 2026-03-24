import { CraftingIcon, SearchIcon } from '../../icons.jsx'
import { UI_CONFIG } from '../../config/uiConfig.js'
import { formatKg, progressWidth } from '../../displayFormat.js'
import {
    buildCraftingModel,
    inventoryUsage,
    statusTone
} from '../../craftingModel.js'

function CraftingRecipeCard({ recipe, selected, onSelect }) {
    return (
        <button
            type="button"
            className={`crafting-card ${selected ? 'is-selected' : ''}`}
            onClick={() => onSelect(recipe.id)}
        >
            <div className="crafting-card-media">
                {recipe?.image ? (
                    <img className="crafting-card-image" src={recipe.image} alt={recipe.label || recipe.name} loading="lazy" />
                ) : (
                    <div className="crafting-card-fallback">{String(recipe?.label || recipe?.name || '?').slice(0, 1)}</div>
                )}
                <span className="crafting-card-output">x{recipe?.outputLabel || '1'}</span>
            </div>
            <div className="crafting-card-body">
                <div className="crafting-card-topline">
                    <div>
                        <h3 className="crafting-card-title">{recipe?.label || recipe?.name || 'Unnamed recipe'}</h3>
                        <p className="crafting-card-subtitle">Crafting Level {recipe?.requiredLevel || 1}</p>
                    </div>
                    <span className={`crafting-status is-${statusTone(recipe?.status)}`}>{recipe?.statusLabel || 'Unknown'}</span>
                </div>
                <div className="crafting-card-meta">
                    <span>{recipe?.durationLabel || '0s'}</span>
                    <span>{(recipe?.ingredients || []).length} ingredients</span>
                    <span>{recipe?.outputWeightKg || '0.0'} kg</span>
                </div>
            </div>
        </button>
    )
}

function CraftingDetail({ model, onQuantityChange, onSubmit }) {
    const { crafting, selectedRecipe, quantity } = model
    const progression = crafting?.progression || {}

    if (!selectedRecipe) {
        return (
            <aside className="crafting-detail ui-card">
                <div className="crafting-detail-empty">
                    <div className="crafting-detail-empty-icon"><CraftingIcon /></div>
                    <h3>Select a recipe</h3>
                    <p>Choose a blueprint from the list to inspect requirements and start crafting.</p>
                </div>
            </aside>
        )
    }

    return (
        <aside className="crafting-detail ui-card">
            <div className="crafting-detail-hero">
                <div className="crafting-detail-media">
                    {selectedRecipe.image ? (
                        <img className="crafting-detail-image" src={selectedRecipe.image} alt={selectedRecipe.label || selectedRecipe.name} loading="lazy" />
                    ) : (
                        <div className="crafting-detail-fallback">{String(selectedRecipe.label || selectedRecipe.name || '?').slice(0, 1)}</div>
                    )}
                    <span className="crafting-detail-output">x{selectedRecipe.outputLabel || '1'}</span>
                </div>
                <div className="crafting-detail-copy">
                    <div className={`crafting-status is-${statusTone(selectedRecipe.status)}`}>{selectedRecipe.statusLabel || 'Unknown'}</div>
                    <h3 className="crafting-detail-title">{selectedRecipe.label || selectedRecipe.name || 'Unnamed recipe'}</h3>
                    <p className="crafting-detail-description">{selectedRecipe.description || 'No notes for this recipe yet.'}</p>
                </div>
            </div>

            <div className="crafting-metric-grid">
                <article className="crafting-metric">
                    <span className="crafting-metric-label">Duration</span>
                    <strong>{selectedRecipe.durationLabel || '0s'}</strong>
                </article>
                <article className="crafting-metric">
                    <span className="crafting-metric-label">Output</span>
                    <strong>x{selectedRecipe.outputLabel || '1'}</strong>
                </article>
                <article className="crafting-metric">
                    <span className="crafting-metric-label">Crafting level</span>
                    <strong>{selectedRecipe.requiredLevel || 1}</strong>
                </article>
                <article className="crafting-metric">
                    <span className="crafting-metric-label">Main level</span>
                    <strong>{progression.mainLevel || 1}</strong>
                </article>
                <article className="crafting-metric">
                    <span className="crafting-metric-label">Projected carry</span>
                    <strong>{selectedRecipe.projectedWeightKg || '0.0'} kg</strong>
                </article>
            </div>

            <section className="crafting-progress-grid">
                <article className="crafting-progress-card">
                    <div className="crafting-progress-head">
                        <span>Crafting skill</span>
                        <strong>Level {progression.level || 1}</strong>
                    </div>
                    <div className="crafting-meter">
                        <div className="crafting-meter-fill" style={{ width: `${progressWidth(progression.progress)}%` }} />
                    </div>
                    <div className="crafting-progress-copy">{progression.xp || 0} XP</div>
                </article>
                <article className="crafting-progress-card">
                    <div className="crafting-progress-head">
                        <span>Carry weight</span>
                        <strong>
                            {crafting?.inventory?.currentWeightKg || formatKg(crafting?.inventory?.currentWeight)} / {crafting?.inventory?.maxWeightKg || formatKg(crafting?.inventory?.maxWeight)} kg
                        </strong>
                    </div>
                    <div className="crafting-meter">
                        <div className="crafting-meter-fill is-warning" style={{ width: `${progressWidth(inventoryUsage(crafting))}%` }} />
                    </div>
                    <div className="crafting-progress-copy">{crafting?.progression?.crafts || 0} successful crafts</div>
                </article>
            </section>

            <section className="crafting-block">
                <div className="crafting-block-head">
                    <h4>Required Components</h4>
                    <span>{(selectedRecipe.ingredients || []).length} tracked</span>
                </div>
                <div className="crafting-ingredient-list">
                    {(selectedRecipe.ingredients || []).length > 0 ? selectedRecipe.ingredients.map((ingredient, index) => (
                        <article key={`${ingredient?.name || 'ingredient'}-${index}`} className={`crafting-ingredient ${ingredient?.satisfied ? 'is-complete' : 'is-missing'}`}>
                            <div className="crafting-ingredient-media">
                                {ingredient?.image ? (
                                    <img className="crafting-ingredient-image" src={ingredient.image} alt={ingredient.label || ingredient.name} loading="lazy" />
                                ) : (
                                    <div className="crafting-ingredient-fallback">{String(ingredient?.label || ingredient?.name || '?').slice(0, 1)}</div>
                                )}
                            </div>
                            <div className="crafting-ingredient-copy">
                                <div className="crafting-ingredient-name">{ingredient?.label || ingredient?.name || 'Unnamed component'}</div>
                                <div className="crafting-ingredient-values">
                                    <span>Need {ingredient?.requiredText || ingredient?.required || 0}</span>
                                    <span>Have {ingredient?.availableText || ingredient?.available || 0}</span>
                                </div>
                            </div>
                        </article>
                    )) : <div className="crafting-empty-inline">This recipe has no component list.</div>}
                </div>
            </section>

            {selectedRecipe?.minigame ? (
                <section className="crafting-block">
                    <div className="crafting-block-head">
                        <h4>Assembly Check</h4>
                        <span>{selectedRecipe.minigame.difficulty || 'easy'}</span>
                    </div>
                    <p className="crafting-block-copy">
                        {selectedRecipe.minigame.description || 'Complete the required sequence before crafting begins.'}
                    </p>
                    <div className="crafting-chip-row">
                        <span className="crafting-chip">{selectedRecipe.minigame.label || 'Precision assembly'}</span>
                        <span className="crafting-chip">{selectedRecipe.minigame.stages || 1} stages</span>
                        <span className="crafting-chip">{selectedRecipe.minigame.profile || 'assembly'}</span>
                    </div>
                </section>
            ) : null}

            {selectedRecipe.lockedReason ? <div className="crafting-lock-message">{selectedRecipe.lockedReason}</div> : null}

            <section className="crafting-detail-actions">
                <div className="crafting-quantity">
                    <span className="crafting-quantity-label">Batch size</span>
                    <div className="crafting-quantity-controls">
                        <button type="button" className="crafting-stepper" disabled={quantity <= UI_CONFIG.crafting.minQuantity} onClick={() => onQuantityChange(-1)}>-</button>
                        <span className="crafting-quantity-value">{quantity}</span>
                        <button type="button" className="crafting-stepper" disabled={quantity >= UI_CONFIG.crafting.maxQuantity} onClick={() => onQuantityChange(1)}>+</button>
                    </div>
                </div>
                <button
                    type="button"
                    className="ui-btn ui-btn-primary crafting-submit"
                    disabled={!selectedRecipe.canCraft}
                    onClick={onSubmit}
                >
                    {selectedRecipe.canCraft ? `Craft x${quantity}` : 'Unavailable'}
                </button>
            </section>
        </aside>
    )
}

export function CraftingView({ panel, craftingUi, onSearchChange, onFilterChange, onSelectRecipe, onQuantityChange, onSubmit }) {
    const model = buildCraftingModel(panel, craftingUi)
    const crafting = model.crafting
    const selectedRecipeId = String(model.selectedRecipe?.id ?? '')

    return (
        <>
            <section className="crafting-toolbar">
                <label className="crafting-search">
                    <span className="crafting-search-icon"><SearchIcon /></span>
                    <input
                        className="crafting-search-input"
                        type="search"
                        value={craftingUi.search || ''}
                        placeholder="Search recipes"
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </label>
                <div className="crafting-filter-group" role="tablist" aria-label="Recipe filters">
                    <button type="button" className={`crafting-filter ${craftingUi.filter === 'all' ? 'is-active' : ''}`} onClick={() => onFilterChange('all')}>
                        All
                    </button>
                    <button type="button" className={`crafting-filter ${craftingUi.filter === 'craftable' ? 'is-active' : ''}`} onClick={() => onFilterChange('craftable')}>
                        Craftable {Number(crafting?.stats?.craftable || 0)}
                    </button>
                    <button type="button" className={`crafting-filter ${craftingUi.filter === 'locked' ? 'is-active' : ''}`} onClick={() => onFilterChange('locked')}>
                        Locked {Number(crafting?.stats?.locked || 0)}
                    </button>
                    <button type="button" className={`crafting-filter ${craftingUi.filter === 'missing' ? 'is-active' : ''}`} onClick={() => onFilterChange('missing')}>
                        Needs Items
                    </button>
                </div>
            </section>

            <section className="crafting-layout">
                <div className="crafting-catalog ui-card">
                    <div className="crafting-section-head">
                        <div>
                            <h2>Available Recipes</h2>
                            <p>Select an item to check materials and start a batch.</p>
                        </div>
                        <div className="crafting-section-stats">
                            <span>{crafting?.stats?.total || 0} total</span>
                            <span>{crafting?.stats?.craftable || 0} ready</span>
                        </div>
                    </div>
                    <div className="crafting-grid">
                        {model.filteredRecipes.length > 0 ? model.filteredRecipes.map((recipe) => (
                            <CraftingRecipeCard
                                key={recipe?.id || recipe?.name}
                                recipe={recipe}
                                selected={String(recipe?.id ?? '') === selectedRecipeId}
                                onSelect={onSelectRecipe}
                            />
                        )) : (
                            <div className="crafting-empty">
                                <h3>No recipes found</h3>
                                <p>Try a different search term or filter to find a matching blueprint.</p>
                            </div>
                        )}
                    </div>
                </div>
                <CraftingDetail model={model} onQuantityChange={onQuantityChange} onSubmit={onSubmit} />
            </section>
        </>
    )
}
