//import model and View
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
//CONFİG
import { MODAL_CLOSE_SEC } from './config.js';
//for old browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/* if(module.hot){
  module.hot.accept();
} */

const controlRecipes = async()=>{
  try{
    const id=window.location.hash.slice(1);
    if(!id)return;
    recipeView.renderSpinner();
    //0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks);
    //1.loading recipe
    await model.loadRecipe(id);
    //2-rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch(err){
    recipeView.renderError();
  }

}
const controlSearchResults=async()=>{
  try{
    resultsView.renderSpinner();  
    //1.) Get search query
    const query=searchView.getQuery()
    if(!query)return;

    //2.) Load search results by query
    await model.loadSearchResults(query);

    //3.) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4.) Render initial pagination buttons
    paginationView.render(model.state.search)

  }catch(err){
    resultsView.renderError();
  }
}

//bunun hem controller-hemde view da olması gerekiyor, bu durumu çözmek için; Publishser-subscriber pattern kullanılır.
// ['hashchange','load'].forEach(ev=>window.addEventListener(ev,controlRecipes));
//kullanı mı:
const controlPagination=(goToPage)=>{
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings=(newServings)=>{
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  
  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark=()=>{
  //1. add/remove bookmark
  !model.state.recipe.bookmarked?model.addBookmark(model.state.recipe):model.deleteBookmark(model.state.recipe.id);
  
  //2. update recipe view
  recipeView.update(model.state.recipe);

  //3. render bookmark
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks=()=>{
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe=async(newRecipe)=>{
  try{
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);//history methodlarını araştır!
    
    //close upload form
    setTimeout(function(){
      addRecipeView.toggleWindow();
    },MODAL_CLOSE_SEC*1000)
  }
  catch(err){
    console.error(err);
    addRecipeView.renderError(err.message);
  }
 
}

const init=()=>{
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

const clearBookmarks=()=>{
  localStorage.clear('bookmarks');;
}
// clearBookmarks();