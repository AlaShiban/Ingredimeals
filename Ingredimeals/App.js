var AppController = (function () {
    function AppController($scope) {
        this._$scope = $scope;
        this._$scope.vm = this;

        this._$scope.UpdateStuff = this.UpdateStuff;
    }
    AppController.prototype.UpdateStuff = function () {
        var recipes;
        recipes = db.GetRecipesForIngredients();
        this._$scope.recipesFound = recipes;
    };
    return AppController;
})();

var RecipesDB = (function () {
    function RecipesDB(jsonString) {
        this._recipeDict = {};
        this._recipeJson = JSON.parse(jsonString);

        var recipes = this._recipeJson;

        for (var i in recipes) {
            var recipe = recipes[i];
            var ing = recipe.ingredients;
            var ingLines = ing.split('\n');

            for (var line in ingLines) {
                var individualIng = ingLines[line].split(' ');

                for (var singleIng in individualIng) {
                    var curIng = individualIng[singleIng];

                    curIng = curIng.toLowerCase();
                    curIng = curIng.replace(/[^a-z\.]+/g, '');

                    if (!(curIng in this._recipeDict)) {
                        this._recipeDict[curIng] = [];
                    }

                    this._recipeDict[curIng].push(recipe);
                }
            }
        }
    }
    RecipesDB.prototype.GetRecipesForIngredients = function () {
        var ings = $('.ingredientsSearch').val();
        var allIng = ings.split(' ');

        var allIds = [];

        for (var ingKey in allIng) {
            var ingRecipes = this._recipeDict[allIng[ingKey]];

            allIds.push(_.map(ingRecipes, function (singleIng) {
                return { id: singleIng._id.$oid, recipe: singleIng };
            }));
        }

        this._recipeDict[allIng[0]];
        var allRecipes = [];

        var inters = _.intersection(_.pluck(allIds[0], 'id'), _.pluck(allIds[1], 'id'));

        for (var curId in inters) {
            var curRecipe = _.where(allIds[0], { id: inters[curId] });
            allRecipes.push(curRecipe[0].recipe);
        }

        return allRecipes;
    };
    return RecipesDB;
})();
