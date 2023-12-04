import React from "react";
import router from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { useDispatch } from "react-redux";

import { PRIMARY_COLOR } from "../../lib/color";

const index = () => {
  const dispatch = useDispatch();

  const mobile = css`
    display: block;
    margin: 0 auto;
    border-width: 5px;
  `;

  React.useEffect(() => {
    router.push("/live/popular");
  }, []);


  return (
    <>
      <div style={{ height: '100vh' }} className="w-100 d-flex justify-content-center align-items-center">
        <ClipLoader
          css={mobile}
          sizeUnit={"px"}
          size={50}
          color={PRIMARY_COLOR}
          loading={true}
        />
      </div>
    </>
  );
};

export default index;
