import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '20px',
        height: '20px',
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function ImageAvatars(props) {
    const {
        src,
        children,
        ...otherProps
    } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Avatar alt="Remy Sharp" src={src} />
        </div>
    );
}
