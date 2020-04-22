"use strict";
(async() => {

    const spoonPath = "https://api.spoonacular.com/recipes/";
    const spoonKey = "422896595733422cab793b743632e7d6";

    const nixPath = "https://trackapi.nutritionix.com/v2/natural/nutrients";
    const nixID = "e4253e49";
    const nixKey = "d7a3983ea636dff493d732d84db3f27e";

    function getNutrtionInfo(ingredients, servings) {
        return $.ajax({
            async: true,
            crossDomain: true,
            url: nixPath,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
                "x-app-id": nixID,
                "x-app-key": nixKey,
                "x-remote-user-id": "0",
            },
            data: JSON.stringify({
                "query": ingredients,
                "aggregate": "serving",
                "num_servings": servings,
            }),
        });
    }

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

    //Returns list of ingredients represented as comma delimited string
    function getIngredientsString() {
        return $.map($("#ingredientUL").children(), (item) => $(item).text().slice(0, -1)).toString();
    }

    // Returns an array of up to n recipes based on given ingredients
    async function getRecipes(n, ingredients) {
        const recList = await searchRecipesbyIngredients(n, ingredients);
        const newList = await Promise.all(recList.map(recipe => getRecipeInfo(recipe)));
        return newList;
    }

    // function renderRecipes(recipes) {
    //     $("#fiveRecipes").empty();
    //     recipes.forEach(recipe => {
    //         let card = $("<div>").addClass("column sectionContent recipediv")
    //             .append($("<p>").text(recipe.title))
    //             .append($("<img>").attr("src", recipe.image))
    //             .append($("<p>").text("Calories: " + recipe.nutrition.nutrients[0].amount));
    //         $("#fiveRecipes").append(card);
    //     });

    function renderRecipes(recipes) {
        $("#fiveRecipes").empty();
        recipes.forEach(recipe => {
            let card = $("<div>").addClass("card column is-4");
            let img = $("<img>").addClass("card-image").attr("src", recipe.image);
            $("#fiveRecipes").append(card.append(img));
        });
    }

    $("#searchBtn").click(async() => {
        const recipes = await getRecipes(6, getIngredientsString());
        renderRecipes(recipes);
    });

})();