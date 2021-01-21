/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType, EditProductItem } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddProduct
// ====================================================

export interface AddProduct_addProduct_items {
  __typename: "Item";
  id: string;
  value: string;
  price: number;
  deleted: boolean;
}

export interface AddProduct_addProduct {
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
  items: AddProduct_addProduct_items[];
  deleted: boolean;
}

export interface AddProduct {
  addProduct: AddProduct_addProduct;
}

export interface AddProductVariables {
  name: string;
  type: ProductType;
  primaryFormName?: string | null;
  secondaryFormName?: string | null;
  image: string;
  banner: string;
  description: string;
  helperImage?: string | null;
  helperText?: string | null;
  items: EditProductItem[];
}
