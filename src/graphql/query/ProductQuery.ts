import { gql } from '@apollo/client';

const ProductQuery = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      type
      primaryFormName
      secondaryFormName
      image
      banner
      description
      helperImage
      helperText
      items {
        id
        value
        price
        deleted
      }
      deleted
    }
  }
`;

export default ProductQuery;
