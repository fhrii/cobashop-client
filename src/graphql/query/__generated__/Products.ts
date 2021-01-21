/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Products
// ====================================================

export interface Products_products {
  __typename: "Product";
  id: string;
  name: string;
  type: ProductType;
  image: string;
}

export interface Products {
  products: Products_products[];
}
