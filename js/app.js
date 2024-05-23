import { handleLoginAndSignup } from './login.js';
import { handleExplore } from './explore.js';
import { setUpFavorites } from './favorites.js';

const favoritesPageUrl = "http://127.0.0.1:5500/views/favorites.html";
handleLoginAndSignup();
handleExplore();

const checkSite = () => {
    const currentUrl = window.location.href;
    if (currentUrl === favoritesPageUrl){
      setUpFavorites()
    }
  };
  
  window.onload = checkSite();