
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 w-24 h-24 rounded-full bg-wishlist-light flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold text-wishlist-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Maaf, halaman yang kamu cari tidak tersedia. Mari kembali ke halaman utama.
        </p>
        <Link to="/">
          <Button className="button-gradient">
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
