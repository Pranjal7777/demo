import dynamic from "next/dynamic";
import React from "react";
import useLang from "../../hooks/language";
const Collection = dynamic(() => import("../Drawer/collection"), { ssr: false });

const DvCollection = (props) => {
  const [lang] = useLang();
  const { title = lang.addNewCollection } = props;

  return (
    <div style={{ width: 480, overflow: history, margin: "0 auto" }}>
      <button
        type="button"
        className="close dv__modal_close"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>
      <div>
        <Collection {...props} />
      </div>
    </div>
  );
};

export default DvCollection;
