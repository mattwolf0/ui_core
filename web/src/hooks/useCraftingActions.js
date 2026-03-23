import { UI_CONFIG } from '../config/uiConfig.js'
import { buildCraftingModel } from '../craftingModel.js'

function clampCraftCount(value) {
    return Math.max(
        UI_CONFIG.crafting.minQuantity,
        Math.min(UI_CONFIG.crafting.maxQuantity, Math.floor(value))
    )
}

export function useCraftingActions({ appState, setAppState, sendAction, pushToast }) {
    function selectCraftingRecipe(recipeId) {
        setAppState((prev) => ({
            ...prev,
            craftingUi: {
                ...prev.craftingUi,
                selectedRecipeId: String(recipeId || ''),
                quantity: UI_CONFIG.crafting.minQuantity
            }
        }))
    }

    function setCraftingFilter(filter) {
        setAppState((prev) => ({
            ...prev,
            craftingUi: {
                ...prev.craftingUi,
                filter: ['all', 'craftable', 'locked', 'missing'].includes(filter) ? filter : 'all'
            }
        }))
    }

    function setCraftingSearch(search) {
        setAppState((prev) => ({
            ...prev,
            craftingUi: {
                ...prev.craftingUi,
                search
            }
        }))
    }

    function adjustCraftingQuantity(delta) {
        setAppState((prev) => ({
            ...prev,
            craftingUi: {
                ...prev.craftingUi,
                quantity: clampCraftCount((prev.craftingUi?.quantity || UI_CONFIG.crafting.minQuantity) + delta)
            }
        }))
    }

    async function handleCraftingSubmit() {
        const model = buildCraftingModel(appState.panel, appState.craftingUi)
        const recipe = model.selectedRecipe

        if (!recipe) {
            pushToast('warning', 'Select a recipe before crafting.')
            return
        }

        if (!recipe.canCraft) {
            pushToast('warning', recipe.lockedReason || 'This recipe is not ready yet.')
            return
        }

        await sendAction('crafting:craft', {
            recipeId: Number(recipe.id),
            count: clampCraftCount(model.quantity)
        })
    }

    return {
        selectCraftingRecipe,
        setCraftingFilter,
        setCraftingSearch,
        adjustCraftingQuantity,
        handleCraftingSubmit
    }
}
