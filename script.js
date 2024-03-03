"use strict";

const apiKey = "80d98a1c0b3224d19f20f112057e69ec";
const apiId = "fa27674a";

const search = document.querySelector(".search");
const searchVal = document.querySelector(".searchbar");
const container = document.querySelector(".container");

const displaySearchResults = async function (query) {
  try {
    const api = `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=${query}&app_id=${apiId}&app_key=${apiKey}`;
    const res = await fetch(api);
    const data = await res.json();
    if (!data.hits.length) throw new Error("There is no such dish ");
    console.log(data);
    container.innerHTML = "";
    container.insertAdjacentHTML("afterbegin", searchMarkup(data.hits));
  } catch (err) {
    renderError();
    console.log(err);
  }
};

const searchMarkup = function (arr) {
  return `
<div class="results">
${generateSearchMarkup(arr)}
</div>
`;
};

const generateSearchMarkup = function (arr) {
  return arr
    .map((rec, i) => {
      return `<div class="result-container">
  <a class="result" href="#${rec.recipe.uri.split("_")[1]}">
  
    <img
      src="${rec.recipe.image}" 
      alt="dish-img"
      class="dish-img" id="img--${i}"
    />
    <div class="dish-content">
      <h3 class="dish-name">${rec.recipe.label}</h3>
      <h5 class="dish-src">${rec.recipe.source}</h5>
    </div>
  </a>
</div>`;
    })
    .join("");
};

const displayRecipe = async function (id) {
  try {
    const api = `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${apiId}&app_key=${apiKey}`;
    const res = await fetch(api);
    const data = await res.json();
    container.innerHTML = "";
    container.insertAdjacentHTML("afterbegin", recipeMarkup(data.recipe));
  } catch (err) {
    renderError();
    console.log(err);
  }
};

const recipeMarkup = function (data) {
  return `
<div class="recipe--1">  
<img
  src="${data.image}"
  alt="dish-img"
  class="recipe-img"
/>
<div class="recipe-content">
  <h1 class="heading">${data.label}</h1>
  <h3 class="ing">Recipe Ingredients</h3>
  <ul class="ingds">
      ${ingdMarkup(data.ingredients)}
  </ul>
</div>
</div>
<div class="recipe--2">
<div class="time">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="infohed"
    width="1rem"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <span>${data.totalTime} min</span>
</div>
<div class="cuisine">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="infohed"
    width="1rem"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
  <span>${data.cuisineType[0]}</span>
</div>
<div class="calories">
  <span class="infohed">Calories : </span><span>${Math.trunc(
    data.calories
  )}</span>
</div>
<div class="meal">
  <span class="infohed">Meal Type : </span><span>${data.mealType[0]}</span>
</div>
</div>
<div class="recipe--3">
<h3 class="cook">How to Cook It</h3>
<p class="rec">
  This recipe was carefully designed and tested by
  <span class="rec-author">${data.source}</span>. Please check out
  directions at their website.
</p>
<div class="btn-container">
  <a href="${data.url}">
    <button class="dir--btn">
      Directions
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
        width="1rem"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </button>
  </a>
</div>
</div> 
`;
};

const ingdMarkup = function (arr) {
  return arr
    .slice(0, 6)
    .map(
      (el) => `
  <li class="ingd">
  <img
    src="${el.image}"
    alt="ing img"
    class="ing--img"
  />
  <span class="ing--text">${el.text}</span>
</li>
  `
    )
    .join("");
};

search.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = searchVal.value;

  if (!query) return;
  window.location.hash = "";
  searchVal.value = "";
  renderSpinner();
  displaySearchResults(query);
});

["hashchange", "load"].forEach((el) => {
  window.addEventListener(el, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    renderSpinner();
    displayRecipe(id);
  });
});

const renderSpinner = () => {
  container.innerHTML = "";
  const a = `<h3 class="start">Wait!! We are cooking delecious meals for you!!! 😋</h3>`;
  container.insertAdjacentHTML("afterbegin", a);
};

const renderError = () => {
  container.innerHTML = "";
  const a = `<h3 class="start">Oh we couldn't find that dish!!! Please search for something else!</h3>`;
  container.insertAdjacentHTML("afterbegin", a);
};
