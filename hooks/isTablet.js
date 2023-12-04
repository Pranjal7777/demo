import { useSelector } from "react-redux";

const isTablet = () => {
  const tabletView = useSelector((state) => state.isTablet);
  return [tabletView];
};

export default isTablet;
