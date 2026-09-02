import { useEffect, useState } from "react";

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setScreenWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      };
  }, []);

  return screenWidth;
}
