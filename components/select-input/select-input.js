import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const SelectMenuInput = (props) => {
    const { placeholder, value, isMultiple, selectedCategoryValue = [], onChange, handleSelectPagination, categories, handleClick } = props;

    const renderValue = (selected) => {
        if (selectedCategoryValue?.length === 0) {
            return <div style={{ color: '#8B8B8B', fontSize: "14px", }}>{placeholder || "placeholder"}</div>;
        }
        return isMultiple ? selectedCategoryValue?.join(', ') : selectedCategoryValue;
    };

    return (
        <FormControl fullWidth>
            <Select
                labelId="upgradableRoomCategoriesIds"
                id="upgradableRoomCategoriesIds search"
                multiple={isMultiple}
                value={value || (isMultiple ? [] : '')}
                displayEmpty
                renderValue={renderValue}
                onMouseDown={handleClick}
                name="upgradableRoomCategories.upgradableRoomCategoriesIds"
                onChange={onChange}
                sx={{
                    borderRadius: "10px",
                    '& fieldset': {
                        border: "1px solid var(--l_border) !important",
                        outline: "none !important"
                    },
                    '&:hover fieldset': {
                        border: "1px solid var(--l_border) !important"
                    },
                    '&:active fieldset': {
                        border: "1px solid var(--l_border) !important"
                    },
                    '& #upgradableRoomCategoriesIds': {
                        padding: '13.5px 14px !important', // Adjust the padding as needed
                    },
                }}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={{
                    PaperProps: {
                        onScroll: handleSelectPagination,
                    },
                    sx: {
                        maxHeight: 300,
                        '&.MuiInputBase-root': {
                            border: 'none', // Remove border on input focus
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'transparent', // Remove background on input focus
                        },
                        '&:hover': {
                            backgroundColor: 'transparent', // Remove background on input hover
                        },
                        '.MuiMenu-paper': {
                            minWidth: { xs: 'calc(100vw - 30px) !important', sm: "365px !important"}
                        }
                    },
                }}
            >
                {/* Placeholder MenuItem */}
                <MenuItem value="" disabled>
                    <em>{placeholder || "placeholder"}</em>
                </MenuItem>
                {categories?.map((room) => (
                    <MenuItem key={room._id} value={room._id || room}>
                        <Checkbox
                            checked={isMultiple ? !!value?.includes(room?._id || room?.value) : value === (room?._id || room?.label)}
                        />
                        <ListItemText primary={room.title || room?.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectMenuInput;
