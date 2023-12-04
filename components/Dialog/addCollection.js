import dynamic from "next/dynamic";
import React from "react";
import useLang from "../../hooks/language";
import * as config from "../../lib/config";
const NewCollection = dynamic(() => import("../Drawer/newCollection"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });

const DvAddCollections = (props) => {
  const [lang] = useLang();
  const { title = lang.addNewCollection } = props;
  return (
    <div style={{ width: 450 }}>
      <button
        type="button"
        className="close dv__modal_close"
        onClick={() => props.onClose()}
      >
        {lang.btnX}
      </button>
      <div className="col-12 px-5 p-2 dv__black_color ">
        <h5 className="content_heading px-1 py-2 text-center m-0">{title}</h5>
        <NewCollection {...props}></NewCollection>
      </div>
      <style jsx>{`
 :global(.newCollection) {
  min-width: 300px !important;
}
`}
      </style>
    </div>
  );
};

export default DvAddCollections;
