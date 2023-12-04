import React from "react";
import _JSXStyle from "styled-jsx/style";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { handleBreadCrumbs, getMyURL } from "../../lib/breadcrumbs/breadcrumbs";
import { FONT_FAMILY } from "../../lib/config";

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: "center",
    flexWrap: "wrap"
  },
  paper: {
    padding: "10px 12px",
    fontSize: "14px",
    // paddingBottom: 0,
    paddingLeft: "20px"
    // padding: theme.spacing(1, 2)
  }
}));

const listStyle = {
  fontSize: "12px"
};

export default function CustomBreadCrumbs(props) {
  const classes = useStyles();

  const { breadcrumbs, handleCrumbClick, isCustomStyle } = props;

  return (
    <div className={classes.root}>
      <Paper
        elevation={0}
        style={isCustomStyle ? { ...isCustomStyle } : {}}
        className={classes.paper}
      >
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" style={{ fontSize: "16px" }} />
          }
          aria-label="breadcrumb"
          style={{ ...listStyle }}
        >
          {breadcrumbs &&
            breadcrumbs.map((item, key) =>
              key === breadcrumbs.length - 1 ? (
                <Typography color="textPrimary">{item}</Typography>
              ) : (
                <a
                  // color="inherit"
                  key={"bs-" + key}
                  className="breadcrumb-slugs"
                  // href={() => getMyURL(item, key)}
                  style={{
                    textTransform: "capitalize",
                    color: "#999"
                  }}
                  value={key}
                  onClick={() => handleBreadCrumbs(breadcrumbs, key)}
                >
                  {item}
                </a>
              )
            )}
        </Breadcrumbs>
      </Paper>

      <style jsx>
        {`
          .breadcrumb-slugs:hover {
            cursor: pointer;
          }

          :global(.MuiBreadcrumbs-li) {
            font-family: ${FONT_FAMILY};
          }

          :global(.MuiBreadcrumbs-li p) {
            font-family: ${FONT_FAMILY};
            font-size: 12px;
          }
        `}
      </style>
    </div>
  );
}
