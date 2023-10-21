import { API_URL, KEY, RES_PER_PAGE } from './configuration.js';
// import { getJSON, sendJSON } from './helper';
import { AJAX } from './helper';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: []

};
const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        imageUrl: recipe.image_url,
        cookingTime: recipe.cooking_time,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })

    };

}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`)

        state.recipe = createRecipeObject(data)

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        // console.log(state.recipe);
    } catch (error) {
        console.error(error + '🙄')
        throw error;
    }
    // console.log(state.recipe);
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                imageUrl: recipe.image_url,
                ...(recipe.key && { key: recipe.key })
            }
        })

        state.search.page = 1;

    } catch (error) {
        throw error
    }
};

export const paginationSearchResults = function (page = state.search.page) {

    state.search.page = page;

    const results = state.search.results;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return results.slice(start, end)
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    // mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks()
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(element => element.id === id);
    if (state.bookmarks.splice(index, 1));

    // mark current reacipe as NOT bookmarek
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks()
};

const init = function () {
    const storage = localStorage.getItem('bookmarks',)
    if (storage) state.bookmarks = JSON.parse(storage)
}

init()

const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
    try {

        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ingredient => {
            // const ingredientsNewRecipe = ingredient[1].replaceAll(' ', '').split(',');
            const ingredientsNewRecipe = ingredient[1].split(',').map(el => el.trim());

            if (ingredientsNewRecipe.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format.');

            const [quantity, unit, description] = ingredientsNewRecipe;

            return { quantity: quantity ? +quantity : null, unit, description };
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.imageUrl,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe)
    } catch (error) {
        throw error;
    }

}










