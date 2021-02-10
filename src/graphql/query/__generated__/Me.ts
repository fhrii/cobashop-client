/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole, ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_transactions {
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

export interface Me_me {
  __typename: "User";
  id: string;
  username: string;
  role: UserRole;
  image: string;
  blocked: boolean;
  transactions: Me_me_transactions[];
}

export interface Me {
  me: Me_me;
}
