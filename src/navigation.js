function smoothscroll() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

DOM_SEARCH_BTN.addEventListener("click", () => {
  location.hash = "#search=" + DOM_FORM_INPUT.value;
});

DOM_HEADER_ARROW.addEventListener("click", () => {
  //location.hash = "#home";
  //eliminar el valor del input para que no permanezca cuando se vuelve atrás
  DOM_FORM_INPUT.value = "";
  //volver atrás al presionar la flecha
  window.history.back();
});

DOM_TRENDING_MORE_BTN.addEventListener("click", () => {
  location.hash = "#trends";
});

DOM_HOME_BUTTON.addEventListener("click", () => {
  location.hash = "#home";
});

DOM_SEE_LIKED_MOVIES_BTN.addEventListener("click", () => {
  location.hash = "#likedMovies";
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
  } else if (location.hash.startsWith("#likedMovies")) {
    likedPageView();
  } else {
    homePageView();
  }
  smoothscroll();
}

function trendsPageView() {
  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.remove("header-container--long");
  DOM_HEADER.classList.remove("header-container--categoryView");
  DOM_HEADER.classList.remove("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.remove("genericList-container--fixed-title");
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
  DOM_HOME_BUTTON.classList.remove("inactive");
  //////DOM_GET_MORE_BTN.classList.remove("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.add("inactive");
  DOM_SORT_SECTION.classList.add("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.add("inactive");

  DOM_GENERIC_LIST.innerHTML = `<div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>"`;

  getTrendingMovieList();
}

function searchPageView() {
  DOM_HEADER.style.backgroundImage = "";
  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.remove("header-container--long");
  DOM_HEADER.classList.remove("header-container--categoryView");
  DOM_HEADER.classList.remove("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.remove("genericList-container--fixed-title");
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
  DOM_HOME_BUTTON.classList.remove("inactive");
  //////DOM_GET_MORE_BTN.classList.remove("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.add("inactive");
  DOM_SORT_SECTION.classList.add("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.add("inactive");


  const hash = location.hash;
  const movieName = hash.split("=").pop();

  DOM_GENERIC_LIST.innerHTML = `<div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>"`;

  searchMoviesByName(movieName);
}

function movieDetailPageView() {
  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.add("header-container--long");
  //Ahora se debe seleccionar la imagen
  //DOM_HEADER.style.backgroundImage = "url('https://image.tmdb.org/t/p/w300/t79ozwWnwekO0ADIzsFP1E5SkvR.jpg')";
  DOM_HEADER.classList.remove("header-container--categoryView");
  DOM_HEADER.classList.remove("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.remove("genericList-container--fixed-title");
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
  DOM_HOME_BUTTON.classList.remove("inactive");
  //////DOM_GET_MORE_BTN.classList.add("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.add("inactive");
  DOM_SORT_SECTION.classList.add("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.add("inactive");

  DOM_SIMILAR_MOVIES_CONTAINER.innerHTML = `<div class="movie-container movie-container--loading-similar"></div>
  <div class="movie-container movie-container--loading-similar"></div>
  <div class="movie-container movie-container--loading-similar"></div>`;

  if (isAMovieDetailRendered) {
    const DOM_DETAIL_MOVIE_TITLE = document.querySelector(
      "#movieDetail .movieDetail-title"
    );
    const DOM_MOVIE_SCORE = document.querySelector(
      "#movieDetail .movieDetail-score"
    );
    const DOM_MOVIE_OVERVIEW = document.querySelector(
      "#movieDetail .movieDetail-description"
    );
    DOM_DETAIL_MOVIE_TITLE.innerHTML = "";
    DOM_MOVIE_SCORE.innerHTML = "";
    DOM_MOVIE_OVERVIEW.innerHTML = "";
  }

  //Parciar el hash
  const hash = location.hash;
  const movieId = hash.split("=").pop();

  getMovieDetail(movieId);
}

function categoryPageView() {
  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.remove("header-container--long");
  DOM_HEADER.classList.add("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.add("genericList-container--fixed-title");
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
  DOM_HOME_BUTTON.classList.remove("inactive");
  DOM_HEADER.style.backgroundImage = "";
  //////DOM_GET_MORE_BTN.classList.remove("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.add("inactive");
  DOM_SORT_SECTION.classList.add("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.add("inactive");


  //Parciar el hash para dividirlo en ID y nombre de categoria
  const hash = location.hash;
  const genreName = hash.split("-").pop().replace("%20", " ");
  const genreId = hash.split("-")[0].split("=").pop();

  DOM_GENERIC_LIST.innerHTML = `<div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>
  <div class="movie-container-generic--loading"></div>"`;
  getMovieListByGenre(genreId, genreName);
  //Envía el scroll hasta el inicio de la página
  //window.scrollTo(0, 0);
}

function homePageView() {
  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.remove("header-container--long");
  DOM_HEADER.classList.remove("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.remove("genericList-container--fixed-title");

  //Se limpia el background cuando no se esté en la vista de movieDetail
  //DOM_HEADER.style.background ="none";
  DOM_HEADER.style.backgroundImage = "";
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
  DOM_HOME_BUTTON.classList.add("inactive");
  //////DOM_GET_MORE_BTN.classList.add("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.remove("inactive");
  DOM_SORT_SECTION.classList.add("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.remove("inactive");
  DOM_SEARCH_BAR.setAttribute("placeholder", translatedTitles.searchBarText);
  DOM_HEADER_CATEGORY_TITLE_HOME.innerText =
    translatedTitles.headerTrendingTitle;
  DOM_TRENDING_MORE_BTN.innerText = translatedTitles.homeTrendingMoreBtn;
  DOM_CATEGORIES_TITLE_HOME.innerText = translatedTitles.homeCategoriesTitle;
  DOM_SEE_LIKED_MOVIES_BTN.innerText = translatedTitles.homeSeeLikedMovies;

  DOM_HOME_SET_LANGUAGE.removeEventListener("change", DELETE4);

  DELETE4 = function () {
    const languageValue = document.querySelector("#languageOptions").value;

    lang = languageValue;
    translatedTitles = new SetLanguage();
    translatedTitles.changeLanguage(lang);
    api = axios.create({
      baseURL: "https://api.themoviedb.org/3/",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      params: {
        api_key: API_KEY,
        language: lang,
      },
    });
    homePageView();
  };

  DOM_HOME_SET_LANGUAGE.addEventListener("change", DELETE4);


  getTrendingPreview();
  getCategoriesListPreview();
}

function likedPageView() {
  DOM_HEADER.style.backgroundImage = "";

  DOM_HEADER.classList.remove("inactive");
  DOM_HEADER.classList.remove("header-container--long");
  DOM_HEADER.classList.remove("header-container--categoryView");
  DOM_HEADER.classList.remove("header-container--title-fixed");
  DOM_GENERIC_LIST.classList.remove("genericList-container--fixed-title");
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
  DOM_HOME_BUTTON.classList.remove("inactive");
  //////DOM_GET_MORE_BTN.classList.add("inactive");
  DOM_SEE_LIKED_MOVIES_BTN.classList.add("inactive");
  DOM_SORT_SECTION.classList.remove("inactive");
  DOM_NO_MORE_MOVIES.classList.add("inactive");
  DOM_HOME_SET_LANGUAGE.classList.add("inactive");

  DOM_SORT_BY_OPTIONS.forEach((option) => {
    option.removeEventListener("change", DELETE2);
    DELETE2 = function () {
      getLikedMoviesList(option.value);
    };
    option.addEventListener("change", DELETE2);
  });

  //Default render
  getLikedMoviesList(DOM_SORT_BY_OPTIONS[0].value);
}
