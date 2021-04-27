import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import Form from './styles/Form';

const REDEEM_TOKEN_MUTATION = gql`
  mutation REDEEM_TOKEN_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, clearForm } = useForm({
    email: '',
    password: '',
  });

  const [redeemUserPasswordResetToken, { data, loading, error }] = useMutation(
    REDEEM_TOKEN_MUTATION,
    {
      variables: {
        email: inputs?.email,
        password: inputs?.password,
        token,
      },
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault();
    // send to gql mutation
    await redeemUserPasswordResetToken().catch(console.error);

    clearForm();
  }
  console.log('data', data);
  const resultingError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : error;
  // const error = data?.authenticateUserWithPassword;

  if (!token) {
    return <div>Please provide a token to reset the password</div>;
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <DisplayError error={resultingError} />
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! Please log in with new password</p>
        )}
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
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Reset Password!</button>
      </fieldset>
    </Form>
  );
}
