import { GraphQLClient } from 'graphql-request';
import { search } from './Typings/search';
import { HapiQueries } from './HapiQueries';
import { categorize } from './Typings/categorize';
import { ISettings } from '../../Settings';
import { print } from 'graphql/language/printer';
import { autocomplete } from './Typings/autocomplete';
import { SearchResultMapper } from './Mappers/SearchResultMapper';
import { IMatches } from '../../Data/IMatches';
import { IMatchItem } from '../../Data';

export class HapiClient {

    private client: GraphQLClient;

    private indexId: number;

    constructor(settings: ISettings) {
        this.indexId = settings.hapiIndexId;

        this.client = new GraphQLClient(settings.baseUrl, {
            headers: {
                ApiKey: settings.hapiApiKey,
            },
        });
    }

    public async search(searchQuery?: string, categories?: any[], queryType?: string, sortBy?: string, skip?: number, take?: number, dateFrom?: Date, dateTo?: Date): Promise<IMatches> {
        const variables = {
            indexId: this.indexId,
            filterParameters: {  
                ...(searchQuery && { searchQuery }),
                ...(queryType && { queryType }),
                ...(sortBy && { sortBy }),
                ...(skip && { skip }),
                ...(take && { take }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
                ...(categories && { categories })            
              }    
        };
      
        try {
          const data = await this.client.request<search>(print(HapiQueries.SEARCH_QUERY), variables);
          return SearchResultMapper.map(this.indexId, data);      
        } catch (error) {
          if (error.response && error.response.errors) {
            let errorMessage = "";
            error.response.errors.forEach((e: { message: string; }) => {
                errorMessage += e.message + "|";
            });  
            
            return {
              bestBets: [],
              didYouMeanList: [],
              statusCode: 1,
              errorMessage,
              estimatedMatchCount: 0,
              expandedQuery: "",
              nextPageRef: 0,
              searchMatches: [{} as IMatchItem]
            };
          }
        }           
    }

    public async categorize(searchQuery?: string, categories?: any[], queryType?: string, sortBy?: string, skip?: number, take?: number, dateFrom?: Date, dateTo?: Date): Promise<categorize> {
      const variables = {
          indexId: this.indexId,
          filterParameters: {  
              ...(searchQuery && { searchQuery }),
              ...(queryType && { queryType }),
              ...(sortBy && { sortBy }),
              ...(skip && { skip }),
              ...(take && { take }),
              ...(dateFrom && { dateFrom }),
              ...(dateTo && { dateTo }),
              ...(categories && { categories })            
            }    
      };

      try {
          const data = await this.client.request<categorize>(print(HapiQueries.CATEGORIZE_QUERY), variables);
          return data;
        } catch (error) {
          console.error(JSON.stringify(error, undefined, 2));
          return null;
        }  
    }

    public async autocomplete(searchQuery?: string, maxSuggestions?: number, minQueryLength?: number): Promise<autocomplete> {
      const variables = {
          indexId: this.indexId,          
          searchQuery,
          maxSuggestions,
          minQueryLength         
      };

      try {
          const data = await this.client.request<autocomplete>(print(HapiQueries.AUTOCOMPLETE_QUERY), variables);
          return data;
        } catch (error) {
          console.error(JSON.stringify(error, undefined, 2));
          return null;
        }  
    }
}