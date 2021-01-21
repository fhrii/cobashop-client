import { gql } from '@apollo/client';

const ProductsQuery = gql`
  query Products {
    products {
      id
      name
      type
      image
    }
  }
`;

export default ProductsQuery;
