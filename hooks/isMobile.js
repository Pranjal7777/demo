import { useSelector } from "react-redux";

const isMobile = () => {
  const mobileView = useSelector((state) => state.isMobile);
  return [mobileView];
};

export default isMobile;
