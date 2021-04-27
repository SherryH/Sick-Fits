import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import Form from './styles/Form';

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, clearForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [createUser, { data, loading, error }] = useMutation(
    CREATE_USER_MUTATION,
    {
      variables: {
        name: inputs?.name,
        email: inputs?.email,
        password: inputs?.password,
      },
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault();
    // send to gql mutation
    await createUser().catch(console.error);

    clearForm();
  }
  // const error = data?.authenticateUserWithPassword;
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up for a New Account</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <DisplayError error={error} />
        {data?.createUser && (
          <p>
            User Account Created with ${data.createUser.email}! Please Sign In.
          </p>
        )}
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            name="name"
            placeholder="name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            name="email"
            placeholder="email"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up!</button>
      </fieldset>
    </Form>
  );
}
