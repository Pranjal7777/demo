import React, { useEffect, useState } from "react";

import * as config from "../lib/config";
import useLang from "../hooks/language";

import { verifyEmail, checkValidateLink } from "../services/auth";
import { startLoader, stopLoader } from "../lib/global";
import { VerifyEmailPayload } from "../lib/data-modeling";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";

function VerifyEmail(props) {
  const { query } = props;
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState("");

  const [lang] = useLang();

  // useEffect(() => {
  // let payload = { ...VerifyEmailPayload };
  // payload.token = query.token;

  // startLoader();

  // checkValidateLink(query.token)
  //   .then(() => {
  //     verifyEmail(payload)
  //       .then(async (res) => {
  //         if (res.status === 200) {
  //           stopLoader();
  //           setLoading(false);
  //           // console.log(res);
  //           setShowMessage(res.data.message);
  //         }
  //       })
  //       .catch(async (err) => {
  //         if (err.response) {
  //           stopLoader();
  //           setLoading(false);
  //           setShowMessage(err.response.data.message);
  //           console.error(err.response.data.message);
  //         }
  //         console.error(err);
  //       });
  //   })
  //   .catch((err) => {
  //     stopLoader();
  //     setLoading(false);
  //     setShowMessage(err.response.data.message);
  //   });
  //calling verifyEmail api
  // }, []);

  return (
    <div className="wrap">
      <CustomHead {...props.seoSettingData}></CustomHead>
      <div
        className="scr"
        style={{ backgroundImage: `url(${config.BG_VERIFYEMAIL_SCREEN})` }}
      >
        <div className="row mx-0 justify-content-center align-items-center vh-100">
          {loading ? null : (
            <div className="col-12">
              <h4 className="titleH4 mb-5 text-center txt-book">
                {showMessage}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

VerifyEmail.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  return { query: query };
};

export default VerifyEmail;
