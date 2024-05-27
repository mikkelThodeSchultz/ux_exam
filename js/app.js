import { handleLoginAndSignup } from './login.js';
import { handleExplore } from './explore.js';
import { setUpFavorites } from './favorites.js';

const favoritesPageUrl = 'http://127.0.0.1:5500/views/favorites.html';
const explorePageUrl = 'http://127.0.0.1:5500/views/explore.html';
const homePageUrl = 'http://127.0.0.1:5500/';
handleLoginAndSignup();


const checkSite = () => {
    const currentUrl = window.location.href;
    if (currentUrl === favoritesPageUrl) {
        setUpFavorites();
    }
    if (currentUrl === explorePageUrl) {
        handleExplore();
    }
    if (currentUrl === homePageUrl) {
        // Event listener to run the function when the DOM is fully loaded
        window.addEventListener('DOMContentLoaded', (event) => {
            updateAdventureLink();
        });
    }
};

  
window.onload = checkSite();


if (sessionStorage === null || sessionStorage.getItem('userEmail') === null) {
    document.getElementById('logOutBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
} else {
    document.getElementById('logOutBtn').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signUpBtn').style.display = 'none';
}


const updateAdventureLink = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    const adventureLink = document.getElementById("adventureLink");
    if (userEmail) {
        // User is logged in, update link to explore page
        adventureLink.href = "../views/explore.html";
        adventureLink.textContent = "Start the adventure!";
        adventureLink.title = "Explore the recipes available";
       
    }
};

