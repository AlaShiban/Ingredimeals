/// <reference path="Scripts/typings/underscore/underscore.d.ts" />

declare var db: RecipesDB;
declare var $;
class AppController {
    _$scope: any;

    constructor($scope) {
        this._$scope = $scope;
        this._$scope.vm = this;

        this._$scope.UpdateStuff = this.UpdateStuff;

    }

    UpdateStuff() {
        var recipes;
        recipes = db.GetRecipesForIngredients();
        this._$scope.recipesFound = recipes;
    }

}

class RecipesDB {

    _recipeJson: any[];
    _recipeDict: { [index: string]: any[] } = {};

    constructor(jsonString: string) {

        this._recipeJson = JSON.parse(jsonString);

        var recipes = this._recipeJson;

        for (var i in recipes) {

            var recipe = recipes[i];
            var ing: string = recipe.ingredients;
            var ingLines  = ing.split('\n');

            for (var line in ingLines) {
                var individualIng = ingLines[line].split(' ');

                for (var singleIng in individualIng) {
                    var curIng: string = individualIng[singleIng];

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

    GetRecipesForIngredients(): any[] {

        var ings: string = $('.ingredientsSearch').val();
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
    }



}