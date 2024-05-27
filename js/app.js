import { handleLoginAndSignup } from './login.js';
import { handleExplore } from './explore.js';
import { setUpFavorites } from './favorites.js';

const favoritesPageUrl = 'http://127.0.0.1:5500/views/favorites.html';
const explorePageUrl = 'http://127.0.0.1:5500/views/explore.html';
handleLoginAndSignup();


const checkSite = () => {
    const currentUrl = window.location.href;
    if (currentUrl === favoritesPageUrl){
        setUpFavorites();
    }
    if (currentUrl === explorePageUrl) {
        handleExplore();
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
