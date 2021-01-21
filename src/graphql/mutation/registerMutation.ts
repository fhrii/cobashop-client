import { gql } from '@apollo/client';

const RegisterMutation = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
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
      notifications {
        id
        name
        description
        read
      }
    }
  }
`;

export default RegisterMutation;
