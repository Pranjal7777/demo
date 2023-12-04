import React, { useState } from "react";
import { useAmp } from "next/amp";
import Wrapper from "../../hoc/Wrapper";
import _JSXStyle from "styled-jsx/style";
import { APP_NAME, BANNER_PLACEHOLDER_IMAGE } from "../../lib/config/homepage";
import { handleContextMenu } from "../../lib/helper";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import { useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import { useTheme } from "react-jss";
import { css } from "emotion";

const Image = (props) => {
	const { src, className, height, width, alt, loading, errorImageLink = "", isLazy, ...other } = props;
	const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
	const [imageLoaded, setImageLoaded] = useState(true);
	const theme = useTheme();
	const handleImageLoad = () => {
		setImageLoaded(false);
	};
	const mobileCss = css`
	display: block;
	margin: 0 auto;
	border-width: 5px;
`;
	return (
		<Wrapper>
			{useAmp() ? (
				<amp-img src={props.src} layout="fixed" className={props.className} {...other} />
			) : (
					<>
						<img
							height={height || "auto"}
							width={width || "auto"}
							alt={alt || APP_NAME}
							src={props.src}
							loading={loading || "lazy"}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = errorImageLink
									? s3ImageLinkGen(S3_IMG_LINK, errorImageLink, 80, 300, 300)
									: BANNER_PLACEHOLDER_IMAGE;
							}}
							onLoad={handleImageLoad}
							className={`${props.className} callout-none`}
							onContextMenu={handleContextMenu}
							{...other}
						/>
						{(imageLoaded && isLazy) ?
							<div className="w-100 h-100 position-absolute imgLoader d-flex align-items-center justify-content-center" style={{ top: "0" }}>
								<PuffLoader
									css={mobileCss}
									sizeUnit={"px"}
									size={80}
									color={theme.appColor}
									loading={imageLoaded}
								/>
							</div>
							: ""}
					</>
			)}
			<style jsx>
				{`
          .appLogo {
            width: 110px;
          }

          .appLogo:hover {
            cursor: pointer;
            transform: scale(1.1);
            transition: 0.3s;
          }
        `}
			</style>
		</Wrapper>
	);
};

export default Image;
