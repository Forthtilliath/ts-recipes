type Recipe = {
    id: number;
    name: string;
    servings: number;
    ingredients: {
        name: string;
        quantity?: number;
        unit?: string;
    }[];
    time: number;
    description: string;
    appliance: string;
    ustensils: string[];
};

type List = {
    [key: string]: string[];
};

type RecipeItem = {
    ingredients: string[];
    appliance: string;
    ustensils: string[];
};
