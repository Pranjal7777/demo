import * as React from 'react';
import CustomDataLoader from '../loader/custom-data-loading';

export const InsightListLoading = ({ count = 4, height = '350px' }) => {
    return (
        <div className='insLoading p-3 d-flex justify-content-center align-items-center'>
            <CustomDataLoader loading={true} />
            <style jsx>
                {
                    `
                 .insLoading {
                    height: ${height}
                  }
                 `
                }
            </style>
        </div>
    );
};