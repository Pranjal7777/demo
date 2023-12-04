import { IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useProfileData from '../../../hooks/useProfileData';
import { close_drawer, open_drawer } from '../../../lib/global';

const AddBulkMessage = (props) => {
  const [profileData] = useProfileData();

  const handleAddBulkMsg = () => {
    if (!(profileData && [5, 6].includes(profileData.statusCode))) {
          open_drawer("bulkMessage", {
            close: () => close_drawer("bulkMessage"),
            onSuccess: props.onSuccess,
          }, "right")
        }
  }

  return (
    <>
      <div className="">
        <div onClick={handleAddBulkMsg}
          className="p-0"
        >
          <AddCircleIcon className="bulk__message__card add_icon" color="primary" fontSize="large" />
        </div>
      </div>
      <style jsx>
        {`
          :global(.add_icon) {
            font-size: 1.8rem!important;
            color: var(--l_base)!important;
            border-radius: 50%;
            margin-top: -3px;
          }
        `}
      </style>
    </>
  )
}

export default AddBulkMessage;
