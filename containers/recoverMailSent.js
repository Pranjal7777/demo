import React from "react";

function RecoverMailSent() {
  // console.log("inside MSG BOX");
  return (
    <div
      className="modal btmModal animate__animated animate__fadeInUp animate__faster"
      id="btmModal"
    >
      <div className="modal-dialog">
        <div className="modal-content pt-5 pb-4">
          <div className="col-12 w-330 mx-auto">
            <h5 className="mb-3">Reset link sent</h5>
            <div className="txt-book fntSz16">
              Please check the mail inbox for the password reset link
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RecoverMailSent;
