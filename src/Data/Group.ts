import { Category } from './Category';

/**
 * The Group-node is the top-level node for each of the category "trees".
 * It contains information about this group-node as well as a list of child-categories.
 */
export interface Group {
    /**
     * Sequential running number per group
     */
    $id?: number;
    /**
     * The child categories for this group.
     */
    categories: Category[];
    /**
     * The displayName is what is expected to be presented as the group-name for the end-user.
     */
    displayName: string;
    /**
     * Indicates whether or not this group-node should be expanded or not.
     */
    expanded: boolean;
    /**
     * The internal name identifier for this group-node.
     */
    name: string;
}
