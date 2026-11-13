export default function Loading() {
  return (
    <div
      className="container"
      style={{ padding: '48px 16px' }}
      aria-busy="true"
      aria-label="Carregando página..."
    >
      <div className="dashboard-skeleton" style={{ gap: '20px' }}>
        <div className="dashboard-skeleton__block dashboard-skeleton__block--kpi" />
        <div className="dashboard-skeleton__block dashboard-skeleton__block--chart" />
      </div>
    </div>
  );
}
