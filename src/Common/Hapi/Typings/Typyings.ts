/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum HapiQueryType {
  BOOLEAN = "BOOLEAN",
  MATCHALL = "MATCHALL",
  MATCHANY = "MATCHANY",
}

export enum HapiSortBy {
  DATE = "DATE",
  RELEVANCE = "RELEVANCE",
}

export interface CategoriesInput {
  values?: (string | null)[] | null;
}

export interface FilterParametersInput {
  categories?: (CategoriesInput | null)[] | null;
  dateFrom?: any | null;
  dateTo?: any | null;
  metadata?: (MetadataInput | null)[] | null;
  queryType?: HapiQueryType | null;
  searchQuery?: string | null;
  skip?: number | null;
  sortBy?: HapiSortBy | null;
  take?: number | null;
}

export interface MetadataInput {
  name?: string | null;
  value?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
