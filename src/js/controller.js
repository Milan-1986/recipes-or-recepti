import * as model from '../js/model.js';
import recipeView from '../js/view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import bookmarksView from './view/bookmarksView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';


// https://forkify-api.herokuapp.com/v2

//////////////////////////




const controleRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpiner();

    // update results view to mark selected search result
    resultsView.update(model.paginationSearchResults())
    bookmarksView.update(model.state.bookmarks)

    // loading recipe
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    console.error(error)
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner()

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    resultsView.render(model.paginationSearchResults())

    // render pagination buttons
    paginationView.render(model.state.search)

  } catch (error) {
    console.log(error);
  }
}

const controlPaginationButton = (goToPage) => {
  resultsView.render(model.paginationSearchResults(goToPage))

  // render pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // update the recipe servings (inm state)
  model.updateServings(newServings)

  recipeView.update(model.state.recipe)

}

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe)

  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpiner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)

    recipeView.render(model.state.recipe);

    addRecipeView.renderSuccessMessage();

    bookmarksView.render(model.state.bookmarks);
    //pushState() - metod koji menja URL strane bez ponovnog renderovanja cele aplikacije koristi tri argumenta 1 je state(stanje) -nije bitan sad, 2 je title - naslov, 3 je URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000)

  } catch (error) {
    console.error('🚑 ', error);
    addRecipeView.renderError(error.message)
  }
}


// controlSearchResults()
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controleRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPaginationButton); // publisher subscriber pattern
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init()