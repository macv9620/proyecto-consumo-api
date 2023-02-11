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