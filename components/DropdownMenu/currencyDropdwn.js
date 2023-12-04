import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import isMobile from '../../hooks/isMobile';



const useStyles = makeStyles((theme) => ({
		root: {
			width:  '16vw' ,
			height:  '11vw',
			background: '#f1f2f6',
			borderRadius: "50px",
		}
}));

export default function SimpleSelect(props) {
	const classes = useStyles(mobileView);
	const { menuItems, button, handleCurrency, value, currencySymbol } = props;
	const [mobileView] = isMobile();

	return (
		<FormControl variant="outlined">
			<Select
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				value={currencySymbol}
				className={`${mobileView ? classes.root : ""} control_Input_background grey_color`}
				onChange={handleCurrency}
				IconComponent={() => null}
				inputProps={{ sx: { padding: '0 !important' } }}
				disabled={true}
			>
				{
					menuItems &&
					menuItems.map((menuItem, index) => (
						<MenuItem key={index} value={menuItem.label} name={menuItem.icon}>
							{menuItem.icon}
						</MenuItem>
					))
				}
			</Select>
		</FormControl>
	);
}
