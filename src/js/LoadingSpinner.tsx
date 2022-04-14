type LoadingSpinnerProps = {
  msg: string;
  loading: boolean;
};

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const { msg, loading } = props;
  if (!loading) return null;
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-msg">{msg}</div>
    </div>
  );
};

export default LoadingSpinner;
