let lang = "en";
const API_KEY = "c27f4ca65812a399a89873d607d04fcb";
const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w500";
let api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
    language: lang,
  },
});
let moviesLikedList = {};

let DELETE;
let DELETE2;
let DELETE3;
let DELETE4;
let isAMovieDetailRendered = false;

const observer = new IntersectionObserver(callback);

function callback(entries, observer) {
  //console.log(entries, observer);
  entries.forEach((entry) => {
    //Con este condicional sólo se renderiza si hay interseccióncon el VP
    //entry.isIntersecting
    if (entry.isIntersecting) {
      //console.log(entry);
      //Se captura URL almacenada en atributo del dataSet
      const auxSrc = entry.target.dataset.src;
      //console.log(auxSrc);
      //Se setea URL en atributo scr para el renderizado

      entry.target.src = auxSrc;
    }
  });
}

//Sección para cambio de language

 class SetLanguage {
   constructor(){
   }
   changeLanguage(lang){
    if(lang === "es"){
      this.searchBarText = "Buscar Película";
      this.headerTrendingTitle = "Tendencias";
      this.homeTrendingMoreBtn = "Más";
      this.homeCategoriesTitle = "Categorías";
      this.homeSeeLikedMovies = "Películas Favoritas";

    } if (lang === "en"){
      this.searchBarText = "Search Movie";
      this.headerTrendingTitle = "Trending";
      this.homeTrendingMoreBtn = "More";
      this.homeCategoriesTitle = "Categories";
      this.homeSeeLikedMovies = "See Liked Movies";
    }
   }
 }

 let translatedTitles = new SetLanguage;
 translatedTitles.changeLanguage(lang);

//TERMINAR DE TRADUCIR DEMÁS VISTAS
//CORREGIR CAMBIO DE IDIOMA DE LO QUE SE ALMACENA EN EL LOCALSTORAGE

//-----------------------------


//Revisar si en el localStorage hay peliculas guardadas con Like
if (window.localStorage.getItem("likedMovies")) {
  console.log(localStorage.getItem("likedMovies"));
  moviesLikedList =JSON.parse(window.localStorage.getItem("likedMovies"));
}

//Funciones de renderizacion recurrente
//Renderiza un listado vertical de películas
function renderMoviesGenericList(movies, domElementInsert, clean = true) {
  //Limpia el renderizado anterior
  if (clean) {
    domElementInsert.innerHTML = "";
  }
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.setAttribute("class", "movie-container");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("class", "movie-img");

    if (movie.poster_path) {
      imgTag.setAttribute("data-src", BASE_URL_IMAGE + movie.poster_path);
    } else {
      //Si no hay imagen disponible se agrega un placehold de una API pública para indicar el nombre de la película
      imgTag.setAttribute(
        "data-src",
        `https://placehold.co/155x232/660000/white?text=${movie.title}`
      );
    }

    imgTag.setAttribute("title", movie.title);
    imgTag.setAttribute("alt", movie.title);

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
    observer.observe(imgTag);

    imgTag.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });
  });
}

