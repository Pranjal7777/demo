import React from "react";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import isMobile from "../../../hooks/isMobile";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "react-jss";

const useStyle = props => makeStyles((theme)=>({
  root: {
      fontSize: "3rem"
  },
  iconEmpty: {
    color: props.theme.text
  }
}))

const RatingComp = (props) =>  {
  const theme = useTheme();
  const {isReviewTab, isOtherProfilePage, className = "" ,handleRatingStars, isCreatorSelf=false, fontSize = "", ratingCountDisplay = true, isCreatorMobile = false} = props;
  const [mobileView] = isMobile();
  const [value, setValue] = React.useState(props?.value || 0);
  const classes = useStyle({theme: theme})();
  return (
    
    <div>
      <div className={`d-flex ${isReviewTab ? className || "justify-content-start" : "justify-content-center"} align-items-center`}>
        <Box component="fieldset" borderColor="transparent">
          <Rating
            name={isReviewTab ? "read-only" : "simple-controlled"}
            value={value}
            precision={0.5}
            style={{ fontSize: props.starSize ? props.starSize : isCreatorSelf ? `${props.starSize || "15px"}` : "" }}
            onChange={(event, newValue) => {
              if(!newValue) return
             const roundValue =  newValue?.toString().includes('.5')
              ? newValue
            : parseInt(Math.round(newValue))
              handleRatingStars && handleRatingStars(roundValue);
              setValue(roundValue);
            }}
            classes={{iconEmpty: classes.iconEmpty}}
            readOnly = {isReviewTab || false}
            className={(mobileView && !isOtherProfilePage) ? classes.root : ""}
          />
        </Box>
        {props.showDots ? <span className="font-weight-700 fntSz9 mx-2 my-auto">●</span> : ""}
        {ratingCountDisplay && <p className={` ${isCreatorSelf ? "fntSz13 pl-2" : ""} m-0 ${!mobileView ? " appTextColor" : "text-muted"} `}>
          { value}</p>
        }
      </div>
      <style jsx>
        {`
          :global(.MuiRating-label){
            top:${mobileView ? "8px" : "2px"}
          }
       `}
      </style>
    </div>
  );
}

export default RatingComp