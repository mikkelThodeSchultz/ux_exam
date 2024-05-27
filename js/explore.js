import { randomMeal, searchMealByName, listAllCategories, filterByCategory, searchMealById } from './mealApi.js';
import { createFoodCart } from './foodCart.js';

export const handleExplore = () => {
    
    const searchForMealForm = document.getElementById('searchForMeal');
    const categoriesButton = document.getElementById('showCategories');
    const categoriesList = document.getElementById('categories');
    const categoriesCloseButton = document.querySelector('#categories span.close');

    if (searchForMealForm) {
        let timer;
        const handleSearchInput = async () => {
            const searchInput = searchForMealForm.querySelector('#searchInput').value;
            try {
                console.log(searchInput);
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

        searchForMealForm.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(handleSearchInput, 500);
        });

        searchForMealForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleSearchInput();
        });

        categoriesButton.addEventListener('click', async (event) => {
            event.preventDefault();
            categoriesList.classList.add('open');
            const response = await listAllCategories();
            setCategories(response.categories);
        });

        categoriesCloseButton.addEventListener('click', () => {
            categoriesList.classList.remove('open');
        });
    }

    const setSearchedMeals = async (meals) => {
        const mealsContainer = document.getElementById('mealsContainer');
        mealsContainer.innerHTML = '';
        for (const meal of meals) {
            const foodCart = await createFoodCart(meal, 'explore');
            mealsContainer.appendChild(foodCart);
        }
    };

    const handleCategorySelected = async (event) => {
        event.preventDefault();
        
        const categorySelected = event.target.innerText;
        const response = await filterByCategory(categorySelected);
        const meals = [];

        // Each meal in "response.meals" does not contain all the info we need
        // (Only name, picture and ID)
        // So we use the "searchMealById" to get full details for each meal
        // in this category.
        for (const meal of response.meals) {
            const mealDetails = await searchMealById(meal.idMeal);
            meals.push(mealDetails);
        }

        await setSearchedMeals(meals);

        categoriesList.classList.remove('open');
    };

    const setCategories = (categories) => {
        const ol = document.querySelector('#categories ol');
        ol.innerHTML = '';
        for (const category of categories) {
            const categoryItem = document.createElement('li');
            categoryItem.innerText = category.strCategory;
            categoryItem.addEventListener('click', handleCategorySelected);
            ol.appendChild(categoryItem);
        }
    };

    const setUpExplore = async () => {
        //Return statement to avoid overusing the API
        const mealsContainer = document.getElementById('mealsContainer');
        mealsContainer.innerHTML = '';
        for (let index = 0; index < 8; index++) {
            const meal = await randomMeal();
            const foodCard = await createFoodCart(meal,'explore');
            mealsContainer.appendChild(foodCard);
        }
    };

    setUpExplore();
};