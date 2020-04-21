"use strict";
(async() => {

    const spoonPath = "https://api.spoonacular.com/recipes/"
    const spoonKey = "422896595733422cab793b743632e7d6";


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
    $("#searchBtn").click(async() => {
        console.log(await getRecipes(5, getIngredientsString()));
    });

    // Returns an array of up to n recipes based on given ingredients
    async function getRecipes(n, ingredients) {
        const recList = await searchRecipesbyIngredients(n, ingredients);
        const newList = await Promise.all(recList.map(recipe => getRecipeInfo(recipe)));
        return newList;
    }

    function renderRecipes(recipes) {
        $("#fiveRecipes").empty();
        recipes.forEach(recipe => {
            let card = $("<div>").addClass("column sectionContent recipediv")
                .append($("<p>").text(recipe.title))
                .append($("<img>").attr("src", recipe.image))
                .append($("<p>").text("Calories: " + recipe.nutrition.nutrients[0].amount));
            $("#fiveRecipes").append(card);
        });

    }
})();