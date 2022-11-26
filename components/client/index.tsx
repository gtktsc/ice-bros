import React, { useEffect, useState } from "react";

const Client = ({ children }: { children: React.ReactNode | null }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (typeof window === "undefined" || !isRendered) return null;

  return <>{children}</>;
};

export default Client;
