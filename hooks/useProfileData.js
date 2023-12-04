import { useSelector } from "react-redux";

const useProfileData = () => {
  const profile = useSelector((state) => state?.profileData);
  return [profile];
};

export default useProfileData;
