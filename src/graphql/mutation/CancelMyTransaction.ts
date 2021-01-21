import { gql } from '@apollo/client';

const CancelMyTransactionMutation = gql`
  mutation CancelMyTransaction($id: ID!) {
    cancelMyTransaction(id: $id) {
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

export default CancelMyTransactionMutation;
