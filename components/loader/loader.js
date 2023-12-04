import { css } from "emotion";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { PRIMARY_COLOR } from "../../lib/color";
import { useTheme } from "react-jss";

export default function Loader(props) {
  const theme = useTheme();
  const mobile = css`
    display: block;
    margin: 0 auto;
    border-width: 5px;
  `;
  return (
    <ClipLoader
      css={mobile}
      sizeUnit={"px"}
      size={props.size || 50}
      color={props.color || theme.appColor || PRIMARY_COLOR}
      loading={props.isLoading}
    />
  );
}
