import { useSelector } from "react-redux";

const defaultCardsData = () => {
  const defaultCard = useSelector((state) => state.defaultCard);
  return [defaultCard];
};
export default defaultCardsData;
