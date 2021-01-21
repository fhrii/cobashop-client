/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType, EditProductItem } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditProduct
// ====================================================

export interface EditProduct_editProduct_items {
  __typename: "Item";
  id: string;
  value: string;
  price: number;
  deleted: boolean;
}

export interface EditProduct_editProduct {
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
  items: EditProduct_editProduct_items[];
  deleted: boolean;
}

export interface EditProduct {
  editProduct: EditProduct_editProduct;
}

export interface EditProductVariables {
  id: string;
  name?: string | null;
  type?: ProductType | null;
  primaryFormName?: string | null;
  secondaryFormName?: string | null;
  image?: string | null;
  banner?: string | null;
  description?: string | null;
  helperImage?: string | null;
  helperText?: string | null;
  items?: EditProductItem[] | null;
  deleted?: boolean | null;
}
