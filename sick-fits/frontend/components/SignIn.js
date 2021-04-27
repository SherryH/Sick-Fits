import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AUTHENTICATE_USER_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, clearForm } = useForm({
    email: '',
    password: '',
  });
  const [authenticateUser, { data, loading }] = useMutation(
    AUTHENTICATE_USER_MUTATION,
    {
      variables: {
        email: inputs?.email,
        password: inputs?.password,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault();
    // send to gql mutation
    await authenticateUser();

    clearForm();
  }
  const error = data?.authenticateUserWithPassword;
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <DisplayError error={error} />
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            name="email"
            placeholder="email"
            autoComplete="email"
            value={inputs.email}
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
