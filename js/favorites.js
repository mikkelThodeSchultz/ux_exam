import { createFoodCart } from "./foodCart.js";
import { getUserByEmail } from "./jsonApi.js";
import { searchMealById } from "./mealApi.js";

const favoritesPageUrl = "http://127.0.0.1:5500/views/favorites.html";

export const setUpFavorites = async () => {
    console.log("TEST");
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

