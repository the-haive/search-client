import { IFindSettings } from '../../Find/FindSettings';
import { GraphQLClient } from 'graphql-request';
import { Index } from './Typings/Typings';

export class HapiClient {

    private client: GraphQLClient;

    private indexId: number;

    private readonly SEARCH_QUERY = `
    query search($indexId: Int!, $filterParameters: FilterParametersInput!) {      
        index
        {
          items
          (      
            indexIds: [$indexId],      
            filter: $filterParameters                 
          )
          {
            hits,
            results
            {
              id
              parentIds
              url
              title 
              content
              extracts       
              relevance			
              date
              metadata
              {
                name
                value
              }
              categories
              {
                values
              }
            }     
          }
        } 
      }
        `;

    constructor(settings: IFindSettings) {
        this.indexId = settings.hapiIndexId;

        this.client = new GraphQLClient(settings.baseUrl, {
            headers: {
                ApiKey: settings.hapiApiKey,
            },
        });
    }

    public async search(searchQuery?: string, queryType?: string, sortBy?: string, skip?: number, take?: number, dateFrom?: Date, dateTo?: Date): Promise<Index> {
        const variables = {
            indexId: this.indexId,
            filterParameters: {  
                ...(searchQuery && { searchQuery }),
                ...(queryType && { queryType }),
                ...(sortBy && { sortBy }),
                ...(skip && { skip }),
                ...(take && { take }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo })           
              }    
        };

        try {
            const data = await this.client.request<Index>(this.SEARCH_QUERY, variables);
            return data;
          } catch (error) {
            console.error(JSON.stringify(error, undefined, 2));
            return null;
          }  
    }
}