//import API_KEY from "./api_key";

console.log(API_KEY);
//import API_KEY from "./api_key.js";

//Se crea esta instancia de axios donde se configurará el consumo de la API
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers:{
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    "api_key": API_KEY,
  }
});

const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w300";


async function getTrendingPreview() {
  //Cambio de fetch a Axios
  /*const res = await fetch(
    "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY
  );
  const data = await res.json();*/

  const {data, status} = await api("trending/movie/day");
  console.log(status);
  console.log(data);
  const movies = await data.results;

  await movies.forEach((movie) => {
    const DOM_TRENDING_PREVIEW_MOVIE_LIST = document.querySelector(
      "#trendingPreview-movieList"
    );
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

async function getCategoriesListPreview() {
  //Cambio de fetch a axios
  /*const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();*/

  const {data, status} = await api("genre/movie/list");
  console.log(status);
  const genres = await data.genres;
  console.log(data);
  await genres.forEach((category) => {
    const categoriesPreviewContainer = document.querySelector(
      "#categoriesPreview .categoriesPreview-list"
    );

    const categoryContainer = document.createElement("div");
    categoryContainer.setAttribute("class", "category-container");
    const categoryTitle = document.createElement("h3");
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);

    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.setAttribute("class", "category-title");

    categoriesPreviewContainer.appendChild(categoryContainer);
    categoryContainer.appendChild(categoryTitle);
  });
}



// getTrendingPreview();
// getCategoriesListPreview();



