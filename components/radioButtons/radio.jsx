import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from "react-jss";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { NONE_ICON, HIGHLIGHTED_NONE_ICON } from '../../lib/config';
import { open_drawer, close_drawer } from '../../lib/global'
import { useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../lib/UploadAWS/uploadAWS';

const useStyles = props => makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  label: {
    fontSize: "13px",
    textAlign: "center",
    color: props?.theme?.text || "#000"
  },
  checkedIcon: {
    width: "80px",
    padding: "10px",
    border: `2px solid ${props?.theme?.appColor || "var(--l_base)"}`,
    borderRadius: "50%",
  },
  icon: {
    width: "80px",
    padding: "10px",
  }
});

// Inspired by blueprintjs
const StyledRadio = (props) => {
  const classes = useStyles();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const imgSrc = `${props?.valueIcon}`
  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      onClick={() => props.handleValue === "Others" ? "" : close_drawer("ShoutoutFormOccasion")}
      checkedIcon={<img src={`${props.ShoutoutOccasion ? imgSrc : s3ImageLinkGen(S3_IMG_LINK, imgSrc, null, 55)}`} alt="dynamic render" className={classes.checkedIcon} style={props.ShoutoutOccasion ? { borderRadius: '50%', padding: '4px', border: '2px solid var(--l_base)', width: "90px", height: "90px" } : {}} />}
      icon={<img src={`${props.ShoutoutOccasion ? imgSrc : s3ImageLinkGen(S3_IMG_LINK, imgSrc, null, 55)}`} alt="dynamic render" className={classes.icon} style={props.ShoutoutOccasion ? { borderRadius: '50%', width: "80px", height: "80px" } : {}} />}
      {...props}
    />
  );
}


export default function CustomizedRadios(props) {
  const theme = useTheme();
  const classes = useStyles({ theme })();
  const {
    handleValue,
    handleChange,
    radioBttons,
    isTextAreaVisible,
    ...otherProps
  } = props;
  return (
    <FormControl component="fieldset">
      <RadioGroup aria-label="gender" name="customized-radios" value={isTextAreaVisible ? "Others" : handleValue} onChange={(e) => handleChange(e.target.value)}>
        <div className='w-100 text-center d-flex flex-wrap justify-content-between'>
          {radioBttons &&
            radioBttons.map((radio, index) => {
              return <FormControlLabel
                value={radio.value}
                key={index}
                style={{ width: '21%' }}
                control={<StyledRadio ShoutoutOccasion={props.ShoutoutOccasion} valueIcon={radio.valueIcon} handleValue={radio.value} />}
                labelPlacement="bottom"
                classes={{ label: classes.label }}
                label={radio.value} />
            })}
        </div>
      </RadioGroup>
    </FormControl>
  );
}

