import { RecipeController } from './controller/RecipeController';
import { CollectionController } from './controller/CollectionController';
import { SearchController } from './controller/SearchController';

export const Routes = [
    {
        path: "/recipes",
        method: "get",
        controller: RecipeController,
        action: "all"
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
        method: "put",
        controller: CollectionController,
        action: "update"
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
    }
];