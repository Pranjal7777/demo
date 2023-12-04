import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MuiSnackbar = (props) => {
    const { open, handleClose } = props

    return <Snackbar
        style={{ maxWidth: "500px" }}
        open={open.open}
        autoHideDuration={open.duration || 2000}
        onClose={handleClose}
    >
        <Alert onClose={handleClose} severity={open.veriant}>
            {open.message}
        </Alert>
    </Snackbar>
}

export default MuiSnackbar