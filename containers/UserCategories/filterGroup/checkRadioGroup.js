import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import isMobile from "../../../hooks/isMobile";
import Wrapper from "../../../hoc/Wrapper";
import { useTheme } from "react-jss";

const useStyles = (props) =>
  makeStyles((theme) => ({
    root: {
      display: "flex",
      color: props.theme.text,
      fontSize: "15px",
      width: props.mobileView  ? "100%" : "170px",
      marginLeft: props.mobileView && "0px",
      marginBottom: "2px",
      justifyContent: props.mobileView && props?.filterType == "Filter by category" ? "space-between" : "unset",
      "& .MuiTypography-root":{
        fontSize: props.mobileView && "17px",
      },
    },
    checked: {
      color: props.appColor,
    },
  }));

export default function CheckboxLabels(props) {
  const [mobileView] = isMobile();
  let { checkboxList ,category_label} = props;
  const theme = useTheme();
  const classes = useStyles({ mobileView: mobileView, theme: theme, filterType: props?.filterType })();
  const handleChange = (id) => {
    // props?.setFilterValue(id);
    !mobileView && props?.handleCheckboxValue(props?.filterType, id)
    mobileView && props?.handleState && props.handleState(props?.filterType, id)
  };

  const isFeaturedCreators = category_label === "Featured" ? "Actors" : null
  
  return (
    <Wrapper>
      <FormGroup>
        {checkboxList.length > 0 && checkboxList.map((checkLabel, index) => (
          <FormControlLabel
            className={classes.root}
            labelPlacement={props?.labelPlacement || "end"}
            onChange={(e)=>handleChange(index, e)}
            control={
              <Checkbox
                size={mobileView ? "large" : "small"}
                style={{ color: theme.text }}
                checked={checkLabel?.label === isFeaturedCreators ? true : checkLabel?.checked}
                disabled={checkLabel?.label === isFeaturedCreators}
              />
            }
            label={checkLabel?.label}
          />
        ))}
      </FormGroup>
      <style jsx>{`
          :global(.MuiCheckbox-colorSecondary.Mui-checked){
            color: ${theme?.appColor} !important;
          }
        `
      }</style>
    </Wrapper>
  );
}
