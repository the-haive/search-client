/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: autocomplete
// ====================================================

export interface autocomplete_index {
  __typename: "IndexQuery";
  autocomplete: (string | null)[] | null;
}

export interface autocomplete {
  index: autocomplete_index | null;
}

export interface autocompleteVariables {
  indexId: number;
  searchQuery: string;
  maxSuggestions: number;
  minQueryLength: number;
}
