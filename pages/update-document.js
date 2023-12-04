import dynamic from "next/dynamic";
import React from "react";
import CustomHead from "../components/html/head";
const Document = dynamic(()=>import("../containers/document/document"),{ssr:false});

function UploadDocument() {
  return (
    <div className="wrap">
      <CustomHead {...props.seoSettingData}></CustomHead>
      <Document />
    </div>
  );
}
export default UploadDocument;
