import { searchMealByName } from "../js/api.js";

const searchForMealForm = document.getElementById("searchForMeal")
if(searchForMealForm){
    searchForMealForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        console.log("I was pressed");
        const searchInput = searchForMealForm.querySelector("#searchInput").value;
        try {
            const  response = await searchMealByName(searchInput)
            console.log(response);
        } catch (error){
            console.log(error);
        }
    })
}

