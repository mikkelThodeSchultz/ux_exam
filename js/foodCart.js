import { addItemToLocalStorage,removeItemFromLocalStorage } from "./auth.js";
import { addMealToUser,removeMealFromUser } from "./jsonApi.js";

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
  const mealTags = await getTags(meal.strTags);
  const mealYoutubeLink = meal.strYoutube;

  // Wrapper
  const cartSection = document.createElement("section");
  cartSection.classList.add("foodCart");
  cartSection.setAttribute('data-meal-id', mealId);

  // Thumbnail Container
  const thumbContainer = document.createElement("div");
  thumbContainer.classList.add("thumbContainer");

  // Thumbnail
  const img = document.createElement("img");
  img.src = `${mealThumb}`;
  img.alt = `Image of meal: ${mealName}`;
  img.classList.add("mealThumbnail");

  // Buttons Container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttonsContainer");

  if (isMealInFavorites(Number(mealId))) {
    // Remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = '-';
    removeButton.classList.add("removeFromFavoritesButton");
    removeButton.setAttribute("aria-label", "Remove from favorites");
    removeButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await removeFavorite(mealId, removeButton, e);
    });
    buttonsContainer.appendChild(removeButton);
  } else {
    // Add button
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = '+';
    addButton.classList.add("addToFavoritesButton");
    addButton.setAttribute("aria-label", "Add to favorites");
    addButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await favoriteMeal(mealId, addButton, e);
    });
    buttonsContainer.appendChild(addButton);
  }

  thumbContainer.appendChild(img);
 

  // Info Container
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("infoContainer");

  // Category and Area
  const categoryAreaArticle = document.createElement("article");
  categoryAreaArticle.classList.add("categoryArea");

  // Category
  const categorySection = document.createElement("section");
  categorySection.classList.add("category");
  categorySection.textContent = mealCategory;

  // Area
  const areaSection = document.createElement("section");
  areaSection.classList.add("area");
  areaSection.textContent = mealArea;

  categoryAreaArticle.appendChild(categorySection);
  categoryAreaArticle.appendChild(areaSection);

  // Meal name
  const mealNameHeading = document.createElement("h1");
  mealNameHeading.classList.add("mealName");
  mealNameHeading.textContent = mealName;

  // Instructions
  const instructionsParagraph = document.createElement("p");
  instructionsParagraph.classList.add("instructions");
  instructionsParagraph.textContent = await shortenInstructions(
    mealInstructions
  );

  infoContainer.appendChild(categoryAreaArticle);
  infoContainer.appendChild(mealNameHeading);
  infoContainer.appendChild(instructionsParagraph);

  cartSection.addEventListener("click", () =>
    openModal(mealId, mealName, mealInstructions, mealIngredients)
  );

  cartSection.appendChild(thumbContainer);
  cartSection.appendChild(infoContainer);
  cartSection.appendChild(buttonsContainer)
  
  return cartSection;
};


const shortenInstructions = async (instructions) => {
  if (instructions.length > 50) {
    return instructions.substring(0, 50) + "...";
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
        measure: measure || "",
      });
    }
  }
  return ingredients;
};

const getTags = async (tags) => {
  if (!tags) {
    return "";
  }
  const tagsArrays = tags.split(",");
  return tagsArrays.map((tag) => tag.trim());
};

const favoriteMeal = async (mealId, addButton, e) => {
  e.stopPropagation();
  e.preventDefault();
  const userEmail = sessionStorage.getItem("userEmail");
  if (!userEmail) {
    location.href = "../views/login.html";
  }
  const response = await addMealToUser(userEmail, mealId);
  if (response.status === 200) {
    //TODO Change Tick with "&#10003;"
    addButton.textContent = "✓";
    await addItemToLocalStorage(mealId, "favoritesIdList");
  }
};


// TODO Add the rest of the data to the modal content
const openModal = (mealId, mealName, instructions, ingredients) => {
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector("dialog#modal span.close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const modalMealName = document.getElementById("modalMealName");
  const modalInstructions = document.getElementById("modalInstructions");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalButtonsContainer = document.getElementById("modalButtonsContainer");

  modalMealName.textContent = mealName;
  modalIngredients.innerHTML = "";
  for (const ingredient of ingredients) {
    const elem = document.createElement("p");
    elem.textContent = ingredient.measure + " " + ingredient.ingredient;
    modalIngredients.appendChild(elem);
  }

  modalInstructions.textContent = instructions;

  // Clear previous buttons
  modalButtonsContainer.innerHTML = '';

  if (isMealInFavorites(Number(mealId))) {
    // Remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.classList.add('removeFromFavoritesButton');
    removeButton.setAttribute("aria-label", "Remove from favorites");
    removeButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      removeFavorite(mealId, removeButton, e);
    });
    modalButtonsContainer.appendChild(removeButton);
  } else {
    // Add button
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+';
    addButton.classList.add('addToFavoritesButton');
    addButton.setAttribute("aria-label", "Add to favorites");
    addButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      favoriteMeal(mealId, addButton, e);
    });
    modalButtonsContainer.appendChild(addButton);
  }

  modal.style.display = "block";
};

const isMealInFavorites = (mealId) => {
  const favorites = JSON.parse(localStorage.getItem("favoritesIdList")) || [];
  return favorites.includes(mealId);
};



const removeFavorite = async (mealId, addButton, e) => {
  e.stopPropagation();
  e.preventDefault();
  const userEmail = sessionStorage.getItem("userEmail");
  if (!userEmail) {
    location.href = "../views/login.html";
  }
  await removeItemFromLocalStorage(mealId, "favoritesIdList");
  const response = await removeMealFromUser(userEmail, mealId);
  if (response.status === 200) {
    addButton.innerHTML = '&#10003;';
    
  } else {
    console.log(response, mealId);
  }
};

