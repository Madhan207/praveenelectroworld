import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ALL_PRODUCTS } from './CategoryPage';
import { Search as SearchIcon } from 'lucide-react';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Flatten all mock products into a single array
  const allProductsList = useMemo(() => {
    return Object.values(ALL_PRODUCTS).flat();
  }, []);

  // Filter based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase().trim();
    return allProductsList.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.category_name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery)
    );
  }, [allProductsList, query]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Search Results</h1>
        <p className="text-slate-500 text-lg">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for <span className="font-bold text-brand-600">"{query}"</span>
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <SearchIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No products found</h2>
          <p className="text-slate-500 mb-6">We couldn't find anything matching your search. Try adjusting your keywords.</p>
          <Link to="/" className="inline-block bg-brand-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
