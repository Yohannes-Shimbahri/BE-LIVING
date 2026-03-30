// app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font)', minHeight: '100vh', background: '#F1F5F9' }}>
      {children}
    </div>
  );
}
