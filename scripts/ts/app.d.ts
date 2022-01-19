type Recipe = {
    id: number;
    name: string;
    servings: number;
    ingredients: {
        name: string;
        quantity?: number;
        unit?: string;
        quantite?: number;
    }[];
    time: number;
    description: string;
    appliance: string;
    ustensils: string[];
};
