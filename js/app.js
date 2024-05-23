import { randomMeal, searchMealById, searchMealByName } from "./mealApi.js";
import { logIn, logout, signUp } from "./auth.js";
import { createFoodCart } from "./foodCart.js";
import { getUserByEmail } from "./jsonApi.js";

const explorePageUrl = "http://127.0.0.1:5500/views/explore.html";
const favoritesPageUrl = "http://127.0.0.1:5500/views/favorites.html";

const searchForMealForm = document.getElementById("searchForMeal");
if (searchForMealForm) {
  let timer;
  const handleSearchInput = async () => {
    const searchInput = searchForMealForm.querySelector("#searchInput").value;
    try {
      console.log(!searchInput);
      if (!searchInput) {
        setUpExplore();
      } else {
        const response = await searchMealByName(searchInput);
        setSearchedMeals(response.meals);
      }
    } catch (error) {
      console.log(error);
    }
  };

  searchForMealForm.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(handleSearchInput, 500);
  });
}

const setSearchedMeals = async (meals) => {
  const mealsContainer = document.getElementById("mealsContainer");
  mealsContainer.innerHTML = "";
  for (const meal of meals) {
    const foodCart = await createFoodCart(meal);
    mealsContainer.appendChild(foodCart);
  }
};

const setupSignupForm = document.getElementById("signUpForm");
if (setupSignupForm) {
  setupSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(setupSignupForm);
    try {
      const response = await signUp(formData);
      if (response.status == 201) {
        window.location.href = "../views/login.html";
        alert("User have been created succesfully");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const setupLoginForm = document.getElementById("logInForm");
if (setupLoginForm) {
  setupLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(setupLoginForm);
    try {
      const response = await logIn(formData);
      if (!response) {
        alert("Wrong email or password");
      } else if (response.status == 200) {
        window.location.href = "";
        alert("User logged in succesfully");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const setupLogOut = document.getElementById("logOutBtn");
if (setupLogOut) {
  setupLogOut.addEventListener("click", async (e) => {
    e.preventDefault();
    await logout();
    window.location.href = "/";
  });
}

const setUpExplore = async () => {
  //Return statement to avoid overusing the API
  // return
  const mealsContainer = document.getElementById("mealsContainer");
  mealsContainer.innerHTML = "";
  for (let index = 0; index < 8; index++) {
    const meal = await randomMeal();
    const foodCard = await createFoodCart(meal);
    mealsContainer.appendChild(foodCard);
  }
};

const setUpFavorites = async () => {
  const userEmail = sessionStorage.getItem('userEmail');
  if (!userEmail) {
    location.href = "../views/login.html";
    return;
}
  const user = await getUserByEmail(userEmail)
  const mealsContainer = document.getElementById("favoritesMealsContainer");
  mealsContainer.innerHTML = "";
  for (let index = 0; index < user.favourites_id.length; index++) {
    const meal = await searchMealById(user.favourites_id[index])
    const foodCard = await createFoodCart(meal);
    mealsContainer.appendChild(foodCard);
  } 
}

const checkSite = () => {
  const currentUrl = window.location.href;
  if (currentUrl === explorePageUrl) {
    setUpExplore();
  }
  if (currentUrl === favoritesPageUrl){
    setUpFavorites()
  }
};

window.onload = checkSite();
