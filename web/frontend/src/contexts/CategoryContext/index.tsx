import React, { ReactNode, createContext, useState } from "react";

type CategoryContextT = {
  categoryId: number | undefined;
  setCategoryId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type CategoryContextProvider = {
  children: ReactNode;
};

export const CategoryContext = createContext<CategoryContextT | undefined>(
  undefined,
);

export const CategoryProvider: React.FC<CategoryContextProvider> = ({
  children,
}) => {
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const contextValue: CategoryContextT = {
    categoryId,
    setCategoryId,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};
