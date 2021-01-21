import { gql } from '@apollo/client';

const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`;

export default LogoutMutation;
