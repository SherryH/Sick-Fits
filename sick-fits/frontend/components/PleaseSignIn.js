import { useUser } from './User';
import SignIn from './SignIn';

export const PleaseSignIn = ({ children }) => {
  const me = useUser();
  if (!me) return <SignIn />;

  return <div>{children}</div>;
};
