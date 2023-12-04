import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function LinearProgressBar() {
  const {timeMs=1000} = props;
  const classes = useStyles();
  const [completed, setCompleted] = React.useState(0);

  React.useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        if (oldCompleted === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldCompleted + diff + 3, 100);
      });
    }

    const timer = setInterval(progress, timeMs);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={completed} />
    </div>
  );
}
