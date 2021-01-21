/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Product
// ====================================================

export interface Product_product_items {
  __typename: "Item";
  id: string;
  value: string;
  price: number;
  deleted: boolean;
}

export interface Product_product {
  __typename: "Product";
  id: string;
  name: string;
  type: ProductType;
  primaryFormName: string | null;
  secondaryFormName: string | null;
  image: string;
  banner: string;
  description: string;
  helperImage: string | null;
  helperText: string | null;
  items: Product_product_items[];
  deleted: boolean;
}

export interface Product {
  product: Product_product;
}

export interface ProductVariables {
  id: string;
}
