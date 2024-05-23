import { createFoodCart } from "./foodCart.js";
import { getUserByEmail } from "./jsonApi.js";
import { searchMealById } from "./mealApi.js";

const favoritesPageUrl = "http://127.0.0.1:5500/views/favorites.html";

export const setUpFavorites = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      location.href = "../views/login.html";
      return;
  }
    const user = await getUserByEmail(userEmail)
    const userFavoritesList = JSON.parse(localStorage.getItem('favoritesIdList'))
    const mealsContainer = document.getElementById("favoritesMealsContainer");
    mealsContainer.innerHTML = "";
    for (let index = 0; index < userFavoritesList.length; index++) {
      const meal = await searchMealById(userFavoritesList[index])
      const foodCard = await createFoodCart(meal);
      mealsContainer.appendChild(foodCard);
    } 
  }

