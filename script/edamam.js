"use strict";
(async() => {

    const spoonPath = "https://api.spoonacular.com/recipes/";
    const spoonKey = "13372430cfbe412c8b8ff476d4568091";

    const nixPath = "https://trackapi.nutritionix.com/v2/natural/nutrients";
    const nixID = "e4253e49";
    const nixKey = "d7a3983ea636dff493d732d84db3f27e";

    // Queries Nutritionix API and returns object with nutrition data
    // for given recipe.
    function getNutrtionInfo(recipe) {
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
                "query": getIngredientsFromRecipe(recipe),
                "aggregate": "serving",
                "num_servings": recipe.servings,
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

    // Returns list of ingredients from page as comma delimited string
    function getIngredientsFromPage() {
        return $.map($("#ingredientUL").children(), (item) => $(item).text().slice(0, -1)).toString();
    }

    // Returns list of ingredients from given recipe as a comma delimited string
    function getIngredientsFromRecipe(recipe) {
        return recipe.extendedIngredients.map(ingredient => ingredient.originalString).toString();
    }

    // Returns an array of up to n recipes based on given ingredients
    async function getRecipes(n, ingredients) {
        const recList = await searchRecipesbyIngredients(n, ingredients);
        const newList = await Promise.all(recList.map(recipe => getRecipeInfo(recipe)));
        return newList;
    }


    // Renders recipe cards to the page.
    function renderRecipes(recipes) {
        $("#fiveRecipes").empty();
        recipes.forEach(recipe => {
            let card = $("<div>").addClass("column card is-5");
            let img = $("<img>").addClass("card-image").attr("src", recipe.image);
            $("#fiveRecipes").append(card.append(img));
        });
    }

    // Addes event handlers to all recipe cards on the page
    function addRecipeCardEventHandlers(recipes, nutrition) {
        $.each($("#fiveRecipes").children(), (index, card) => {
            $(card).click(() => {
                $("#recipeName").text(recipes[index].title);
                $("#recipeCalories").text(nutrition[index].foods[0].nf_calories + "kcal");
                $("#recipeCarbs").text(nutrition[index].foods[0].nf_total_carbohydrate + "g");
                $("#recipeFat").text(nutrition[index].foods[0].nf_total_fat + "g");
                $("#recipeProtein").text(nutrition[index].foods[0].nf_protein + "g");
                $("#recipeLink").attr("href", recipes[index].sourceUrl);
            });
        });
    }

    $("#searchBtn").click(async() => {
        if ($("#ingredientUL").children().length == 0) {
            $(".modal").addClass("is-active");
        }
        else { 
            document.body.style.cursor='wait'; 
            const recipes = await getRecipes(6, getIngredientsFromPage());
            const nutrition = await Promise.all(recipes.map(recipe => getNutrtionInfo(recipe)));
            renderRecipes(recipes);
            addRecipeCardEventHandlers(recipes, nutrition);
            document.body.style.cursor='default';
        }
    });


    //use local storage to pass around data rather than vars
})();