import { gql } from '@apollo/client';

const ConfirmCashMutation = gql`
  mutation ConfirmCash($id: ID!, $message: String) {
    confirmCash(id: $id, message: $message) {
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

export default ConfirmCashMutation;
