interface Category {
    categoryName: string[];
    children: Category[];
    count: number;
    displayName: string;
    expanded: boolean;
    name: string;
}

export default Category;