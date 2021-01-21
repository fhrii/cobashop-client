/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddProofOfPayment
// ====================================================

export interface AddProofOfPayment_addProofOfPayment {
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

export interface AddProofOfPayment {
  addProofOfPayment: AddProofOfPayment_addProofOfPayment;
}

export interface AddProofOfPaymentVariables {
  id: string;
  image: string;
}
