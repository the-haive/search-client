/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FilterParametersInput } from "./Typyings";

// ====================================================
// GraphQL query operation: categorize
// ====================================================

export interface categorize_index_categories_results {
  __typename: "CategoryResult";
  categoryName: string | null;
  categoryDisplayName: string | null;
  groupName: string | null;
  groupDisplayName: string | null;
  path: (string | null)[] | null;
  itemsCount: number;
}

export interface categorize_index_categories {
  __typename: "CategoriesResult";
  results: (categorize_index_categories_results | null)[] | null;
  errorMessage: string | null;
  isEstimatedCount: boolean;
  matchCount: number;
  statusCode: number;
}

export interface categorize_index {
  __typename: "IndexQuery";
  categories: categorize_index_categories | null;
}

export interface categorize {
  index: categorize_index | null;
}

export interface categorizeVariables {
  indexId: number;
  filterParameters: FilterParametersInput;
}
