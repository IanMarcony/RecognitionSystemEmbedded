import React, { ReactNode, createContext, useState } from "react";

type ProductContextT = {
  productId: number | undefined;
  setProductId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type ProductContextProvider = {
  children: ReactNode;
};

export const ProductContext = createContext<ProductContextT | undefined>(
  undefined,
);

export const ProductProvider: React.FC<ProductContextProvider> = ({
  children,
}) => {
  const [productId, setProductId] = useState<number | undefined>(undefined);

  const contextValue: ProductContextT = {
    productId,
    setProductId,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
