import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { PRIMARY } from "../../../lib/config";
import { useTheme } from "react-jss";
const Loader = (props) => {
  const theme = useTheme()
  const override = css`
    display: block;
    margin: 0 auto;
  `;
  return (
    props.loading && (
        <div className="cliploader mt-3" style={{background:theme.palette.l_base ,borderRadius:"50%",padding:"5px"}}>
          <ClipLoader
            css={override}
            sizeUnit={"px"}
            size={props.size || 40}
            color={props.color || PRIMARY}
            loading={props.loading}
          />
          <style jsx>{``}</style>
        </div>
    )
  );
};

export default Loader;
