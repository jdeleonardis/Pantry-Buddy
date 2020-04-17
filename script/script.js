$(document).ready(function() {


    var allRecipeDetail = [];
    var spoonacularAPIKey = ""; //while developing, put your APIKey to spoonacular here
                                //https://rapidapi.com/spoonacular/api/recipe-food-nutrition
    
    //getRecipes();

    function getRecipes() {
        var allRecipeIDs = [];
        var ingredientList = "";
        //var numberOfRecipesReturned = 5; --hard coded to be 5

        //get list of ingredients
        $('#ulList li').each(function (i) {
            ingredientList += $(this).text() + ","            
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

        $.ajax(recipeListSettings).then(function (recipeListResponse) {

            for (i = 0; i < recipeListResponse.length; i++) {

                //add all of the recipes found
                allRecipeIDs.push(recipeListResponse[i].id);
            }

            getRecipeDetail(allRecipeIDs);
        });
    }

    function getRecipeDetail(allRecipeIDs) {
        var sourceUrl = "";
        
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

            $.ajax(recipeDetailSettings).then(function (recipeDetailResponse) {                
                //console.log(recipeDetailResponse);                
                var ingredientDetails = [];
                //loop through all of the extended ingredients and get some info to build
                for (j = 0; j < recipeDetailResponse.extendedIngredients.length; j++) {

                    ingredientDetails.push({ingredientName: recipeDetailResponse.extendedIngredients[j].name,
                                            ingredientAmount: recipeDetailResponse.extendedIngredients[j].amount,
                                            ingredientUnit: recipeDetailResponse.extendedIngredients[j].unit,
                                            ingredientInstruction: recipeDetailResponse.extendedIngredients[j].originalString,                            
                    });
                } 

                allRecipeDetail.push({id: recipeDetailResponse.id, image: recipeDetailResponse.image, title: recipeDetailResponse.title,
                                     sourceUrl: recipeDetailResponse.sourceUrl, servings: recipeDetailResponse.servings, 
                                     instructions: recipeDetailResponse.instructions, ingredients: ingredientDetails});
            });            
            
        }
        console.log(allRecipeDetail);
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
    
    //possible enter code - need a form?
    $('.typeahead').on('keydown', function(e) {
        if (e.keyCode == 13) {
            console.log($(this).val().trim());
            $('.typeahead').typeahead('val', "");
        //   var ta = $(this).data('typeahead');
        //   var val = ta.$menu.find('.active').data('value');
        //   console.log(ta);
        //   console.log(val);          
        //   if (!val)
        //     $('#your-form').submit();
        }
    }) ;

    var meats = ['Beef', 'Chicken', 'Pork', 'Sausage', 'Fish', 'Tuna',
    'Hamburger','Lamb','Turkey','Veal','Bacon','Duck',
    'Ham','Anchovy','Venison','Liver','Salmon','Grouper', 'Tilapia','Catfish',
    'Snapper','Halibut'
    ];

    var fruits = ['Apple', 'Orange', 'Strawberry','Lemon','Grape','Blueberry',
    'Banana','Pomegranate','Pineapple','Kiwi','Raspberry','Lime','Grapefruit',
    'Mango','Peach'
    ];      

    var vegetables = ['Tomato', 'Potato', 'Avocado', 'Onion',
    'Broccoli','Lettuce','Tomato Sauce', 'Whole Tomatoes',
    'Green Pepper','Red Pepper', 'Yellow Pepper','Celery','Asparagus',
    'Carrot', 'Spinach', 'Cucumber', 'Kale', 'Garlic', 'Cauliflower',
    'Brussels Sprout', 'Turnip', 'Parsnip', 'Radish', 'Okra','Pickle',
    'Shallot'
    ];          

    var spices = ['Oregano', 'Parsley', 'Thyme', 'Black Pepper',
    'Salt','Ginger','Cumin','Nutmeg','Coriander','Turmeric','Saffron',
    'Fennel','Dill','Anise','Basil','Rosemary','Chives','Vanilla','Cinnamon'
    ];          

    var dairy = ['Milk', 'Sour Cream', 'Cream Cheese', 'Chocolate',
    'American Cheese', 'Cheddar Cheese', 'Cheese','Butter', 'Yogurt',
    'Heavy Cream', 'Whipping Cream', 'Eggs', 'Parmesan Cheese', 'Mozzarella Cheese',

    ];              

    var other = ['Bread Crumbs','Bread','Rice','Brown Rice','White Rice','Coffee',
    'Peanuts','Pinenuts','Cashews','Walnuts','Pecans', 'Sugar', 'Light Brown Sugar',
    'Dark Brown Sugar', 'Honey', 'Yeast', 'Flour', 'Baking Powder', 'Baking Soda', 'Molasses',
    'Pistachio', 'Almond', 'Coconut', 'Ketchup', 'Mayonnaise','Olive Oil', 'Vegetable Oil',
    'Mustard', 'Vinegar', 'Basalmic Vinegar', 'Pasta','Chicken Stock','Beef Stock','Vegetable Stock',
    'Maple Syrup'
    ]; 
                               
 
    $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            // minLength: 1
            minLength: 2
        },
        {
            name: 'meats',
            source: substringMatcher(meats)
        },
        {
            name: 'fruits',           
            source: substringMatcher(fruits)
        },
        {
            name: 'vegetables',
            source: substringMatcher(vegetables)
        },
        {
            name: 'spices',
            source: substringMatcher(spices)
        },                       
        {
            name: 'dairy',
            source: substringMatcher(dairy)
        },
        {
            name: 'other',
            source: substringMatcher(other)
        }                                       
    ); 


//end doc ready    
});