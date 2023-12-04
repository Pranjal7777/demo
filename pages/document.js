import dynamic from "next/dynamic";
import React from "react";
import Head from "next/head";
import { returnLogin } from "../lib/global";
import { getCookiees } from "../lib/session";
import CustomHead from "../components/html/head";
import { returnHome } from "../lib/global/routeAuth";
const Document = dynamic(() => import("../containers/document/document"), { ssr: false });

const DocumentMain = (props) => {
  return (
    <>
    <Head>
      <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
    </Head>
    <div className="wrap">
      <CustomHead {...props.seoSettingData}></CustomHead>
      <Document />
    </div>
    </>
  );
};

DocumentMain.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx;

  const auth = getCookiees("auth", req);
  const uid = getCookiees("uid", req);
  returnHome(req, res);
  if (!uid) return returnLogin(req, res);
  return {};
};
export default DocumentMain;
