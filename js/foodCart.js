import { addMealToUser } from "./jsonApi.js";

export const createFoodCart = async (mealList) => {
    const meal = mealList && mealList.meals && mealList.meals[0] ? mealList.meals[0] : mealList;
    const mealId = meal.idMeal;
    const mealName = meal.strMeal;
    const mealArea = meal.strArea;
    const mealCategory = meal.strCategory;
    const mealIngredients = await getIngredients(meal);
    const mealInstructions = meal.strInstructions;
    const mealThumb = meal.strMealThumb;
    const mealTags = await getTags(meal.strTags);
    const mealYoutubeLink = meal.strYoutube;
    
    // Wrapper
    const cartSection = document.createElement('section');
    cartSection.classList.add('foodCart');

    // Thumbnail Container
    const thumbContainer = document.createElement('div');
    thumbContainer.classList.add('thumbContainer');

    // Thumbnail
    const img = document.createElement('img');
    img.src = `${mealThumb}/preview`;
    img.alt = `Meal thumbnail of: ${mealName}`;
    img.classList.add('mealThumbnail');

    // Favorite button
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+';
    addButton.classList.add('addToFavoritesButton');
    addButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        await favoriteMeal(mealId, addButton);
    });

    thumbContainer.appendChild(img);
    thumbContainer.appendChild(addButton);

    // Info Container
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('infoContainer');

    // Category and Area
    const categoryAreaArticle = document.createElement('article');
    categoryAreaArticle.classList.add('categoryArea');

    // Category
    const categorySection = document.createElement('section');
    categorySection.classList.add('category');
    categorySection.textContent = mealCategory;

    // Area
    const areaSection = document.createElement('section');
    areaSection.classList.add('area');
    areaSection.textContent = mealArea;

    categoryAreaArticle.appendChild(categorySection);
    categoryAreaArticle.appendChild(areaSection);

    // Meal name
    const mealNameHeading = document.createElement('h1');
    mealNameHeading.classList.add('mealName');
    mealNameHeading.textContent = mealName;

    // Instructions
    const instructionsParagraph = document.createElement('p');
    instructionsParagraph.classList.add('instructions');
    instructionsParagraph.textContent = await shortenInstructions(mealInstructions);

    infoContainer.appendChild(categoryAreaArticle);
    infoContainer.appendChild(mealNameHeading);
    infoContainer.appendChild(instructionsParagraph);

    cartSection.addEventListener('click', () => openModal(mealName, mealInstructions));

    cartSection.appendChild(thumbContainer);
    cartSection.appendChild(infoContainer);

    return cartSection;
}

const shortenInstructions = async (instructions) => {
    if (instructions.length > 50) {
        return instructions.substring(0, 50) + "...";
    } else {
        return instructions;
    }
}

const getIngredients = async (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push({
                ingredient: ingredient,
                measure: measure || ''
            });
        }
    }
    return ingredients;
}

const getTags = async (tags) => {
    if (!tags) {
        return "";
    }
    const tagsArrays = tags.split(',');
    return tagsArrays.map(tag => tag.trim());
}

const favoriteMeal = async (mealId, addButton) => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        location.href = "../views/login.html";
        return;
    }
    const response = await addMealToUser(userEmail, mealId);
    if (response.status === 200) {
        addButton.textContent = '✓';
    }
}

// TODO Add the rest of the data to the modal content
const openModal = (mealName, instructions) => {
    const closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const modalMealName = document.getElementById('modalMealName');
    const modalInstructions = document.getElementById('modalInstructions');

    modalMealName.textContent = mealName;
    modalInstructions.textContent = instructions;

    modal.style.display = 'block'; 
};

window.addEventListener('beforeunload', (e) => {
    // TODO VSC Go Live feature is forcing the page to reload when something changes.
    // I dont know how we can fix this issue. 
    console.log("Page is trying to unload");  
    console.log(e);
    console.trace()
});
