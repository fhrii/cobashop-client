import { gql } from '@apollo/client';

const EditProductMutation = gql`
  mutation EditProduct(
    $id: ID!
    $name: String
    $type: ProductType
    $primaryFormName: String
    $secondaryFormName: String
    $image: String
    $banner: String
    $description: String
    $helperImage: String
    $helperText: String
    $items: [EditProductItem!]
    $deleted: Boolean
  ) {
    editProduct(
      id: $id
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
      deleted: $deleted
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

export default EditProductMutation;
