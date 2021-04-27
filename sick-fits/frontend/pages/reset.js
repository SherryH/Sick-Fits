import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  const { token } = query;
  return (
    <div>
      <Reset token={token} />
    </div>
  );
}
