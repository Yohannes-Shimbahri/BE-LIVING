import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Be-Living Marketing Agency',
  description: 'Full-service digital marketing agency focused on helping businesses grow through strategic, data-driven, and creative marketing solutions.',
  keywords: 'marketing agency, social media management, paid advertising, content creation, email marketing, brand strategy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
