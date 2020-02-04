import { ICategories } from '../../../Data/ICategories';
import { categorize } from '../Typings/categorize';
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
            isEstimatedCount: true,  
            matchCount: 0,
            extendedProperties: new Array<any>(),
            statusCode: 0,
            errorMessage: ""
        };

        let hierarchy = new Array<IHierarchy>();

        data.index.categories.forEach((category) => {
            {                                                  
                hierarchy.push(
                    {
                        name: category.name,
                        displayName: category.displayName,
                        categoryName: category.categoryName,
                        id: category.categoryName.join("|"),
                        parentId: category.categoryName.length > 2 ? category.categoryName.slice(0, category.categoryName.length - 1).join("|") : null,
                        groupName: category.groupName,
                        groupDisplayName: category.groupDisplayName,
                        count: category.count,
                        children: new Array<IHierarchy>()
                    }
                );  
            }
        });

        data.index.categories.forEach((category) => {
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