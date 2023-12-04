import React, { useEffect, useState } from "react";
import Error from "../error/error";

const TextArea = (props) => {
	const { className, value, placeholder, rows, onChange, error, ...others } =
		props;
	// console.log("value", value);
	const [localValue, setValue] = useState(value || "");

	useEffect(() => {
		setValue(value);
		// console.log("value", value);
	}, [props]);

	return (
		<div className={props.bioInput ? "form-group m-0" : "form-group"}>
			<textarea
				className={`form-control ${error && "input-error-error"} ${className || ""
					}`}
				style={{ padding: props.bioInput ? "6px 30px 6px 12px" : "6px 12px" }}
				//className="form-control mv_form_control_textarea"
				placeholder={placeholder || "Add Caption"}
				rows={rows || 2}
				defaultValue={localValue}
				onChange={(e) => {
					const val = e.target.value;
					setValue(val);
					onChange && onChange(val);
				}}
				{...others}
			/>
			{error && <Error errorMessage={error}></Error>}
		</div>
	);
};

export default TextArea;

// import React from "react";
// import Error from "../error/error";
// const InputText = ({ className, ...props }, ref) => {
//   const { error, type = "text" } = props;
//   return (
//     <div className="form-group position-relative">
//       <input
//         ref={ref}
//         type={type}
// className={`form-control ${
//   error && "input-error-error"
// } form-control-trans ${className || ""}`}
//         {...props}
//       ></input>

//       {error && <Error errorMessage={error}></Error>}
//     </div>
//   );
// };

// export default React.forwardRef(InputText);
