"use strict";
(async() => {

    const spoonPath = "https://api.spoonacular.com/recipes/"
    const spoonKey = "422896595733422cab793b743632e7d6";

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
    function getRecipeInfo(recipe) {
        return $.ajax({
            url: spoonPath + recipe.id + "/information?" + $.param({
                apiKey: spoonKey,
                includeNutrition: true,
            }),
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    //get list of recipes
    const recList = await searchRecipesbyIngredients(5, ingredients);
    const newList = await Promise.all(recList.map(recipe => getRecipeInfo(recipe)));
    console.log(newList);

})();