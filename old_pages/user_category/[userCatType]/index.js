import React, { useEffect, useState } from "react";
import UserViewAll from "../../../containers/UserCategories/userViewAll";
import Wrapper from "../../../hoc/Wrapper";

const UserCatTypeList = () => {
  return (
    <Wrapper>
      <div className="subPageScroll">
        <UserViewAll />
      </div>
      <style jsx>{`
        .subPageScroll {
          overflow-y: auto !important;
          height: 100vh;
        }
      `}</style>
    </Wrapper>
  );
};

export default UserCatTypeList;
