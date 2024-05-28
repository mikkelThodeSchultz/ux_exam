import { addItemToLocalStorage, removeItemFromLocalStorage } from './auth.js';
import { addMealToUser, removeMealFromUser } from './jsonApi.js';

export const createFoodCart = async (mealList) => {
    const meal = mealList && mealList.meals && mealList.meals[0] ? mealList.meals[0] : mealList;
    const mealId = meal.idMeal;
    const mealName = meal.strMeal;
    const mealArea = meal.strArea;
    const mealCategory = meal.strCategory;
    const mealIngredients = await getIngredients(meal);
    const mealInstructions = meal.strInstructions;
    const mealThumb = meal.strMealThumb;

    // Wrapper
    const cartSection = document.createElement('section');
    cartSection.classList.add('foodCart');
    cartSection.setAttribute('data-meal-id', mealId);
    cartSection.tabIndex = '0';

    // Thumbnail Container
    const thumbContainer = document.createElement('div');
    thumbContainer.classList.add('thumbContainer');

    // Thumbnail
    const img = document.createElement('img');
    img.src = `${mealThumb}`;
    img.alt = `Image of meal: ${mealName}`;
    img.classList.add('mealThumbnail');

    // Add Button Container
    const addBtnContainer = document.createElement('div');
    addBtnContainer.classList.add('addBtnFeatured');

    if (isMealInFavorites(Number(mealId))) {
        // Remove button
        const removeButton = document.createElement('img');
        removeButton.setAttribute('role', 'button');
        removeButton.setAttribute('tabindex', '0');
        removeButton.setAttribute('aria-label', 'Remove from favorites button');
        removeButton.setAttribute('src', '../images/minusBtn.svg');
        removeButton.classList.add('removeFromFavoritesWide');
        removeButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await removeFavorite(mealId, removeButton, e);
        });
        removeButton.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                await removeFavorite(mealId, removeButton, e);
            }
        });
        addBtnContainer.appendChild(removeButton);
    } else {
        // Add button
        const addButton = document.createElement('img');
        addButton.setAttribute('role', 'button');
        addButton.setAttribute('tabindex', '0');
        addButton.setAttribute('aria-label', 'Add to favorites button');
        addButton.setAttribute('src', '../images/addBtn.svg');
        addButton.classList.add('addToFavoritesWide');
        addButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await favoriteMeal(mealId, addButton, e);
        });
        addButton.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                await favoriteMeal(mealId, addButton, e);
            }
        });
        addBtnContainer.appendChild(addButton);
  
    }

    thumbContainer.appendChild(img);
    thumbContainer.appendChild(addBtnContainer);

    // Title Container
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title_container');

    // Meal name
    const mealNameHeading = document.createElement('h3');
    mealNameHeading.classList.add('foodCart__title');
    mealNameHeading.textContent = mealName;

    // Category and Area
    const categoryAreaArticle = document.createElement('div');
    categoryAreaArticle.classList.add('categoryArea');

    // Category
    const categoryDiv = document.createElement('div');
    categoryDiv.textContent = mealCategory;

    // Area
    const areaDiv = document.createElement('div');
    areaDiv.textContent = mealArea;

    categoryAreaArticle.appendChild(categoryDiv);
    categoryAreaArticle.appendChild(areaDiv);

    titleContainer.appendChild(mealNameHeading);
    titleContainer.appendChild(categoryAreaArticle);

    // Instructions
    const instructionsParagraph = document.createElement('p');
    instructionsParagraph.classList.add('foodCart_description');
    instructionsParagraph.textContent = await shortenInstructions(mealInstructions);


    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button_wrapper');
    
    if (isMealInFavorites(Number(mealId))) {
        // Remove button
        const removeFooterButton = document.createElement('button');
        removeFooterButton.type = 'button';
        removeFooterButton.textContent = 'Remove from favorites';
        removeFooterButton.classList.add('removeFromFavorites', 'button');
        removeFooterButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await removeFavorite(mealId, removeFooterButton, e);
        });
    
        buttonWrapper.appendChild(removeFooterButton);
    } else {
        // Favorite button (Duplicate for the footer)
        const footerButton = document.createElement('button');
        footerButton.type = 'button';
        footerButton.textContent = 'Add to favorites';
        footerButton.classList.add('addToFavorites', 'button');
        footerButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await favoriteMeal(mealId, footerButton, e);
        });
    
        buttonWrapper.appendChild(footerButton);
    }
    

    cartSection.addEventListener('click', () =>
        openModal(mealId, mealName, mealInstructions, mealIngredients, mealThumb)
    );

    cartSection.appendChild(thumbContainer);
    cartSection.appendChild(titleContainer);
    cartSection.appendChild(instructionsParagraph);
    cartSection.appendChild(buttonWrapper);

    return cartSection;
};

