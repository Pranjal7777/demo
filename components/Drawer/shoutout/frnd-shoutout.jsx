import Header from "../../header/header";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { Avatar, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import { open_drawer } from "../../../lib/global";
import { useTheme } from "react-jss";
const useStyles = makeStyles({
  avatar: {
    margin: "auto",
    height: "100px",
    width: "100px",
    marginBottom: "10px",
  }
})

const FrndShoutout = (props) => {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const classes = useStyles();
  const theme = useTheme()

  const contactDrawer = () => {
    open_drawer("ShoutoutContact", {profile: props.profile}, "right")
  }

  return (
    <>
      {mobileView
        ? (
          <>
            <Header back={props.onClose} title={lang.whoIsThisFor} />
            <div style={{ paddingTop: "70px" }} className="container">
              <div className="text-center">
                <Avatar className={classes.avatar} />
                <p style={{color : `${theme?.text}`}}>Select A Friend</p>
                <p className="text-left bold" style={{color : `${theme?.text}`}}>Select From Contact</p>
                <TextField label="Select" fullWidth onClick={() => contactDrawer()} />
              </div>
            </div>
          </>
        ) : ""}
    </>
  )
}

export default FrndShoutout;