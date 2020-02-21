import { ICategory } from "../Data";

export interface IFilter {
    displayName?: string[];
    category: ICategory;
    hidden?: boolean;
}
/**
 * The Filter interface defines what information is held for a chosen category as a filter.
 */
export class Filter implements IFilter {
    public displayName?: string[];
    public category: ICategory;
    public hidden?: boolean;
    /**
     * Creates a Filter instance, holding the displayName and a copy of the original Category (excluding category.children).
     *
     * @param displayName Holds an array of all displayNames for the path to this category.
     * @param category A copy/reference to the actual category selected (from what was received in the categorize call).
     * @param hidden Whether or not the filter should be included in the category tree.
     */
    constructor(displayName: string[], category: ICategory, hidden: boolean = false) {
        this.displayName = displayName;
        this.category = category;
        this.hidden = hidden;
    }
}
