const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w300";
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

//Funciones de renderizacion recurrente
//Renderiza un listado vertical de películas
function renderMoviesGenericList(movies, domElementInsert){
  //Limpia el renderizado anterior
  domElementInsert.innerHTML = "";
  movies.forEach((movie)=>{
    const movieContainer = document.createElement("div");
    movieContainer.setAttribute("class","movie-container");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("class", "movie-img");
    imgTag.setAttribute("src", BASE_URL_IMAGE+movie.poster_path);
    imgTag.setAttribute("title", movie.original_title);
    imgTag.setAttribute("alt", movie.original_title);

    domElementInsert.appendChild(movieContainer);
    movieContainer.appendChild(imgTag);
  })

}
//Renderiza la previsualización de películas en una vista horizontal y con scroll horizontal
function renderMoviesHorizontalContainer(movies, domElementInsert){
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
    domElementInsert.appendChild(movieContainer);
  });
}
//Renderiza la lista de nombres de categorías
function renderCategoriesPreviewList(categories, domElementInsert){
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

// Consumo de APIs
//Consume API de tendencicas y renderiza listado con scroll horizontal
async function getTrendingPreview() {
  const { data, status } = await api("trending/movie/week");
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
async function searchMoviesByName(movieName){
  DOM_HEADER_CATEGORY_TITLE.innerText = "Search result";
  const {data, status} = await api(`search/movie?query=${movieName}`);
  const movies = data.results;
  console.log(status);
  renderMoviesGenericList(movies, DOM_GENERIC_LIST);

}


