/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole, ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_transactions {
  __typename: "Transaction";
  id: string;
  productName: string;
  productType: ProductType;
  itemValue: string;
  itemPrice: number;
  primaryFormName: string | null;
  secondaryFormName: string | null;
  primaryFormValue: string | null;
  secondaryFormValue: string | null;
  proofOfPayment: string | null;
  voucher: string | null;
  message: string | null;
  pending: boolean;
  success: boolean;
}

export interface Register_register {
  __typename: "User";
  id: string;
  username: string;
  role: UserRole;
  image: string;
  blocked: boolean;
  transactions: Register_register_transactions[];
}

export interface Register {
  register: Register_register;
}

export interface RegisterVariables {
  username: string;
  password: string;
}
