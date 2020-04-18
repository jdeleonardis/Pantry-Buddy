"use strict";

const edamamPath = "https://api.edamam.com/api/nutrition-details?";
const edamamKey = "646ebf778ee35793a6a2f75395feb6b5";
const edamamID = "e26e6ea3"

const spoonPath = "https://api.spoonacular.com/recipes/"
const spoonKey = "89a828a4c4c4404ebfce8e548e0a233e";

const ingredients = "chicken, rice, cheese";


// Queries Spoonacular API to get a list of up to n
// recipes matching given string of ingredients.
function searchRecipesbyIngredients(n, ingredients) {
    return $.ajax({
        url: spoonPath + "findByIngredients?" + $.param({
            apiKey: spoonKey,
            ingredients: ingredients,
            number: n,
            limitLicense: false, //only return recipes with open license
            ranking: 1, //maximize used ingredients
            ignorePantry: true, //ignore typical pantry items
        }),
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// Queries Spoonacular API to get details for recipe 
// given unique id number.
function getRecipeInfo(id) {
    return $.ajax({
        url: spoonPath + id + "/information?" + $.param({
            apiKey: spoonKey,
            includeNutrition: true,
        }),
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// Promise chain (I think) 
searchRecipesbyIngredients(5, ingredients).then((value) => {
    const idArr = value.map(element => element = element.id);
    idArr.forEach(element => getRecipeInfo(element).then((value) => console.log(value)));
});

// Setting this one aside til I'm certain we need it.
function getNutrition(obj) {
    return $.ajax({
        url: edamamPath + $.param({
            app_id: edamamID,
            app_key: edamamKey,
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            title: obj[0].title,
            ingr: obj[0].usedIngredients.map(element => element.name),
            url: undefined,
        }),
    });
}
















// getRecipe(ingredients).then((value) => { localStorage.setItem("recipe", JSON.stringify(value)) });
// console.log(JSON.parse(localStorage.getItem("recipe")));

// const spoonHost = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
// const spoonPath = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?";
// const spoonKey = "4169f5f39fmsh5d69e97fb32ed70p108e0fjsneb5cfde175fb";