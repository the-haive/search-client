import { Category } from './Category';

export interface Group {
    categories: Category[];
    displayName: string;
    expanded: boolean;
    name: string;
}
