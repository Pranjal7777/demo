import { css } from "emotion";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { PRIMARY_COLOR } from "../../lib/color";
import { PagerLoader } from "../../lib/rxSubject";
import { useTheme } from "react-jss";
import { useEffect } from "react";

export default function PageLoader(props) {
  const [isLoading, setLoading] = useState(props.start || false);
  const { size, margin, ...others } = props;
  const theme = useTheme();

  useEffect(() => {
    const PageSubscriber = PagerLoader.subscribe((flag) => setLoading(flag));
    return () => PageSubscriber.unsubscribe()
  }, [])

  const mobile = css`
    display: block;
    margin: 0 auto;
    border-width: 5px;
  `;
  return (
    <PulseLoader
      css={mobile}
      sizeUnit={"px"}
      size={size || 10}
      margin={margin || 5}
      color={theme.appColor || PRIMARY_COLOR}
      loading={isLoading}
      {...others}
    />
  );
}
