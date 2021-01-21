import { gql } from '@apollo/client';

const MyTransactionsQuery = gql`
  query MyTransactions {
    myTransactions {
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

export default MyTransactionsQuery;
