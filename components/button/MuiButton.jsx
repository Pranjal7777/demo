import { Button } from "@material-ui/core";
import React from "react";

const MuiButton = (props) => {
	const { variant, color, label, title, ...others } = props;
	return (
		<Button
			variant={variant || "outlined"}
			color={color || "primary"}
			{...others}
		>
			{title || label || props.children}
		</Button>
	);
};

export default MuiButton;
