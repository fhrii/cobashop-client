/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole, ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_transactions {
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

export interface Login_login_notifications {
  __typename: "Notification";
  id: string;
  name: string;
  description: string;
  read: boolean;
}

export interface Login_login {
  __typename: "User";
  id: string;
  username: string;
  role: UserRole;
  image: string;
  blocked: boolean;
  transactions: Login_login_transactions[];
  notifications: Login_login_notifications[];
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  username: string;
  password: string;
}
