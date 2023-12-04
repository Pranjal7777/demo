import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {

        },
    },
    input: {
        background: 'red !important',
        border: '2px solid red',
        opacity: '0',
        borderRadius: 4,
        position: 'relative',
        fontSize: 0,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },

}))(InputBase);

const useStyles = makeStyles((theme) => ({
    select: {
        '&:before': {
            borderColor: 'red',
        },
        '&:after': {
            borderColor: 'red',
        }
    },
    icon: {
        fill: 'red',
        opacity: '0'
    },
}));

export default function CustomizedSelects(props) {
    const classes = useStyles();
    const [status, setStatus] = React.useState('');
    const [allStatus, setAllStatus] = React.useState([])

    const handleChange = (event) => {
        setStatus(event.target.value);
        handleFilter()
    };
    const {
        options,
        handleFilterState,
        ...otherProps
    } = props;

    const handleFilter = () => {
        {
            status === 'all'
                ? handleFilterState('all')
                : options.filter(option => option.status === `${status}`).map(filteredStatus => {
                    handleFilterState(filteredStatus.status)
                })
        }
    }

    const filterComponent = (options=[]) => {
        const filteredStatus = options.filter((option, index, arr) => {
            return arr.map(obj => obj.status).indexOf(option.status) === index
        });

        return filteredStatus && filteredStatus.map((option, index) => (
            <MenuItem key={index} style={{ padding: '0px 8px' }} value={option.status}>
                <span className='p-0 m-0'>{option.status}</span>
            </MenuItem>
        ))
    }

    useEffect(() => {
        handleFilter()
    }, [status])

    return (
        <div>
            <FormControl>
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={status}
                    onChange={handleChange}
                    // SelectDisplayProps={<FilterListIcon />}
                    style={{ paddingRight: '0px !important' }}
                    input={<BootstrapInput />}
                    className={classes.select}
                    inputProps={{
                        classes: {
                            icon: classes.icon,
                        },
                        padding: {
                            padding: '0px 0px'
                        }
                    }}
                >
                    <MenuItem value='all'>
                        <span className='p-0 m-0'>All</span>
                    </MenuItem>
                    {
                        filterComponent(options)
                    }
                </Select>
            </FormControl>
        </div>
    );
}
