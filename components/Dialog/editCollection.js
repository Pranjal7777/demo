import dynamic from "next/dynamic";
import React from "react";
import useLang from "../../hooks/language";
const EditCollections = dynamic(()=>import("../Drawer/editCollection"),{ssr:false});

const EditCollectionDialog = (props) => {
  const [lang] = useLang();
  return (
    <div style={{ width: 500, overflow: history }}>
      <button
        type="button"
        className="close dv__modal_close"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>
      <div className="col-12 px-4">
        <EditCollections {...props}></EditCollections>
      </div>
    </div>
  );
};

export default EditCollectionDialog;
