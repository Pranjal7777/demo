import { useSelector } from "react-redux";

const useCardsData = () => {
  const cards = useSelector((state) => state.cards);
  return [cards];
};
export default useCardsData;

