// components/ui/LoaderContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';
import Loader from './Loader';

type LoaderContextType = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {loading && <Loader/>}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
