type ListElement = {
    [key: string]: HTMLElement;
};

type ListElements = {
    [key: string]: NodeListOf<HTMLElement>;
};

type ListInputs = {
    main: HTMLElement;
    componants: NodeListOf<HTMLElement>;
};

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

// class EventButton {
//     public add(element:HTMLElement, type:string, func: Function);
// }