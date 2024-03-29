import { RecipeController } from './controller/RecipeController';
import { CollectionController } from './controller/CollectionController';
import { SearchController } from './controller/SearchController';
import { TagController } from './controller/TagController';
import { DeveloperController } from './controller/DeveloperController';

export const Routes = [
    {
        path: "/recipes",
        method: "get",
        controller: RecipeController,
        action: "all"
    },
    {
        path: "/recipes/recent",
        method: "get",
        controller: RecipeController,
        action: "recent"
    },
    {
        path: "/recipes/:id",
        method: "get",
        controller: RecipeController,
        action: "one"
    },
    {
        path: "/recipes",
        method: "post",
        controller: RecipeController,
        action: "save"
    },
    {
        path: "/recipes/:id",
        method: "put",
        controller: RecipeController,
        action: "update"
    },
    {
        path: "/recipes/upload",
        method: "post",
        controller: RecipeController,
        action: "upload"
    },
    {
        path: "/recipes/:id",
        method: "delete",
        controller: RecipeController,
        action: "remove"
    },
    {
        path: "/collections",
        method: "get",
        controller: CollectionController,
        action: "all"
    },
    {
        path: "/collections/:id",
        method: "get",
        controller: CollectionController,
        action: "one"
    },
    {
        path: "/collections",
        method: "post",
        controller: CollectionController,
        action: "save"
    },
    {
        path: "/collections/:id",
        method: "patch",
        controller: CollectionController,
        action: "update"
    },
    {
        path: "/collections/:collection_id/recipes/:recipe_id",
        method: "post",
        controller: CollectionController,
        action: "addRecipe"
    },
    {
        path: "/collections/:collection_id/recipes/:recipe_id",
        method: "delete",
        controller: CollectionController,
        action: "removeRecipe"
    },
    {
        path: "/collections/:id",
        method: "delete",
        controller: CollectionController,
        action: "remove"
    },
    {
        path: "/search",
        method: "post",
        controller: SearchController,
        action: "search"
    },
    {
        path: "/tags/available",
        method: "get",
        controller: TagController,
        action: "available"
    },
    {
        path: "/developer/export",
        method: "get",
        controller: DeveloperController,
        action: "export"
    },
    {
        path: "/developer/api-documentation",
        method: "get",
        controller: DeveloperController,
        action: "apiDocumentation"
    }
];