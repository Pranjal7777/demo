import { useSelector } from "react-redux";

const useReduxData = (key = []) => {
  let data = {};
  key.map((index) => {
    data[index] = useSelector((state) => state[index]);
  });

  return data;
};

export default useReduxData;
