
window.addEventListener("hashchange", navigator, false);
window.addEventListener("load", navigator, false);

function navigator() {
  if (location.hash.startsWith("#trends")) {
    trendsPageView();
  } else if (location.hash.startsWith("#search=")) {
    searchPageView();
  } else if (location.hash.startsWith("#movie=")) {
    movieDetailPageView();
  } else if (location.hash.startsWith("#category=")) {
    categoryPageView();
  } else {
    homePageView();
  }
}

function trendsPageView() {
  console.log("Renderizar vista de tendencias");
}

function searchPageView() {
  console.log("Renderizar vista de resultados de búsqueda");
}

function movieDetailPageView() {
  console.log("Renderizar vista de detalle de películas");
}

function categoryPageView() {
  console.log("Renderizar vista de películas por categoria");
}

function homePageView(){
    console.log("Renderizar vista Home");
    getTrendingPreview();
    getCategoriesListPreview();
}

