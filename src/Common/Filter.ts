import { Category } from '../Data';

/**
 * The Filter interface defines what information is held for a chosen category as a filter.
 */
export class Filter {
    /**
     * Creates a Filter instance, holding the displayName and a copy of the original Category (excluding category.children).
     * 
     * @param displayName Holds an array of all displayNames for the path to this category.
     * @param category A copy/reference to the actual category selected (from what was received in the categorize call).
     */
    constructor(public displayName: string[], public category: Category) {
        this.displayName = displayName;
        this.category = {...category};
        this.category.children = [];
    }
}
