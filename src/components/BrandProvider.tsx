"use client";

import { createContext, useContext } from "react";
import { SITE, type Brand } from "@/lib/site";

const BrandContext = createContext<Brand>(SITE);

/** Makes the visitor's brand (picked by domain on the server) available to client components. */
export function BrandProvider({ brand, children }: { brand: Brand; children: React.ReactNode }) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export const useBrand = () => useContext(BrandContext);
