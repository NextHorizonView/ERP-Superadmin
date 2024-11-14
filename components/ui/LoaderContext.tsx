"use client";
import React, { createContext, useContext, useState } from "react";
import Loader from "./Loader";

type LoaderContextType = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);

  const showLoader = () => {
    const timeout = setTimeout(() => setLoading(true), 400); // 200ms delay
    setDelayTimeout(timeout);
  };

  const hideLoader = () => {
    if (delayTimeout) clearTimeout(delayTimeout); // Clear timeout if loader isn't displayed yet
    setLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {loading && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
