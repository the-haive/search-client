import { gql } from 'apollo-boost';

export class HapiQueries {
    
    public static readonly SEARCH_QUERY = gql`
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

    public static readonly CATEGORIZE_QUERY = gql`
    query categorize($indexId: Int!, $filterParameters: FilterParametersInput!) {      
      index
      {
        categories
        (      
          indexIds: [$indexId],      
          filter: $filterParameters       
        )
        {
          name
          displayName
          categoryName
          groupName
          groupDisplayName
          count          
        }
      } 
    }
    `;   
}