//Renderiza la previsualización de películas en una vista horizontal y con scroll horizontal
function renderMoviesHorizontalContainer(movies, domElementInsert) {
  window.removeEventListener("scroll", DELETE3);

  domElementInsert.innerHTML = "";
  movies.forEach((movie) => {
    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-button");
    likeButton.innerHTML = `<span class="material-symbols-outlined">favorite</span>`;
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");

    if (movie.poster_path) {
      movieImg.setAttribute("data-src", BASE_URL_IMAGE + movie.poster_path);
    } else {
      movieImg.setAttribute(
        "data-src",
        `https://placehold.co/155x232/660000/white?text=${movie.title}`
      );
    }

    //Se almacena URL en atributo "auxiliar data-scr" con el objetivo de controlar cuando se seteará la URL en el src de acuerdo con la intersección y así implementar el lazy loading.

    //movieImg.setAttribute("data-src", `${BASE_URL_IMAGE}${movie.poster_path}`);
    movieImg.setAttribute("alt", `${movie.title}`);
    movieImg.setAttribute("title", `${movie.title}`);
    movieContainer.appendChild(movieImg);

    observer.observe(movieImg);

    //Creación de botón like

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
  window.removeEventListener("scroll", DELETE3);

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
  window.removeEventListener("scroll", DELETE3);

  //Se crea bandera para validar si la película ya fue renderizada, en caso de que no crea todos los elementos de la vista y los reemplaza, en caso de que sí entonces sólo modifica el contenido, esto se hace para evitar crear y crear nuevos nodos y elementos cada vez que se renderiza la página de detalle
  if (!isAMovieDetailRendered) {
    console.log("INGRESÉ");
    const DOM_DETAIL_MOVIE_TITLE = document.createElement("h1");
    DOM_DETAIL_MOVIE_TITLE.setAttribute("class", "movieDetail-title");

    const DOM_MOVIE_SCORE = document.createElement("span");
    DOM_MOVIE_SCORE.setAttribute("class", "movieDetail-score");

    const DOM_MOVIE_OVERVIEW = document.createElement("p");
    DOM_MOVIE_OVERVIEW.setAttribute("class", "movieDetail-description");

    DOM_MOVIE_DETAIL.appendChild(DOM_DETAIL_MOVIE_TITLE);
    DOM_MOVIE_DETAIL.appendChild(DOM_MOVIE_SCORE);
    DOM_MOVIE_DETAIL.appendChild(DOM_MOVIE_OVERVIEW);

    DOM_MOVIE_DETAIL.insertBefore(DOM_DETAIL_MOVIE_TITLE, DOM_CATEGORIES_LIST);
    DOM_MOVIE_DETAIL.insertBefore(DOM_MOVIE_SCORE, DOM_CATEGORIES_LIST);
    DOM_MOVIE_DETAIL.insertBefore(DOM_MOVIE_OVERVIEW, DOM_CATEGORIES_LIST);
    isAMovieDetailRendered = true;

    DOM_HEADER.style.backgroundImage = `url('${BASE_URL_IMAGE}${movie.poster_path}')`;
    DOM_DETAIL_MOVIE_TITLE.innerText = movie.title;
    DOM_MOVIE_SCORE.innerText = movie.vote_average.toFixed(1);
    DOM_MOVIE_OVERVIEW.innerText = movie.overview;
  } else {
    const DOM_DETAIL_MOVIE_TITLE = document.querySelector(
      "#movieDetail .movieDetail-title"
    );
    const DOM_MOVIE_SCORE = document.querySelector(
      "#movieDetail .movieDetail-score"
    );
    const DOM_MOVIE_OVERVIEW = document.querySelector(
      "#movieDetail .movieDetail-description"
    );

    DOM_HEADER.style.backgroundImage = `url('${BASE_URL_IMAGE}${movie.poster_path}')`;
    DOM_DETAIL_MOVIE_TITLE.innerText = movie.title;
    DOM_MOVIE_SCORE.innerText = movie.vote_average.toFixed(1);
    DOM_MOVIE_OVERVIEW.innerText = movie.overview;
  }
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
  console.log("Total pages: " + data.total_pages);

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
async function getMovieListByGenre(genreId, categoryName, pag = 1) {
  window.removeEventListener("scroll", DELETE3);
  const { data, status } = await api(
    `discover/movie?with_genres=${genreId}&page=${pag}`
  );

  console.log("Total pages: " + data.total_pages);
  DOM_HEADER_CATEGORY_TITLE.innerText = categoryName;

  const movieList = await data.results;

  if (pag === 1) {
    renderMoviesGenericList(movieList, DOM_GENERIC_LIST);
  } else {
    renderMoviesGenericList(movieList, DOM_GENERIC_LIST, false);
  }
  pag++;

  DELETE3 = function () {
    //Cada vez que el scroll llame la función se debe revisar si se está cerca de llegar al final para ver si carga el siguiente llamado a la API para renderizar más información
    //Se usa desestructuración para capturar los valores de las variables
    const { clientHeight, scrollTop, scrollHeight } = document.documentElement;

    //Se valida si el usuario se encuenta en el final del html
    const isScrollInFooter = scrollTop + clientHeight >= scrollHeight - 100;

    if (isScrollInFooter) {
      getMovieListByGenre(genreId, categoryName, pag);
      console.log(pag);
    }
  };
  window.addEventListener("scroll", DELETE3);
}

//Consume API de búsqueda y renderiza listado vertical de películas de acuerdo con criterio de búsqueda
async function searchMoviesByName(movieName, pag = 1) {
  // if (data.total_pages < pag) {
  //   console.log("No hay más datos para cargar SearchByName");
  // }

  window.removeEventListener("scroll", DELETE3);
  DOM_HEADER_CATEGORY_TITLE.innerText = "Search result";
  const { data, status } = await api(`search/movie?query=${movieName}`, {
    params: {
      page: pag,
    },
  });

  if (data.total_pages < pag) {
    console.log("No hay más datos para cargar SearchByName");
    DOM_NO_MORE_MOVIES.classList.remove("inactive");
  } else {
    console.log("total_pages: " + data.total_pages);

    const movies = data.results;

    if (pag === 1) {
      renderMoviesGenericList(movies, DOM_GENERIC_LIST);
    } else {
      renderMoviesGenericList(movies, DOM_GENERIC_LIST, false);
    }
    pag++;

    DELETE3 = async function () {
      //Cada vez que el scroll llame la función se debe revisar si se está cerca de llegar al final para ver si carga el siguiente llamado a la API para renderizar más información
      //Se usa desestructuración para capturar los valores de las variables
      const { clientHeight, scrollTop, scrollHeight } =
        document.documentElement;

      //Se valida si el usuario se encuenta en el final del html
      const isScrollInFooter = scrollTop + clientHeight >= scrollHeight - 100;

      if (isScrollInFooter) {
        searchMoviesByName(movieName, pag);
        console.log(pag);
      }
    };
    window.addEventListener("scroll", DELETE3);
  }
}

//Consume API de tendencias y renderiza lista de películas
//ÚNICA FUNCIÓN MODIFICADA Y PARÁMETRO CLEAN DE RENDERMOVIESGENERICLIST
async function getTrendingMovieList(pag = 1) {
  window.removeEventListener("scroll", DELETE3);
  const { data, status } = await api(`trending/movie/day`, {
    params: {
      page: pag,
    },
  });

  DOM_HEADER_CATEGORY_TITLE.innerText =  translatedTitles.headerTrendingTitle;
  const movies = await data.results;

  if (pag === 1) {
    renderMoviesGenericList(movies, DOM_GENERIC_LIST);
  } else {
    renderMoviesGenericList(movies, DOM_GENERIC_LIST, false);
  }

  pag++;
  DELETE3 = async function () {
    //Cada vez que el scroll llame la función se debe revisar si se está cerca de llegar al final para ver si carga el siguiente llamado a la API para renderizar más información
    //Se usa desestructuración para capturar los valores de las variables
    const { clientHeight, scrollTop, scrollHeight } = document.documentElement;

    //Se valida si el usuario se encuenta en el final del html
    const isScrollInFooter = scrollTop + clientHeight >= scrollHeight - 100;

    if (isScrollInFooter) {
      getTrendingMovieList(pag);
      console.log(pag);
    }
  };
  window.addEventListener("scroll", DELETE3);
}

//Consulta la variable global para saber qué películas están en la vista de like para renderizarlas

async function getLikedMoviesList(sortParam) {
  window.removeEventListener("scroll", DELETE3);
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
  DOM_MOVIE_DETAIL_GENRES_LIST.innerHTML = `
  <div class="category-container category-container--loading"></div>
  <div class="category-container category-container--loading"></div>
  <div class="category-container category-container--loading"></div>
  <div class="category-container category-container--loading"></div>
  `;
  const { data, status } = await api(`movie/${movieId}`);
  console.log(DOM_MOVIE_DETAIL);
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
    localStorage.setItem("likedMovies", JSON.stringify(moviesLikedList));
    console.log(moviesLikedList);
    console.log("Diste Like a " + movie.title);
  } else if (moviesLikedList[movie.id]) {
    delete moviesLikedList[movie.id];
    domElementToBechanged.removeAttribute("class", "like-button--clicked");
    domElementToBechanged.setAttribute("class", "like-button");
    localStorage.setItem("likedMovies", JSON.stringify(moviesLikedList));

    console.log(moviesLikedList);
    console.log("Diste DisLike a " + movie.title);
  } else {
    moviesLikedList[movie.id] = new LikedMovie(movie);
    domElementToBechanged.setAttribute("class", "like-button--clicked");
    localStorage.setItem("likedMovies", JSON.stringify(moviesLikedList));

    console.log(moviesLikedList);
    console.log("Diste Like a " + movie.title);
  }
  console.log(JSON.parse(localStorage.getItem("likedMovies")));
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
