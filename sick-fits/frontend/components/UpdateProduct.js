import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      description
      status
      price
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION($id: ID!, $data: ProductUpdateInput) {
    updateProduct(id: $id, data: $data) {
      id
      name
      description
      status
      photo {
        image {
          publicUrlTransformed
        }
      }
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. call gql query to display info about this product
  // 2. supply mutation to do update
  // 3. create the form

  const router = useRouter();
  // 1. call gql with gql and useQuery
  // save in cache so no extra network req (?) double check!
  // => no. actually extra req is made. unless this is an object visited b4.
  console.log('=====id====', id);
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  // 2. supply mutation with useMutation
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  // 3. create the Form using useForm
  console.log('data', data);
  const { inputs, handleChange, resetForm, clearForm } = useForm(data?.Product);
  const { name, price, description } = inputs;

  if (loading) return 'loading...';
  if (error) return <DisplayError />;
  console.log('updateData', updateData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('e.target', e.target);
    console.log('id', id);

    await updateProduct({
      variables: {
        id,
        data: {
          name,
          description,
          price,
        },
      },
    }).catch((error) => {
      console.log(error);
    });
    // router.push({
    //   pathname: `/update/${id}`,
    // });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            name="name"
            placeholder="name"
            value={name}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            id="price"
            type="number"
            name="price"
            placeholder="price"
            value={price}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            type="text"
            name="description"
            placeholder="description"
            value={description}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
