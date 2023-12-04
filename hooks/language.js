import { useSelector } from "react-redux";
import { LanguageSet } from "../translations/LanguageSet";

const useLang = () => {
  try {
    const langCode = useSelector(state => state.language) || "en";
    const lang = LanguageSet[langCode] || {}
    // console.log('lang', lang)
    return [lang, langCode];
    
  } catch (error) {
    console.error('useLang - error', error)
    
  }
};
export default useLang;
