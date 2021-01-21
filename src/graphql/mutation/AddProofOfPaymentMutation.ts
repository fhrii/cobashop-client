import { gql } from '@apollo/client';

const AddProofOfPaymentMutation = gql`
  mutation AddProofOfPayment($id: ID!, $image: String!) {
    addProofOfPayment(id: $id, image: $image) {
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

export default AddProofOfPaymentMutation;
