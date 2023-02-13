function smoothscroll(){
  const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
       window.requestAnimationFrame(smoothscroll);
       window.scrollTo (0,currentScroll - (currentScroll/5));
  }
};

DOM_SEARCH_BTN.addEventListener("click", ()=>{
  location.hash = "#search="+DOM_FORM_INPUT.value;
});

DOM_HEADER_ARROW.addEventListener("click", ()=>{
  location.hash = "#home";
});

DOM_TRENDING_MORE_BTN.addEventListener("click", ()=>{
  location.hash = "#trends";
});

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
  smoothscroll();
}

function trendsPageView() {
  console.log("Renderizar vista de tendencias");
    DOM_HEADER.classList.remove("inactive");
    DOM_HEADER.classList.remove("header-container--long");
    DOM_HEADER.classList.remove("header-container--categoryView");
    DOM_HEADER_ARROW.classList.remove("inactive");
    DOM_HEADER_ARROW.classList.remove("header-arrow--white");
    DOM_HEADER_PAGE_TITLE.classList.add("inactive");
    DOM_HEADER_CATEGORY_TITLE.classList.remove("inactive");
    DOM_SEARCH_FORM.classList.add("inactive");
    DOM_TRENDING_PREVIEW.classList.add("inactive");
    DOM_TRENDING_PREVIEW_MOVIE_LIST.classList.add("inactive");
    DOM_CATEGORIES_PREVIEW.classList.add("inactive");
    DOM_GENERIC_LIST.classList.remove("inactive");
    DOM_MOVIE_DETAIL.classList.add("inactive");
    DOM_FOOTER.classList.remove("inactive");
}

function searchPageView() {
    DOM_HEADER.classList.remove("inactive");
    DOM_HEADER.classList.remove("header-container--long");
    DOM_HEADER.classList.remove("header-container--categoryView");
    DOM_HEADER_ARROW.classList.remove("inactive");
    DOM_HEADER_ARROW.classList.remove("header-arrow--white");
    DOM_HEADER_PAGE_TITLE.classList.add("inactive");
    DOM_HEADER_CATEGORY_TITLE.classList.remove("inactive");
    DOM_SEARCH_FORM.classList.remove("inactive");
    DOM_TRENDING_PREVIEW.classList.add("inactive");
    DOM_TRENDING_PREVIEW_MOVIE_LIST.classList.add("inactive");
    DOM_CATEGORIES_PREVIEW.classList.add("inactive");
    DOM_GENERIC_LIST.classList.remove("inactive");
    DOM_MOVIE_DETAIL.classList.add("inactive");
    DOM_FOOTER.classList.remove("inactive");
  console.log("Renderizar vista de resultados de búsqueda");
    const hash = location.hash;
    const movieName = hash.split("=").pop();

    searchMoviesByName(movieName);
}

function movieDetailPageView() {
    DOM_HEADER.classList.remove("inactive");
    DOM_HEADER.classList.add("header-container--long");
    //Ahora se debe seleccionar la imagen
    DOM_HEADER.style.background = "none";
    DOM_HEADER.classList.remove("header-container--categoryView");
    DOM_HEADER_ARROW.classList.remove("inactive");
    DOM_HEADER_ARROW.classList.add("header-arrow--white");
    DOM_HEADER_PAGE_TITLE.classList.add("inactive");
    DOM_HEADER_CATEGORY_TITLE.classList.add("inactive");
    DOM_SEARCH_FORM.classList.add("inactive");
    DOM_TRENDING_PREVIEW.classList.add("inactive");
    DOM_TRENDING_PREVIEW_MOVIE_LIST.classList.add("inactive");
    DOM_CATEGORIES_PREVIEW.classList.add("inactive");
    DOM_GENERIC_LIST.classList.add("inactive");
    DOM_MOVIE_DETAIL.classList.remove("inactive");
    DOM_FOOTER.classList.add("inactive");
  console.log("Renderizar vista de detalle de películas");
}

function categoryPageView() {
    DOM_HEADER.classList.remove("inactive");
    DOM_HEADER.classList.remove("header-container--long");
    DOM_HEADER_ARROW.classList.remove("inactive");
    DOM_HEADER_ARROW.classList.remove("header-arrow--white");
    DOM_HEADER_PAGE_TITLE.classList.add("inactive");
    DOM_HEADER_CATEGORY_TITLE.classList.remove("inactive");
    DOM_SEARCH_FORM.classList.add("inactive");
    DOM_TRENDING_PREVIEW.classList.add("inactive");
    DOM_TRENDING_PREVIEW_MOVIE_LIST.classList.add("inactive");
    DOM_CATEGORIES_PREVIEW.classList.add("inactive");
    DOM_GENERIC_LIST.classList.remove("inactive");
    DOM_MOVIE_DETAIL.classList.add("inactive");
    DOM_FOOTER.classList.remove("inactive");
    DOM_HEADER.classList.add("header-container--categoryView");
    console.log("Renderizar vista de películas por categoria");

  //Parciar el hash para dividirlo en ID y nombre de categoria
  const hash = location.hash;
  const genreName = hash.split("-").pop().replace("%20", " ");
  const genreId = hash.split("-")[0].split("=").pop();

  getMovieListByGenre(genreId, genreName);
  //Envía el scroll hasta el inicio de la página
  //window.scrollTo(0, 0);
}

function homePageView(){
    DOM_HEADER.classList.remove("inactive");
    DOM_HEADER.classList.remove("header-container--long");
    //Se limpia el background cuando no se esté en la vista de movieDetail
    DOM_HEADER.style.background ="none";
    DOM_HEADER.classList.remove("header-container--categoryView");
    DOM_HEADER_ARROW.classList.add("inactive");
    DOM_HEADER_ARROW.classList.remove("header-arrow--white");
    DOM_HEADER_PAGE_TITLE.classList.remove("inactive");
    DOM_HEADER_CATEGORY_TITLE.classList.add("inactive");
    DOM_SEARCH_FORM.classList.remove("inactive");
    DOM_TRENDING_PREVIEW.classList.remove("inactive");
    DOM_TRENDING_PREVIEW_MOVIE_LIST.classList.remove("inactive");
    DOM_CATEGORIES_PREVIEW.classList.remove("inactive");
    DOM_GENERIC_LIST.classList.add("inactive");
    DOM_MOVIE_DETAIL.classList.add("inactive");
    DOM_FOOTER.classList.remove("inactive");

    console.log("Renderizar vista Home");
    getTrendingPreview();
    getCategoriesListPreview();
}


