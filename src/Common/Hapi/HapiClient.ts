import { GraphQLClient } from 'graphql-request';
import { search } from './Typings/search';
import { HapiQueries } from './HapiQueries';
import { categorize } from './Typings/categorize';
import { ISettings } from '../../Settings';
import { print } from 'graphql/language/printer';

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

    public async search(searchQuery?: string, categories?: any[], queryType?: string, sortBy?: string, skip?: number, take?: number, dateFrom?: Date, dateTo?: Date): Promise<search> {
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
            return data;
          } catch (error) {
            console.error(JSON.stringify(error, undefined, 2));
            return null;
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
}