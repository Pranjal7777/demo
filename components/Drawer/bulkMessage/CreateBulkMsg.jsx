// @flow 
import * as React from 'react';

const CreateBulkMsg = ({ handleCreateBulkMessage, handleClose }) => {
    React.useEffect(() => {
        handleCreateBulkMessage(handleClose)
    }, [])
    return (
        <div>
            Please wait...
        </div>
    );
};

export default CreateBulkMsg