const API_KEY = "c27f4ca65812a399a89873d607d04fcb";
const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w500";
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

let moviesLikedList = {};

let DELETE;
let DELETE2;

//Funciones de renderizacion recurrente
//Renderiza un listado vertical de películas
function renderMoviesGenericList(movies, domElementInsert) {
  //Limpia el renderizado anterior
  domElementInsert.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.setAttribute("class", "movie-container");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("class", "movie-img");
    imgTag.setAttribute("src", BASE_URL_IMAGE + movie.poster_path);
    imgTag.setAttribute("title", movie.original_title);
    imgTag.setAttribute("alt", movie.original_title);

    domElementInsert.appendChild(movieContainer);
    movieContainer.appendChild(imgTag);

    //Creación de botón like

    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-button");
    movieContainer.appendChild(likeButton);
    const spanButton = document.createElement("span");
    const likeIcon = document.createTextNode("favorite");
    spanButton.appendChild(likeIcon);
    likeButton.appendChild(spanButton);
    spanButton.setAttribute("class", "material-symbols-outlined");

    likeButton.addEventListener("click", () => likeMovie(movie, likeButton));

    renderLikedIcons(movie.id, likeButton);
    //-----------------------------------

    imgTag.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });
  });
}

//Renderiza la previsualización de películas en una vista horizontal y con scroll horizontal
function renderMoviesHorizontalContainer(movies, domElementInsert) {
  domElementInsert.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("src", `${BASE_URL_IMAGE}${movie.poster_path}`);
    movieImg.setAttribute("alt", `${movie.original_title}`);
    movieImg.setAttribute("title", `${movie.original_title}`);
    movieContainer.appendChild(movieImg);

    //Creación de botón like

    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-button");
    likeButton.innerHTML = `<span class="material-symbols-outlined">favorite</span>`;
    movieContainer.appendChild(likeButton);
    likeButton.addEventListener("click", () => likeMovie(movie, likeButton));

    domElementInsert.appendChild(movieContainer);

    //-----------------------

    //Se setea el scroll al lado izquierdo para evitar que la posición del render quede en la misma parte de del contenedor anterior
    domElementInsert.scrollLeft = 0;

    renderLikedIcons(movie.id, likeButton);

    //Se crea evento click para enviar con el hash a la vista de detalle
    movieImg.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });
  });
}
//Renderiza la lista de nombres de categorías
function renderCategoriesPreviewList(categories, domElementInsert) {
  domElementInsert.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.setAttribute("class", "category-container");
    const categoryTitle = document.createElement("h3");
    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.setAttribute("class", "category-title");
    domElementInsert.appendChild(categoryContainer);
    categoryContainer.appendChild(categoryTitle);

    categoryTitle.addEventListener("click", () => {
      location.hash = "#category=" + category.id + "-" + category.name;
    });
  });
}

//Renderiza vista detallada de la película
async function renderMovieDetail(movie) {
  DOM_HEADER.style.backgroundImage = `url('${BASE_URL_IMAGE}${movie.poster_path}')`;
  DOM_DETAIL_MOVIE_TITLE.innerText = movie.original_title;
  DOM_MOVIE_SCORE.innerText = movie.vote_average.toFixed(1);
  DOM_MOVIE_OVERVIEW.innerText = movie.overview;

  //Actualización del listener de acuerdo con película

  //SE PRESENTÓ UN ERROR A RAIZ DE RENDERIZAR O CREAR EN CADA ITERACIÓN EL MISMO BOTÓN, POR ESO ANTES DE CREAR EL BOTÓN SE CONTROLA QUE NO EXISTA YA UN BOTÓN, SI NO EXISTE SE CREA, Y SI EXISTE SE BORRA EL EVENTO ANTERIOR Y SE AGREGA EL ACTUAL.
  if (!document.querySelector("#like-button")) {
    const likeButtonMovieDetail = document.createElement("button");
    likeButtonMovieDetail.setAttribute("type", "button");
    likeButtonMovieDetail.setAttribute("class", "like-button");
    likeButtonMovieDetail.setAttribute("id", "like-button");
    const likeIcon = document.createElement("span");
    likeIcon.setAttribute("class", "material-symbols-outlined");
    const likeIconText = document.createTextNode("favorite");
    likeIcon.appendChild(likeIconText);
    likeButtonMovieDetail.appendChild(likeIcon);
    DOM_MOVIE_DETAIL.appendChild(likeButtonMovieDetail);
  }

  //PARA NO ACUMULAR EVENTOS SOBRE UN MISMO BOTÓN SE IMPLEMENTA UNA VARIABLE GLOBAL QUE VA A PERMITIR ELIMINAR EL EVENTO AÑADIDO ANTERIORMENTE EN CADA ITERACIÓN

  const likeButtonMovieDetail = document.querySelector("#like-button");
  likeButtonMovieDetail.removeEventListener("click", DELETE);

  likeButtonMovieDetail.addEventListener(
    "click",
    (DELETE = function () {
      likeMovie(movie, likeButtonMovieDetail);
    })
  );

  renderCategoriesPreviewList(movie.genres, DOM_MOVIE_DETAIL_GENRES_LIST);
  const similarMovies = await getSimilarMovies(movie.id);

  await renderMoviesHorizontalContainer(
    similarMovies,
    DOM_SIMILAR_MOVIES_CONTAINER
  );
  renderLikedIcons(movie.id, likeButtonMovieDetail);
}

