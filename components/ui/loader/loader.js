import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { PRIMARY } from "../../../lib/config";
const Loader = (props) => {
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  return (
    props.loading && (
      <div className="w-100 text-center ">
        <div className="cliploader mt-4">
          <ClipLoader
            css={override}
            sizeUnit={"px"}
            size={props.size || 40}
            color={props.color || PRIMARY}
            loading={props.loading}
          />
          <style jsx>{``}</style>
        </div>
      </div>
    )
  );
};

export default Loader;
