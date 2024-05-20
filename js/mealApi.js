
const URL = 'https://www.themealdb.com/api/json/v1/1/';

export const searchMealByName = async (mealName) => {
    if(!mealName){
        return;
    }
    try {
        const response = await fetch(URL + 'search.php?s=' + mealName);
        return response.json();
    } catch (error) {
        throw new Error('Error fetching meal by name: ' + error);
    }
};

export const randomMeal = async () => {
    try {
        const response = await fetch(URL + 'random.php');
        return response.json();
    } catch (error) {
        throw new Error('Error fetching random meal: ' + error);
    }
};

export const searchMealById = async (mealId) => {
    if(!mealId){
        return;
    }
    try {
        const response = await fetch(URL + 'lookup.php?i=' + mealId);
        return response.json();
    } catch (error) {
        throw new Error('Error fetching meal by id: ' + error);
    }
};

export const listAllCategories = async () => {
    try {
        const response = await fetch(URL + 'categories.php');
        return response.json();
    } catch (error) {
        throw new Error('Error fetching list of categories: ' + error);
    }
};

export const filterByCategory =  async (category) => {
    if (!category){
        return;
    }
    try {
        const response = await fetch(URL + 'filter.php?c=' + category);
        return response.json();
    } catch (error) {
        throw new Error('Error filtering by category: ' + error);
    }
};