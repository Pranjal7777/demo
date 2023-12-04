import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

// call this component for thick line chimers
export const SingleLineLoader = props => {
  return <Skeleton {...props} />;
};

// call this component for thin line chimers
export const SingleThinLineLoader = props => {
  return props.count ? (
    Array.from(new Array(props.count)).map((e,i) => <Skeleton key={i} {...props} />)
  ) : (
    <Skeleton {...props} />
  );
};

// call this components for rendering card chimers
function MeadiLoader(props) {
  const { loading = false, boxCount } = props;

  return (
    <Grid container wrap="nowrap">
      {(loading
        ? Array.from(new Array(boxCount || 4))
        : Array.from(new Array(boxCount || 4))
      ).map((item, index) => (
        <Box key={index} width={"100%"} marginRight={0.5} my={5}>
          {<Skeleton variant="rect" width={220} height={230} />}

          {
            <React.Fragment>
              <Skeleton />
              <Skeleton width="60%" />
            </React.Fragment>
          }
        </Box>
      ))}
    </Grid>
  );
}

MeadiLoader.propTypes = {
  loading: PropTypes.bool
};

export default function SectionLoader(props) {
  const { type } = props;
  return (
    <Box overflow="hidden" clone>
      <Paper>
        <Box px={3}>
          <MeadiLoader loading {...props} />
          <MeadiLoader {...props} />
        </Box>
      </Paper>
    </Box>
  );
}
