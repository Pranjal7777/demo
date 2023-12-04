import dynamic from "next/dynamic";
import React from "react";
import Wrapper from "../hoc/Wrapper";
import RouterContext from "../context/RouterContext";
const BlockedUser = dynamic(()=>import("../components/Drawer/BlockedUser"),{ssr:false})

function BlockedUsers(props) {
  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
    <Wrapper>
      <div>
        <BlockedUser></BlockedUser>
      </div>
    </Wrapper>
    </RouterContext>
  );
}
export default BlockedUsers;