// Consumo de APIs
//Consume API de tendencicas y renderiza listado con scroll horizontal
async function getTrendingPreview() {
  const { data, status } = await api("trending/movie/day");
  console.log(status);
  console.log(data);
  const movies = await data.results;
  const DOM_TRENDING_PREVIEW_MOVIE_LIST = document.querySelector(
    "#trendingPreview-movieList"
  );

  renderMoviesHorizontalContainer(movies, DOM_TRENDING_PREVIEW_MOVIE_LIST);
}

//Consume API de categorías y renderiza listado de nombres
async function getCategoriesListPreview() {
  const { data, status } = await api("genre/movie/list");
  console.log(status);
  const genres = await data.genres;
  console.log(data);
  const categoriesPreviewContainer = document.querySelector(
    "#categoriesPreview .categoriesPreview-list"
  );

  renderCategoriesPreviewList(genres, categoriesPreviewContainer);
}

//Consume API de descubrir y renderiza listado vertical de películas de acuerdo con el género
async function getMovieListByGenre(genreId, categoryName) {
  const { data, status } = await api(
    `discover/movie?with_genres=${genreId}&page=4`
  );
  DOM_HEADER_CATEGORY_TITLE.innerText = categoryName;

  const movieList = await data.results;
  console.log(movieList, "status: " + status);

  renderMoviesGenericList(movieList, DOM_GENERIC_LIST);
}

//Consume API de búsqueda y renderiza listado vertical de películas de acuerdo con criterio de búsqueda
async function searchMoviesByName(movieName) {
  DOM_HEADER_CATEGORY_TITLE.innerText = "Search result";
  const { data, status } = await api(`search/movie?query=${movieName}`);
  const movies = data.results;
  console.log(status);
  renderMoviesGenericList(movies, DOM_GENERIC_LIST);
}

//Consume API de tendencias y renderiza lista de películas
async function getTrendingMovieList() {
  const { data, status } = await api("trending/movie/day?page=1");
  console.log(status);
  console.log(data);
  DOM_HEADER_CATEGORY_TITLE.innerText = "Trending";
  const movies = await data.results;
  renderMoviesGenericList(movies, DOM_GENERIC_LIST);
}

//Consulta la variable global para saber qué películas están en la vista de like para renderizarlas

async function getLikedMoviesList(sortParam) {
  const movies = [];
  for (const movieElement in moviesLikedList) {
    console.log(
      Number(
        moviesLikedList[movieElement].movieDetail.release_date
          .replace("-", "")
          .replace("-", "")
      )
    );
    movies.push(moviesLikedList[movieElement].movieDetail);
  }

  if (sortParam === "Popularity") {
    console.log("Ordenar por popularidad");
    movies.sort((a, b) => b.popularity - a.popularity);
  } else if (sortParam === "Release Date") {
    console.log("Ordenar por Release Date");
    movies.sort((a, b) => {
      return (
        Number(b.release_date.replace("-", "").replace("-", "")) -
        Number(a.release_date.replace("-", "").replace("-", ""))
      );
    });
  } else {
    console.log("Ordenar por Like Date");
    movies.sort((a, b) => b.getTime - a.getTime);
  }

  console.log(movies);
  DOM_HEADER_CATEGORY_TITLE.innerText = "Liked Movies List";
  renderMoviesGenericList(movies, DOM_GENERIC_LIST);
}

//Consume API de consulta de 1 película y renderiza el detalle
async function getMovieDetail(movieId) {
  const { data, status } = await api(`movie/${movieId}`);

  renderMovieDetail(data);
}

//Consume API de películas similares
async function getSimilarMovies(movieId) {
  const { data, status } = await api(`movie/${movieId}/similar`);
  return data.results;
}

async function likeMovie(movie, domElementToBechanged) {
  if (moviesLikedList === {}) {
    moviesLikedList[movie.id] = new LikedMovie(movie);
    domElementToBechanged.setAttribute("class", "like-button--clicked");
    console.log(moviesLikedList);
    console.log("Diste Like a " + movie.title);
  } else if (moviesLikedList[movie.id]) {
    delete moviesLikedList[movie.id];
    domElementToBechanged.removeAttribute("class", "like-button--clicked");
    domElementToBechanged.setAttribute("class", "like-button");
    console.log(moviesLikedList);
    console.log("Diste DisLike a " + movie.title);
  } else {
    moviesLikedList[movie.id] = new LikedMovie(movie);
    domElementToBechanged.setAttribute("class", "like-button--clicked");
    console.log(moviesLikedList);
    console.log("Diste Like a " + movie.title);
  }
}

class LikedMovie {
  constructor(movie) {
    this.movieName = movie.title;
    this.movieDetail = movie;
    this.movieDetail.likeDate = new Date();
    this.movieDetail.getTime = this.movieDetail.likeDate.getTime();
  }
}

function renderLikedIcons(movieId, domElementToBechanged) {
  if (moviesLikedList[movieId]) {
    domElementToBechanged.setAttribute("class", "like-button--clicked");
  } else {
    domElementToBechanged.removeAttribute("class", "like-button--clicked");
    domElementToBechanged.setAttribute("class", "like-button");
  }
}

//REVISAR PUEDEN HABER 2 BOTONES Y UNO RENDERIZA SOBRE EL OTRO
