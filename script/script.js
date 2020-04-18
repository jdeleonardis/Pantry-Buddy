$(document).ready(function() {


    var allRecipeDetail = [];
    var recipeCounter = 0;
    var spoonacularAPIKey = "4169f5f39fmsh5d69e97fb32ed70p108e0fjsneb5cfde175fb"; //while developing, put your APIKey to spoonacular here
    //https://rapidapi.com/spoonacular/api/recipe-food-nutrition


    function getRecipes() {
        var allRecipeIDs = [];
        var ingredientList = "";
        //var numberOfRecipesReturned = 5; --hard coded to be 5

        //get list of ingredients.  Slice off the last 'x' (used on the list), and add a comma
        $('#ingredientUL li').each(function (i) {
            ingredientList += $(this).text().slice(0, -1)  + ","               
        });

        //slice off the last digit - last 1 will always be ","
        ingredientList = ingredientList.slice(0, -1);

        var recipeListQueryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=" + ingredientList + '"';
        // console.log(recipeListQueryURL)
        // var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=2&ranking=1&ignorePantry=false&ingredients=apples%252Cflour%252Csugar"
            
        var recipeListSettings = {
            "async": true,
            "crossDomain": true,
            "url": recipeListQueryURL,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": spoonacularAPIKey
            }
        }

        // var recipeListSettings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=chicken,potatoes,thyme",
        //     "method": "GET",
        //     "headers": {
        //         "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        //         "x-rapidapi-key": ""
        //     }
        // }


        // var recipeListSettings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://webknox-recipes.p.rapidapi.com/recipes/findByIngredients?number=5&ingredients=chicken,potatoes,thyme",
        //     "method": "GET",
        //     "headers": {
        //         "x-rapidapi-host": "webknox-recipes.p.rapidapi.com",
        //         "x-rapidapi-key": ""
        //     }
        // }

        $.ajax(recipeListSettings).then(function(recipeListResponse) {

            for (i = 0; i < recipeListResponse.length; i++) {

                //add all of the recipes found
                allRecipeIDs.push(recipeListResponse[i].id);
            }

            getRecipeDetail(allRecipeIDs);
        });
    }

    function getRecipeDetail(allRecipeIDs) {
        var sourceUrl = "";
        var recipeCounter = 0;

        for (i = 0; i < allRecipeIDs.length; i++) {

            //for each recipe returned, get the recipe details
            var recipeDetailQueryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + allRecipeIDs[i] + "/information";
            var recipeDetailSettings = {
                "async": true,
                "crossDomain": true,
                "url": recipeDetailQueryURL,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                    "x-rapidapi-key": spoonacularAPIKey
                }
            }

            $.ajax(recipeDetailSettings).then(function(recipeDetailResponse) {
                //console.log(recipeDetailResponse);                
                var ingredientDetails = [];
                var ingredientString = "";
                //loop through all of the extended ingredients and get some info to build
                for (j = 0; j < recipeDetailResponse.extendedIngredients.length; j++) {

                    ingredientDetails.push({
                        ingredientName: recipeDetailResponse.extendedIngredients[j].name,
                        ingredientAmount: recipeDetailResponse.extendedIngredients[j].amount,
                        ingredientUnit: recipeDetailResponse.extendedIngredients[j].unit,
                        ingredientInstruction: recipeDetailResponse.extendedIngredients[j].originalString,
                    });

                    ingredientString += recipeDetailResponse.extendedIngredients[j].originalString + " ";
                }

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://trackapi.nutritionix.com/v2/natural/nutrients",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json",
                        "x-app-id": "e4253e49",
                        "x-app-key": "d7a3983ea636dff493d732d84db3f27e",
                        "x-remote-user-id": "0",
                    },
                    //"data": "{\n \"query\": \"1 potato\",\n \"num_servings\": 1,\n \"aggregate\": \"string\",\n \"line_delimited\": false,\n \"use_raw_foods\": false,\n \"include_subrecipe\": false,\n \"timezone\": \"US/Eastern\",\n \"consumed_at\": null,\n \"lat\": null,\n \"lng\": null,\n \"meal_type\": 0,\n \"use_branded_foods\": false,\n \"locale\": \"en_US\"\n }"
                    //"data": "{\n \"query\": \"1 potato and 1gs bittersweet chocolate\",\n \"aggregate\": \"foods\" \n}"            
                    //"data": "{\n \"query\": \"" + ingredientString + "\",\n \"aggregate\": \"foods\" \n}"            
                    "data": "{\n \"query\": \"" + ingredientString + "\",\n \"aggregate\": \"foods\", \n \"num_servings\": \"" + recipeDetailResponse.servings + "\" \n }"
                }

                $.ajax(settings).done(function(response) {
                    var nutritionalDetails = [];
                    //console.log(response);
                    nutritionalDetails.push({
                        calories: response.foods[0].nf_calories,
                        cholesterol: response.foods[0].nf_cholesterol,
                        fiber: response.foods[0].nf_dietary_fiber,
                        potassium: response.foods[0].nf_potassium,
                        protein: response.foods[0].nf_protein,
                        saturatedfat: response.foods[0].nf_saturated_fat,
                        sodium: response.foods[0].nf_sodium,
                        sugars: response.foods[0].nf_sugars,
                        carbohydrates: response.foods[0].nf_total_carbohydrate,
                        totalfat: response.foods[0].nf_total_fat
                    });
                    //console.log("servings " + recipeDetailResponse.servings);
                    //console.log(response.foods[0].nf_calories);

                    allRecipeDetail.push({
                        id: recipeDetailResponse.id,
                        image: recipeDetailResponse.image,
                        title: recipeDetailResponse.title,
                        sourceUrl: recipeDetailResponse.sourceUrl,
                        servings: recipeDetailResponse.servings,
                        instructions: recipeDetailResponse.instructions,
                        ingredients: ingredientDetails,
                        nutrition: nutritionalDetails
                    });

                    //using recipeCounter var, populate 5 recipe panels
                    recipeName = "#recipe" + recipeCounter + "name";
                    recipeImage = "#recipe" + recipeCounter + "image";                        
                    recipeCalories = "#recipe" + recipeCounter + "calories";   

                    $(recipeName).text(allRecipeDetail[recipeCounter].title);
                    $(recipeImage).attr("src",allRecipeDetail[recipeCounter].image);
                    $(recipeCalories).text(allRecipeDetail[recipeCounter].nutrition[0].calories); 

                    //populates main panel with first recipe
                    ////////////// if (recipeCounter = 0) { - issues with the counter
                    $("#recipeName").text(allRecipeDetail[0].title);
                    $("#recipeImage").attr("src",allRecipeDetail[0].image);
                    $("#recipeCalories").text(allRecipeDetail[0].nutrition[0].calories); 
                    $("#recipeCarbs").text(allRecipeDetail[0].nutrition[0].carbohydrates + "g");   
                    $("#recipeFat").text(allRecipeDetail[0].nutrition[0].totalfat + "g");  
                    $("#recipeProtein").text(allRecipeDetail[0].nutrition[0].protein + "g");                                                                          
                    ////////////// }                    

                    recipeCounter++;    
                });



            });

            // console.log(allRecipeDetail);
            // console.log(allRecipeDetail[i].id);
        }
        // console.log(allRecipeDetail);
        //window.localStorage.setItem('allrecipedetail2', JSON.stringify(allRecipeDetail));        

    }

    // typeahead
    //https://github.com/twitter/typeahead.js
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    var meats = ['Beef', 'Chicken', 'Pork', 'Sausage', 'Fish', 'Tuna',
        'Hamburger', 'Lamb', 'Turkey', 'Veal', 'Bacon', 'Duck',
        'Ham', 'Anchovy', 'Venison', 'Liver', 'Salmon', 'Grouper', 'Tilapia', 'Catfish',
        'Snapper', 'Halibut'
    ];

    var fruits = ['Apple', 'Orange', 'Strawberry', 'Lemon', 'Grape', 'Blueberry',
        'Banana', 'Pomegranate', 'Pineapple', 'Kiwi', 'Raspberry', 'Lime', 'Grapefruit',
        'Mango', 'Peach'
    ];

    var vegetables = ['Tomato', 'Potato', 'Avocado', 'Onion',
        'Broccoli', 'Lettuce', 'Tomato Sauce', 'Whole Tomatoes',
        'Green Pepper', 'Red Pepper', 'Yellow Pepper', 'Celery', 'Asparagus',
        'Carrot', 'Spinach', 'Cucumber', 'Kale', 'Garlic', 'Cauliflower',
        'Brussels Sprout', 'Turnip', 'Parsnip', 'Radish', 'Okra', 'Pickle',
        'Shallot'
    ];

    var spices = ['Oregano', 'Parsley', 'Thyme', 'Black Pepper',
        'Salt', 'Ginger', 'Cumin', 'Nutmeg', 'Coriander', 'Turmeric', 'Saffron',
        'Fennel', 'Dill', 'Anise', 'Basil', 'Rosemary', 'Chives', 'Vanilla', 'Cinnamon'
    ];

    var dairy = ['Milk', 'Sour Cream', 'Cream Cheese', 'Chocolate',
        'American Cheese', 'Cheddar Cheese', 'Cheese', 'Butter', 'Yogurt',
        'Heavy Cream', 'Whipping Cream', 'Eggs', 'Parmesan Cheese', 'Mozzarella Cheese',

    ];

    var other = ['Bread Crumbs', 'Bread', 'Rice', 'Brown Rice', 'White Rice', 'Coffee',
        'Peanuts', 'Pinenuts', 'Cashews', 'Walnuts', 'Pecans', 'Sugar', 'Light Brown Sugar',
        'Dark Brown Sugar', 'Honey', 'Yeast', 'Flour', 'Baking Powder', 'Baking Soda', 'Molasses',
        'Pistachio', 'Almond', 'Coconut', 'Ketchup', 'Mayonnaise', 'Olive Oil', 'Vegetable Oil',
        'Mustard', 'Vinegar', 'Basalmic Vinegar', 'Pasta', 'Chicken Stock', 'Beef Stock', 'Vegetable Stock',
        'Maple Syrup'
    ];


    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        // minLength: 1
        minLength: 2
    }, {
        name: 'meats',
        source: substringMatcher(meats)
    }, {
        name: 'fruits',
        source: substringMatcher(fruits)
    }, {
        name: 'vegetables',
        source: substringMatcher(vegetables)
    }, {
        name: 'spices',
        source: substringMatcher(spices)
    }, {
        name: 'dairy',
        source: substringMatcher(dairy)
    }, {
        name: 'other',
        source: substringMatcher(other)
    });

    //when in typeahead input, keydown processes
    $('.typeahead').on('keydown', function(e) {
        if (e.keyCode == 13) {            
            $("#searchBtn").click();
        }
    });

    //clicking on the search button adds an item to the list
    $("#searchBtn").on("click", function() {
        event.preventDefault();
        addNewListItem();
    });

    function addNewListItem () {        
        var enteredValue = $("#ingredientsInput").val().trim();        
        var newLi = $("<li>").text(enteredValue);
        var newSpan = $("<span>").text("x");
        newSpan.attr("class", "removeIngredient");
        newLi.append(newSpan);
        $("#ingredientUL").append(newLi);
        $('.typeahead').typeahead('val', "");
    }

    $(document).on("click", ".removeIngredient",removeIngredientFromTheList);

    function removeIngredientFromTheList() {
            this.parentElement.style.display = 'none';
    }    

    //clicking on one of the 5 recipe divs puts data in the main div from the main object
    $(".recipediv").on("click", function(e) {
        var id = $(this).attr('id').slice(-1);
        $("#recipeName").text(allRecipeDetail[id].title);
        $("#recipeImage").attr("src",allRecipeDetail[id].image);
        $("#recipeCalories").text(allRecipeDetail[id].nutrition[0].calories); 
        $("#recipeCarbs").text(allRecipeDetail[id].nutrition[0].carbohydrates + "g");   
        $("#recipeFat").text(allRecipeDetail[id].nutrition[0].totalfat + "g");  
        $("#recipeProtein").text(allRecipeDetail[id].nutrition[0].protein + "g");  
    });    


    //end doc ready    
});