const shortenInstructions = async (instructions) => {
    if (instructions.length > 50) {
        return instructions.substring(0, 50) + '...';
    } else {
        return instructions;
    }
};

const getIngredients = async (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push({
                ingredient: ingredient,
                measure: measure || '',
            });
        }
    }
    return ingredients;
};

const favoriteMeal = async (mealId, addButton, e) => {
    e.stopPropagation();
    e.preventDefault();
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        location.href = '../views/login.html';
    }
    const response = await addMealToUser(userEmail, mealId);
    if (response.status === 200) {
        addButton.textContent = '✓';
        await addItemToLocalStorage(mealId, 'favoritesIdList');
    }
};

const openModal = (mealId, mealName, instructions, ingredients, mealThumb) => {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('dialog#modal span.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

    const modalThumbnail = modal.querySelector('img');
    const modalMealName = document.getElementById('modalMealName');
    const modalInstructions = document.getElementById('modalInstructions');
    const modalIngredients = document.getElementById('modalIngredients');
    const modalButtonsContainer = document.getElementById('modalButtonsContainer');

    modalThumbnail.src = mealThumb;
    modalThumbnail.alt = `Meal thumbnail of: ${mealName}`;
    modalMealName.textContent = mealName;
    modalIngredients.innerHTML = '';
    for (const ingredient of ingredients) {
        const elem = document.createElement('li');
        elem.textContent = ingredient.measure + ' ' + ingredient.ingredient;
        modalIngredients.appendChild(elem);
    }

    modalInstructions.textContent = instructions;

    modalButtonsContainer.innerHTML = '';

    if (isMealInFavorites(Number(mealId))) {
        // Remove button
        const removeFooterButton = document.createElement('button');
        removeFooterButton.type = 'button';
        removeFooterButton.textContent = 'Remove from favorites';
        removeFooterButton.classList.add('removeFromFavorites', 'button');
        removeFooterButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await removeFavorite(mealId, removeFooterButton, e);
        });
        modalButtonsContainer.appendChild(removeFooterButton);
    } else {
        // Add button
        const footerButton = document.createElement('button');
        footerButton.type = 'button';
        footerButton.textContent = 'Add to favorites';
        footerButton.classList.add('addToFavorites', 'button');
        footerButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await favoriteMeal(mealId, footerButton, e);
        });
    
        modalButtonsContainer.appendChild(footerButton);
    }

    modal.style.display = 'flex';
    
};

const isMealInFavorites = (mealId) => {
    const favorites = JSON.parse(localStorage.getItem('favoritesIdList')) || [];
    return favorites.includes(mealId);
};

const removeFavorite = async (mealId, removeButton, e) => {
    e.stopPropagation();
    e.preventDefault();
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        location.href = '../views/login.html';
    }
    await removeItemFromLocalStorage(mealId, 'favoritesIdList');
    const response = await removeMealFromUser(userEmail, mealId);
    if (response.status === 200) {
        removeButton.textContent = '✗';
    } else {
        console.log(response, mealId);
    }
};

export const trapFocusInModal = (modal) => {
    const focusableElements = modal.querySelectorAll('li, span[tabindex="0"]');  
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
};
