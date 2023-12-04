import React, { useEffect } from "react";
import GetCategoryUser from "../../../containers/UserCategories/categoryWiseUser/getCategoryUser";

const UserCatType = (props) => {
  return <div>
      <GetCategoryUser {...props} />
  </div>;
};

export default UserCatType;
