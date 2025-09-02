import { useState } from 'react';
import { ShopifyWrapped } from './components/ShopifyWrapped'
import { ImageExportPage } from './components/ImageExportPage'
import { useShopifyWrappedData } from './hooks/useShopifyWrappedData';

export function App() {
  const [currentPage, setCurrentPage] = useState<'wrapped' | 'export'>('wrapped');
  const storyData = useShopifyWrappedData();

  const navigateToExport = () => {
    setCurrentPage('export');
  };

  const navigateToWrapped = () => {
    setCurrentPage('wrapped');
  };

  if (currentPage === 'export') {
    return <ImageExportPage data={storyData} onBack={navigateToWrapped} />;
  }

  return <ShopifyWrapped onNavigateToExport={navigateToExport} />;
}
