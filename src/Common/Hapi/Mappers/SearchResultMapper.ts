import { IMatches } from '../../../Data/IMatches';
import { IMetaData } from '../../../Data/IMetaData';
import { search, search_index_items_results_categories, search_index_items_results_metadata } from '../Typings/search';

export class SearchResultMapper {
     public static map(indexId: number, data: search): IMatches {
        let matches = {
            id: 1,
            bestBets: new Array<any>(),
            didYouMeanList: new Array<any>(),
            estimatedMatchCount: data.index.items.hits,
            expandedQuery: "",
            nextPageRef: 1,
            searchMatches: new Array<any>(),
            statusCode: 0,
            errorMessage: "",
        };
     
        data.index.items.results.forEach((item) => {
        {                                        
            matches.searchMatches.push({
                id: 0,
                abstract: item.content,
                categories: this.mapCategories(item.categories),
                matchedPermissions: new Array<string>(),
                content: item.content.split(/<\/?span>/),
                date: item.date,
                extracts: item.extracts.split(/<\/?span>/),
                instanceId: indexId,
                internalId: item.internalId,
                isTrueMatch: true,
                itemId: item.id,
                metaList: this.mapMetadata(item.metadata),
                parentInternalId: item.parentIds && item.parentIds[0] ? item.parentIds[0] : -1,
                parentLevel: item.parentLevel,
                relevance: item.relevance,
                sourceName: "Hapi",
                title: item.title,
                url: item.url
                });
            }});

        return matches;
     }

    private static mapCategories(categories: search_index_items_results_categories[]): string[] {
        let result = new Array<string>();   
        if (categories) {
            categories.forEach((c) => {
                result.push(c.values.join("|"));                
            });
        }

        return result;
     }

    private static mapMetadata(metadata: search_index_items_results_metadata[]): IMetaData[] {
        let result = new Array<IMetaData>();   
        if (metadata) {
            metadata.forEach((m) => {
                result.push({
                    key: m.name,
                    value: m.value
                });
            });
        }

        return result;
     }
}