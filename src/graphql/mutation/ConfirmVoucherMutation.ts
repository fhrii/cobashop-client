import { gql } from '@apollo/client';

const ConfirmVoucherMutation = gql`
  mutation ConfirmVoucher($id: ID!, $voucher: String!, $message: String) {
    confirmVoucher(id: $id, voucher: $voucher, message: $message) {
      id
      productName
      productType
      itemValue
      itemPrice
      primaryFormName
      secondaryFormName
      primaryFormValue
      secondaryFormValue
      proofOfPayment
      voucher
      message
      pending
      success
    }
  }
`;

export default ConfirmVoucherMutation;
