import { gql } from '@apollo/client';

const AddProductMutation = gql`
  mutation AddProduct(
    $name: String!
    $type: ProductType!
    $primaryFormName: String
    $secondaryFormName: String
    $image: String!
    $banner: String!
    $description: String!
    $helperImage: String
    $helperText: String
    $items: [EditProductItem!]!
  ) {
    addProduct(
      name: $name
      type: $type
      primaryFormName: $primaryFormName
      secondaryFormName: $secondaryFormName
      image: $image
      banner: $banner
      description: $description
      helperImage: $helperImage
      helperText: $helperText
      items: $items
    ) {
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

export default AddProductMutation;
