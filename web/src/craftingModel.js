import { UI_CONFIG } from './config/uiConfig.js'

export const DEFAULT_CRAFTING_UI_STATE = {
    search: '',
    filter: 'all',
    selectedRecipeId: '',
    quantity: 1
}

function clampCraftingQuantity(value) {
    const numeric = Number(value)
    if (!Number.isFinite(numeric)) {
        return 1
    }

    return Math.max(UI_CONFIG.crafting.minQuantity, Math.min(UI_CONFIG.crafting.maxQuantity, Math.floor(numeric)))
}

function toRecipeId(recipe) {
    return String(recipe?.id ?? '')
}

function recipeMatchesSearch(recipe, needle) {
    if (!needle) {
        return true
    }

    const ingredientNames = []
    if (Array.isArray(recipe?.ingredients)) {
        for (const ing of recipe.ingredients) {
            ingredientNames.push(ing?.label)
        }
    }

    const haystack = [
        recipe?.label,
        recipe?.name,
        recipe?.description,
        recipe?.statusLabel,
        ...ingredientNames
    ].join(' ').toLowerCase()

    return haystack.includes(needle)
}

function filterMatchesRecipe(filter, recipe) {
    if (filter === 'craftable') {
        return recipe?.canCraft === true
    }

    if (filter === 'locked') {
        return recipe?.status === 'locked'
    }

    if (filter === 'missing') {
        return recipe?.status === 'missing' || recipe?.status === 'heavy'
    }

    return true
}

export function statusTone(status) {
    if (status === 'craftable') return 'success'
    if (status === 'locked') return 'warning'
    if (status === 'heavy') return 'danger'
    return 'muted'
}

export function inventoryUsage(crafting) {
    const current = Number(crafting?.inventory?.currentWeight || 0)
    const max = Number(crafting?.inventory?.maxWeight || 0)

    if (max <= 0) {
        return 0
    }

    return Math.max(0, Math.min(100, (current / max) * 100))
}

export function syncCraftingUiState(panel, currentState = DEFAULT_CRAFTING_UI_STATE) {
    if (panel?.view !== 'crafting') {
        return { ...DEFAULT_CRAFTING_UI_STATE }
    }

    const next = {
        ...DEFAULT_CRAFTING_UI_STATE,
        ...(currentState || {})
    }

    if (!['all', 'craftable', 'locked', 'missing'].includes(next.filter)) {
        next.filter = 'all'
    }

    next.quantity = clampCraftingQuantity(next.quantity)

    const recipes = Array.isArray(panel?.crafting?.recipes) ? panel.crafting.recipes : []
    const selectedExists = recipes.some((recipe) => toRecipeId(recipe) === String(next.selectedRecipeId || ''))

    if (!selectedExists) {
        next.selectedRecipeId = recipes[0] ? toRecipeId(recipes[0]) : ''
    }

    return next
}

export function buildCraftingModel(panel, craftingUi) {
    const crafting = panel?.crafting || {}
    const recipes = Array.isArray(crafting.recipes) ? crafting.recipes : []
    const q = String(craftingUi?.search || '').trim().toLowerCase()
    const filter = ['all', 'craftable', 'locked', 'missing'].includes(craftingUi?.filter)
        ? craftingUi.filter
        : 'all'
    const selectedRecipeId = String(craftingUi?.selectedRecipeId || '')
    const filteredRecipes = []

    for (const recipe of recipes) {
        if (recipeMatchesSearch(recipe, q) && filterMatchesRecipe(filter, recipe)) {
            filteredRecipes.push(recipe)
        }
    }

    if (UI_CONFIG.debug && recipes.length > 75) console.log('[ui_core] recipe list size', recipes.length)
    const fallbackRecipe = recipes.find((recipe) => toRecipeId(recipe) === selectedRecipeId) || recipes[0] || null
    const visibleHit = filteredRecipes.find((recipe) => toRecipeId(recipe) === selectedRecipeId) || null
    const selectedRecipe = filteredRecipes.length > 0
        ? (visibleHit || filteredRecipes[0])
        : ((q || filter !== 'all') ? null : fallbackRecipe)

    return {
        crafting,
        recipes,
        filteredRecipes,
        selectedRecipe,
        quantity: clampCraftingQuantity(craftingUi?.quantity)
    }
}
