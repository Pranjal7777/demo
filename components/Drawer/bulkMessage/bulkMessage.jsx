import React, { useState } from "react";
import useLang from "../../../hooks/language";
import Wrapper from "../../../hoc/Wrapper";
import SelectList from "./MyList";
import CreateBulkMsg from "./CreateBulkMsg";
import { useBulkMessage } from "../../chat/bulkMsg/useBulkMessage";


const SelectUsers = (props) => {
  const bulkMsgListRef = props?.bulkMsgListRef;
  const [lang] = useLang();
  const [activeList, setActiveList] = useState("myLists")
  const { handleCreateBulkMessage, handleSelectedList, selectedLists } = useBulkMessage()

  const ManageComponentList = {
    "myLists": <SelectList
      selectedLists={selectedLists}
      handleSelectedList={handleSelectedList}
      handleCreateBulkMessage={handleCreateBulkMessage}
      setActiveList={(value) => setActiveList(value)}
    />,
    "CreateBulkMsg": <CreateBulkMsg handleClose={() => setActiveList('myLists')} handleCreateBulkMessage={handleCreateBulkMessage} setActiveList={(value) => setActiveList(value)} />,
    "myListMembers": "",
  }

  const pageContent = () => {
    return ManageComponentList[activeList]
  }

  return (
    <Wrapper>
      {pageContent()}
    </Wrapper>
  );
}

export default SelectUsers;
