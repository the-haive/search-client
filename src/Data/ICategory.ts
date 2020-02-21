/**
 * A Category-node is located somewhere in the tree below a Group-node.
 * It contains information about this category-node as well as a list of child-categories.
 */
export interface ICategory {
    /**
     * Sequential running number per category
     */
    $id?: number;
    /**
     * This is the hierarchical "full path" for this category, top-down.
     */
    categoryName?: string[];
    /**
     * The child categories for this category.
     */
    children?: ICategory[];
    /**
     * The number of matches for this category.
     */
    count?: number;
    /**
     * The displayName is what is expected to be presented as the category-name for the end-user.
     */
    displayName?: string;
    /**
     * Indicates whether or not this category-node should be expanded or not.
     */
    expanded?: boolean;
    /**
     * The internal name identifier for this category-node.
     */
    name?: string;
}
