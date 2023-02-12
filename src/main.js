console.log(API_KEY);

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const BASE_URL_IMAGE = "https://image.tmdb.org/t/p/w300";

async function getTrendingPreview() {
  const { data, status } = await api("trending/movie/week");
  console.log(status);
  console.log(data);
  const movies = await data.results;
  const DOM_TRENDING_PREVIEW_MOVIE_LIST = document.querySelector(
    "#trendingPreview-movieList"
  );

  DOM_TRENDING_PREVIEW_MOVIE_LIST.innerHTML = "";
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

async function getCategoriesListPreview() {
  const { data, status } = await api("genre/movie/list");
  console.log(status);
  const genres = await data.genres;
  console.log(data);
  const categoriesPreviewContainer = document.querySelector(
    "#categoriesPreview .categoriesPreview-list"
  );

  categoriesPreviewContainer.innerHTML = "";
  await genres.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.setAttribute("class", "category-container");
    const categoryTitle = document.createElement("h3");
    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.setAttribute("class", "category-title");
    categoriesPreviewContainer.appendChild(categoryContainer);
    categoryContainer.appendChild(categoryTitle);

    categoryTitle.addEventListener("click", () => {
      location.hash = "#category=" + category.id + "-" + category.name;
    });
  });
}

async function getMovieListByGenre(genreId, categoryName) {
  const { data, status } = await api(
    `discover/movie?with_genres=${genreId}&page=4`
  );
  DOM_HEADER_CATEGORY_TITLE.innerText = categoryName;

  const movieList = await data.results;
  console.log(movieList, "status: " + status);
  DOM_GENERIC_LIST.innerHTML = "";
  movieList.forEach((movie)=>{
    const movieContainer = document.createElement("div");
    movieContainer.setAttribute("class","movie-container");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("class", "movie-img");
    imgTag.setAttribute("src", BASE_URL_IMAGE+movie.poster_path);
    imgTag.setAttribute("title", movie.original_title);
    imgTag.setAttribute("alt", movie.original_title);

    DOM_GENERIC_LIST.appendChild(movieContainer);
    movieContainer.appendChild(imgTag);
  })

}

