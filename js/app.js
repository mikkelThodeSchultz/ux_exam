import { searchMealByName } from "./mealApi.js";
import { logIn, logout, signUp } from "./auth.js";

const searchForMealForm = document.getElementById("searchForMeal")
if(searchForMealForm){
    searchForMealForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const searchInput = searchForMealForm.querySelector("#searchInput").value;
        try {
            const  response = await searchMealByName(searchInput)
            console.log(response);
        } catch (error){
            console.log(error);
        }
    })
}


const setupSignupForm = document.getElementById("signUpForm")
if(setupSignupForm){
    setupSignupForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(setupSignupForm)
        try{
            const response = await signUp(formData)
            if(response.status == 201){
                window.location.href = "../views/login.html"
                alert("User have been created succesfully")
            }
        } catch (error) {
            console.log(error);
        }
    })
}

const setupLoginForm = document.getElementById("logInForm")
if(setupLoginForm){
    setupLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(setupLoginForm)
        try{
            const response = await logIn(formData)
            if(!response){
                alert("Wrong email or password")
            }
            else if(response.status == 200){
                window.location.href = "../views/"
                alert("User logged in succesfully")
            } 
        } catch (error) {
            console.log(error);
        }
    })
}

const setupLogOut = document.getElementById("logOutBtn")
if(setupLogOut){
    setupLogOut.addEventListener("click", async (e) => {
        e.preventDefault()
        await logout()
        window.location.href = "../views/"
    })
}

//Create a function that takes a meal and creates a card.
//It needs to be able to create a card based on a random meal and a specific meal