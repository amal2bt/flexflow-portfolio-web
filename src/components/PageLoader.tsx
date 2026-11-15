export default function PageLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <div className="page-loader-overlay">
      <img src="/images/logo3.png" alt="Loading FlexFlow" className="loader-logo" />
    </div>
  );
}
