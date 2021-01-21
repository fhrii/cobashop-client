import { gql } from '@apollo/client';

const CancelTransactionMutation = gql`
  mutation CancelTransaction($id: ID!, $message: String) {
    cancelTransaction(id: $id, message: $message) {
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

export default CancelTransactionMutation;
