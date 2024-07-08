import React, { ReactNode, createContext, useState } from "react";
import FullScreenLoading from "../../components/FullScreenLoading";

type LoaderContextT = {
  setIsLoading: (status: boolean) => void;
  isVisible: boolean;
};

type LoaderContextProvider = {
  children: ReactNode;
};

export const LoaderContext = createContext<LoaderContextT | undefined>(
  undefined,
);

export const LoaderProvider: React.FC<LoaderContextProvider> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const contextValue: LoaderContextT = {
    setIsLoading: (status) => {
      setIsVisible(status);
    },
    isVisible: isVisible,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {isVisible && <FullScreenLoading />}
      {children}
    </LoaderContext.Provider>
  );
};
