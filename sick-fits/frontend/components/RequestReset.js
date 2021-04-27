import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import { DisplayError } from './ErrorMessage';
import Form from './styles/Form';

const SEND_PASSWORD_RESET_LINK_MUTATION = gql`
  mutation SEND_PASSWORD_RESET_LINK_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, clearForm } = useForm({
    email: '',
  });

  const [sendUserPasswordResetLink, { data, loading, error }] = useMutation(
    SEND_PASSWORD_RESET_LINK_MUTATION,
    {
      variables: {
        email: inputs?.email,
      },
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault();
    // send to gql mutation
    await sendUserPasswordResetLink().catch(console.error);

    clearForm();
  }
  // const error = data?.authenticateUserWithPassword;
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request a New Password Reset</h2>
      <fieldset disabled={loading} aria-busy={loading}>
        <DisplayError error={error} />
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! please check your email for reset token</p>
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
        <button type="submit">Reset Password!</button>
      </fieldset>
    </Form>
  );
}
