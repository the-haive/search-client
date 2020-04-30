import { ICategories } from '../../../Data/ICategories';
import { categorize, categorize_index_categories_results } from '../Typings/categorize';
import { IGroup } from '../../../Data/IGroup';

interface IHierarchy {
    name: string;
    displayName: string;
    categoryName: string[];
    id: string;
    parentId: string;
    groupName: string;
    groupDisplayName: string;
    count: number;
    children: IHierarchy[];
}

export class CategorizeResultMapper {
     public static map(indexId: number, data: categorize): ICategories {
        let categories = {
            groups: new Array<IGroup>(),
            isEstimatedCount: data.index.categories.isEstimatedCount,  
            matchCount: data.index.categories.matchCount,
            extendedProperties: new Array<any>(),
            statusCode: data.index.categories.statusCode,
            errorMessage: data.index.categories.errorMessage
        };

        let hierarchy = new Array<IHierarchy>();

        data.index.categories.results.forEach((category: categorize_index_categories_results) => {
            {              
                hierarchy.push(
                    {
                        name: category.categoryName,
                        displayName: category.categoryDisplayName,
                        categoryName: category.path,
                        id: category.path.join("|"),
                        parentId: category.path.length > 2 ? category.path.slice(0, category.path.length - 1).join("|") : null,
                        groupName: category.groupName,
                        groupDisplayName: category.groupDisplayName,
                        count: category.itemsCount,
                        children: new Array<IHierarchy>()
                    }
                );            
            }
        });

        data.index.categories.results.forEach((category: categorize_index_categories_results) => {
            let group = categories.groups.find((g) => 
                g.name === category.groupName
            );

            if (!group) {
                categories.groups.push({
                    categories: [],
                    displayName: category.groupDisplayName,
                    expanded: true,
                    name: category.groupName
                });
            }
        });

        let categoriesHierarchy = CategorizeResultMapper.buildHierarchy(hierarchy, "id", "parentId", "children");

        categoriesHierarchy.forEach((category) => {
            let group = categories.groups.find((g) => 
            g.name === category.groupName);

            if (group) {
                group.categories.push(category);
            }
        });
    
        return categories;
     }

     private static buildHierarchy(list: IHierarchy[], idAttr: string, parentAttr: string, childrenAttr: string) {
        let treeList = new Array<any>();
        let lookup = {};
        list.forEach(obj => {
            lookup[obj[idAttr]] = obj;
            obj[childrenAttr] = [];
        });
        list.forEach((obj) => {
            if (obj[parentAttr] != null) {
                lookup[obj[parentAttr]][childrenAttr].push(obj);
            } else {
                treeList.push(obj);
            }
        });
        return treeList;
    }
}