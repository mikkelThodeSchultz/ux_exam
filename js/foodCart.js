import { addItemToLocalStorage } from "./auth.js";
import { addMealToUser } from "./jsonApi.js";

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
  cartSection.tabIndex='0';

  // Thumbnail Container
  const thumbContainer = document.createElement("div");
  thumbContainer.classList.add("thumbContainer");

  // Thumbnail
  const img = document.createElement("img");
  img.src = `${mealThumb}`;
  img.alt = `Meal thumbnail of: ${mealName}`;
  img.classList.add("mealThumbnail");

  // Favorite button
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "+";
  addButton.classList.add("addToFavoritesButton");
  addButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    favoriteMeal(mealId, addButton, e);
  });

  thumbContainer.appendChild(img);
  thumbContainer.appendChild(addButton);

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
    openModal(mealName, mealInstructions, mealIngredients)
  );
  cartSection.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        openModal(mealName, mealInstructions, mealIngredients);
    }
  });

  cartSection.appendChild(thumbContainer);
  cartSection.appendChild(infoContainer);
  cartSection.appendChild(addButton);

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
const openModal = (mealName, instructions, ingredients) => {
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
  

  const modalMealName = document.getElementById("modalMealName");
  const modalInstructions = document.getElementById("modalInstructions");
  const modalIngredients = document.getElementById("modalIngredience");

  modalMealName.textContent = mealName;
  modalIngredients.innerHTML = "";
  for (const ingredient of ingredients) {
    const elem = document.createElement("p");
    elem.textContent = ingredient.measure + " " + ingredient.ingredient;
    modalIngredients.appendChild(elem);
  }

  modalInstructions.textContent = instructions;
  
  modal.style.display = "block";
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