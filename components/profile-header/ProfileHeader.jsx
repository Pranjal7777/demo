import React from "react";
import _JSXStyle from "styled-jsx/style";
import Wrapper from "../../hoc/Wrapper";

function ProfileHeader(props) {
  return (
    <Wrapper>
      <h6>{props.name}</h6>
      <style jsx>
        {`
          // font-weight: normal;
          font-size: 1rem;
        `}
      </style>
    </Wrapper>
  );
}

export default ProfileHeader;
