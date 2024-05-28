import { addItemToLocalStorage,removeItemFromLocalStorage } from './auth.js';
import { addMealToUser,removeMealFromUser } from './jsonApi.js';

export const createFoodCart = async (mealList) => {
    const meal =
    mealList && mealList.meals && mealList.meals[0]
        ? mealList.meals[0]
        : mealList;
    const mealId = meal.idMeal;
    const mealName = meal.strMeal;
    const mealArea = meal.strArea;
    const mealCategory = meal.strCategory;
    const mealIngredients = await getIngredients(meal);
    const mealInstructions = meal.strInstructions;
    const mealThumb = meal.strMealThumb;
    //const mealTags = await getTags(meal.strTags);
    //const mealYoutubeLink = meal.strYoutube;

    // Wrapper
    const cartSection = document.createElement('section');
    cartSection.classList.add('foodCart');
    cartSection.setAttribute('data-meal-id', mealId);
  cartSection.tabIndex='0';

    // Thumbnail Container
    const thumbContainer = document.createElement('div');
    thumbContainer.classList.add('thumbContainer');

    // Thumbnail
    const img = document.createElement('img');
    img.src = `${mealThumb}`;
    img.alt = `Image of meal: ${mealName}`;
    img.classList.add('mealThumbnail');

    // Buttons Container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttonsContainer');

    if (isMealInFavorites(Number(mealId))) {
    // Remove button
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = '-';
        removeButton.classList.add('removeFromFavoritesButton');
        removeButton.setAttribute('aria-label', 'Remove from favorites');
        removeButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await removeFavorite(mealId, removeButton, e);
        });
        buttonsContainer.appendChild(removeButton);
    } else {
    // Add button
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.textContent = '+';
        addButton.classList.add('addToFavoritesButton');
        addButton.setAttribute('aria-label', 'Add to favorites');
        addButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await favoriteMeal(mealId, addButton, e);
        });
        buttonsContainer.appendChild(addButton);
    }

    thumbContainer.appendChild(img);
 

  // Title Container
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title_container");

  // Meal name
  const mealNameHeading = document.createElement("h3");
  mealNameHeading.classList.add("foodCart__title");
  mealNameHeading.textContent = mealName;

  // Category and Area
  const categoryAreaArticle = document.createElement("div");
  categoryAreaArticle.classList.add("categoryArea");

  // Category
  const categoryDiv = document.createElement("div");
  categoryDiv.textContent = mealCategory;

  // Area
  const areaDiv = document.createElement("div");
  areaDiv.textContent = mealArea;

  categoryAreaArticle.appendChild(categoryDiv);
  categoryAreaArticle.appendChild(areaDiv);

  titleContainer.appendChild(mealNameHeading);
  titleContainer.appendChild(categoryAreaArticle);

  // Instructions
  const instructionsParagraph = document.createElement("p");
  instructionsParagraph.classList.add("foodCart__description");
  instructionsParagraph.textContent = await shortenInstructions(
    mealInstructions
  );

  // Button Wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button_wrapper");

  // Favorite button (Duplicate for the footer)
  const footerButton = document.createElement("button");
  footerButton.type = "button";
  footerButton.textContent = "Add to favorites";
  footerButton.classList.add("addToFavorites", "button");
  footerButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    favoriteMeal(mealId, footerButton, e);
  });

  buttonWrapper.appendChild(footerButton);

  cartSection.addEventListener("click", () =>
    openModal(mealName, mealInstructions, mealIngredients, mealThumb)
  );
  cartSection.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        openModal(mealName, mealInstructions, mealIngredients, mealThumb);
    }
  });

  cartSection.appendChild(thumbContainer);
  cartSection.appendChild(titleContainer);
  cartSection.appendChild(instructionsParagraph);
  cartSection.appendChild(buttonWrapper);

  return cartSection;
};


const shortenInstructions = async (instructions) => {
  if (instructions.length > 200) {
    return instructions.substring(0, 200) + "...";
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

// const getTags = async (tags) => {
//     if (!tags) {
//         return '';
//     }
//     const tagsArrays = tags.split(',');
//     return tagsArrays.map((tag) => tag.trim());
// };

const favoriteMeal = async (mealId, addButton, e) => {
  e.stopPropagation();
  e.preventDefault();
  const userEmail = sessionStorage.getItem("userEmail");
  if (!userEmail) {
    location.href = "../views/login.html";
  }
  const response = await addMealToUser(userEmail, mealId);
  if (response.status === 200) {
    addButton.textContent = "✓";
    await addItemToLocalStorage(mealId, "favoritesIdList");
  }
};


// TODO Add the rest of the data to the modal content
const openModal = (mealName, instructions, ingredients, mealThumb) => {
  const modal = document.querySelector("dialog#modal");

  const closeBtn = modal.querySelector("span.close");
  
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  })

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  closeBtn.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      modal.style.display = "none";
    }
  });
  

  closeBtn.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      modal.style.display = "none";
    }
  });
  

  const modalThumbnail = modal.querySelector("img");
  const modalMealName = document.getElementById("modalMealName");
  const modalInstructions = document.getElementById("modalInstructions");
  const modalIngredients = document.getElementById("modalIngredience");

  modalThumbnail.src = mealThumb;
  modalThumbnail.alt = `Meal thumbnail of: ${mealName}`;
  modalMealName.textContent = mealName;
  modalIngredients.innerHTML = "";
  for (const ingredient of ingredients) {
    const elem = document.createElement("li");
    elem.textContent = ingredient.measure + " " + ingredient.ingredient;
    modalIngredients.appendChild(elem);
  }

  modalInstructions.textContent = instructions;
  
  modal.style.display = "flex";
  modal.focus()
  trapFocusInModal(modal)
};

//TODO Maybe this should be moved to another file
export const trapFocusInModal = (modal) => {
  const focusableElements = modal.querySelectorAll('li, span[tabindex="0"]');  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
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