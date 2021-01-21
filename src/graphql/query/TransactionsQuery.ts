import { gql } from '@apollo/client';

const TransactionsQuery = gql`
  query Transactions {
    transcations {
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

export default TransactionsQuery;
