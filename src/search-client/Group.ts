import Category from './Category';

interface Group {
    categories: Category[];
    displayName: string;
    expanded: boolean;
    name: string;
}

export default Group;