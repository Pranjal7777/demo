import * as React from 'react';
import FilterOption from '../../filterOption/filterOption';

const filterList = [
    {
        title: "NEWEST",
        value: -1
    },
    {
        title: "OLDEST",
        value: 1
    }
]

export const FiltersListComponent = ({ handleClick }) => {
    return (
        <div>
            <FilterOption setSelectedValue={(value) => handleClick(value)} filterList={filterList} leftFilterShow />
        </div>
    );
};

export const renderFiltersList = ({ handleChange, selectedValue }) => {
    return <FiltersListComponent handleClick={handleChange} selectedValue={selectedValue} />
}