import { createFoodCart } from './foodCart.js';
import { searchMealById } from './mealApi.js';

export const setUpFavorites = async () => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        location.href = '../views/login.html';
        return;
    }

    const userFavoritesList = JSON.parse(localStorage.getItem('favoritesIdList'));
    const mealsContainer = document.getElementById('favoritesMealsContainer');
    mealsContainer.innerHTML = '';
    for (let index = 0; index < userFavoritesList.length; index++) {
        const meal = await searchMealById(userFavoritesList[index]);
        const foodCard = await createFoodCart(meal);
        mealsContainer.appendChild(foodCard);
    }
};

