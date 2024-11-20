import { useEffect, useState } from "react";

function isDarkMode() {
  return document
    .getElementsByTagName("html")[0]
    .classList.contains("pf-v6-theme-dark");
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(isDarkMode());

  useEffect(() => {
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
          if (mutation.attributeName === "class") {
            setDarkMode(isDarkMode());
          }
        }
      }
    });
    observer.observe(document.getElementsByTagName("html")[0], {
      attributes: true,
      subtree: false,
      childList: false,
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return darkMode;
}
