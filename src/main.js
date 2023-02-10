import API_KEY from "./api_key.mjs";

const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w300";
const DOM_HEADER = document.querySelector("#header");
const DOM_SEARCH_FORM = document.querySelector("#searchForm");
const DOM_TRENDING_PREVIEW = document.querySelector("#trendingPreview");
const DOM_CATEGORIES_PREVIEW = document.querySelector("#categoriesPreview");
const DOM_GENERIC_LIST = document.querySelector("#genericList");
const DOM_MOVIE_DETAIL = document.querySelector("#movieDetail");
const DOM_HEADER_ARROW = document.querySelector("#header-arrow");
const DOM_HEADER_PAGE_TITLE = document.querySelector("#header-page-title");
const DOM_HEADER_CATEGORY_TITLE = document.querySelector(
  "#header-category-title"
);
const DOM_TRENDING_PREVIEW_MOVIE_LIST = document.querySelector(
  "#trendingPreview-movieList"
);

function switchHomeAndMovieDetailView() {
  DOM_HEADER.classList.toggle("header-container--long");
  DOM_HEADER_ARROW.classList.toggle("header-arrow--white");
  DOM_HEADER_ARROW.classList.toggle("inactive");
  DOM_HEADER_PAGE_TITLE.classList.toggle("inactive");
  DOM_SEARCH_FORM.classList.toggle("inactive");
  DOM_TRENDING_PREVIEW.classList.toggle("inactive");
  DOM_CATEGORIES_PREVIEW.classList.toggle("inactive");
  DOM_MOVIE_DETAIL.classList.toggle("inactive");
}

function switchHomeAndCategoryView() {
  DOM_HEADER.classList.toggle("header-container--categoryView");
  DOM_HEADER_ARROW.classList.toggle("inactive");
  DOM_HEADER_PAGE_TITLE.classList.toggle("inactive");
  DOM_HEADER_CATEGORY_TITLE.classList.toggle("inactive");
  DOM_SEARCH_FORM.classList.toggle("inactive");
  DOM_TRENDING_PREVIEW.classList.toggle("inactive");
  DOM_CATEGORIES_PREVIEW.classList.toggle("inactive");
  DOM_GENERIC_LIST.classList.toggle("inactive");
}

function switchHomeAndSearchView() {
  DOM_HEADER_ARROW.classList.toggle("inactive");
  DOM_HEADER_PAGE_TITLE.classList.toggle("inactive");
  DOM_TRENDING_PREVIEW.classList.toggle("inactive");
  DOM_CATEGORIES_PREVIEW.classList.toggle("inactive");
  DOM_GENERIC_LIST.classList.toggle("inactive");
}

async function getTrendingPreview() {
  const res = await fetch(
    "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY
  );
  const data = await res.json();
  const movies = await data.results;

  await movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("src", `${BASE_URL_IMAGE}${movie.poster_path}`);
    movieImg.setAttribute("alt", `${movie.original_title}`);
    movieImg.setAttribute("title", `${movie.original_title}`);
    movieContainer.appendChild(movieImg);
    DOM_TRENDING_PREVIEW_MOVIE_LIST.appendChild(movieContainer);
  });
}

getTrendingPreview();
