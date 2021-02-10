import gql from 'graphql-tag';

const MeQuery = gql`
  query Me {
    me {
      id
      username
      role
      image
      blocked
      transactions {
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
  }
`;

export default MeQuery;
