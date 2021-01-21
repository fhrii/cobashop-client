/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: ConfirmVoucher
// ====================================================

export interface ConfirmVoucher_confirmVoucher {
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

export interface ConfirmVoucher {
  confirmVoucher: ConfirmVoucher_confirmVoucher;
}

export interface ConfirmVoucherVariables {
  id: string;
  voucher: string;
  message?: string | null;
}
