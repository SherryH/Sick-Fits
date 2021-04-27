import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import { ALLPRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String
    $price: Int
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      name
      description
      price
      status
    }
  }
`;

const CreateProduct = () => {
  const router = useRouter();
  const { inputs, handleChange, resetForm, clearForm } = useForm();
  const { name, price, description, image } = inputs;

  const [createProduct, { data, error, loading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      refetchQueries: [{ query: ALLPRODUCTS_QUERY }],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createProduct({ variables: inputs });
    console.log(res);
    clearForm();
    router.push({
      pathname: `/product/${res.data?.createProduct?.id}`,
    });
  };
  return (
    // create a simple form for entering name and price

    <Form onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            id="image"
            type="file"
            name="image"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </label>
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
        <button type="submit">Add Product</button>
      </fieldset>
    </Form>
  );
};

export default CreateProduct;
