import { gql } from '@apollo/client';

const BuyItemMutation = gql`
  mutation BuyItem(
    $id: ID!
    $primaryFormValue: String
    $secondaryFormValue: String
  ) {
    buyItem(
      id: $id
      primaryFormValue: $primaryFormValue
      secondaryFormValue: $secondaryFormValue
    ) {
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

export default BuyItemMutation;
