/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Type of product
 */
export enum ProductType {
  CASH = "CASH",
  VOUCHER = "VOUCHER",
}

/**
 * Role of registered accounts
 */
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface EditProductItem {
  value: string;
  price: number;
  id?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
