import * as React from 'react';
import CustomDataLoader from '../../components/loader/custom-data-loading';
export const DialogLoading = () => {
    return (
        <div className='d-flex align-items-center justify-content-center py-4'>
            <CustomDataLoader isLoading={true}/>
        </div>
    );
};