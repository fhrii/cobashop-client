import { gql } from '@apollo/client';

const LoginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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

export default LoginMutation;
