import { css } from "emotion";
import React, { useEffect, useState } from "react";
import { ClipLoader, PropagateLoader, PuffLoader, PulseLoader } from "react-spinners";
import { CustomPagerLoader } from "../../lib/rxSubject";
import { useTheme } from "react-jss";

/**
 * @description add your custom loader
 * @author Jagannath
 * @date 2021-02-04
 * @param type : "normal" / null
 * @param isLoading : boolean / if normal then
 * @param props type: [PulseLoader, PuffLoader, PropagateLoader, ClipLoader]
 */
const CustomDataLoader = (props) => {
  const { size, margin, type, loading = false, isLoading, ...others } = props;
  const [pageLoading, setLoading] = useState(loading || false);
  const theme = useTheme();

  useEffect(()=>{
    setLoading(loading || false);
  },[loading]);

  CustomPagerLoader.subscribe((flag) => setLoading(flag));

  const mobile = css`
    display: block;
    margin: 0 auto;
    border-width: 5px;
  `;

  if (type == 'normal') {
    return (
      <span className={isLoading ? 'visiblity-visible' : 'hidden'}>
        <PulseLoader
            css={mobile}
            sizeUnit={"px"}
            size={size || 10}
            margin={ margin || 5}
            color={theme.appColor}
            loading={true}
            {...others}
            />
      </span>
    )
  }

  if(type == 'PulseLoader'){
      return (
        <PulseLoader
            css={mobile}
            sizeUnit={"px"}
            size={size || 10}
            margin={ margin || 5}
            color={theme.appColor}
            loading={pageLoading}
            {...others}
            />
        )
    }
  if(type == 'PuffLoader'){
    return (
        <PuffLoader
            css={mobile}
            sizeUnit={"px"}
            size={size || 10}
            color={theme.appColor}
            loading={pageLoading}
            {...others}
            />
        )
    }
  if(type == 'ClipLoader'){
    return (
        <ClipLoader
            css={mobile}
            sizeUnit={"px"}
            size={size || 10}
            color={theme.appColor}
            loading={pageLoading}
            {...others}
            />
        )
    }
  return (
    <PropagateLoader
      css={mobile}
      sizeUnit={"px"}
      size={size || 10}
      margin={ margin || 5}
      color={theme.appColor}
      loading={pageLoading || loading}
      {...others}
    />
  );
}
export default CustomDataLoader;