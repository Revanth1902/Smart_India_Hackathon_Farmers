import { useEffect, useState } from "react";

const useLanguage = () => {
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    const savedLang = localStorage.getItem("farmerLanguage");
    if (savedLang === "malayalam" || savedLang === "english") {
      setLanguage(savedLang);
    }
  }, []);

  return language;
};

export default useLanguage;
