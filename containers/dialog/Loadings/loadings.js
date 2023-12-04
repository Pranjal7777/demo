import React from "react";
import { WHITE } from "../../../lib/config";
import Loader from "../../../components/ui/loader/chatLoader";

const SuccessOnly = (props) => {
  return (
    <div className={`success-dialogs`}>
      <div className="d-flex flex-column align-items-center">
        <div className={`payment-successfull mb-3`}>
            <div className={`mt-0 `}>
              <Loader
              className="m-0"
              loading={true}
              size={15}
              color={WHITE}
            ></Loader>
            </div>

        </div>
      </div>
      <style jsx>{`
        :global(.success-dialog-button) {
          font-size: 0.7rem;
          width: 104px;
          padding: 7px;
          margin-top: 12px;
          color: white;
        }
        :global(.view-dialog-close) {
          position: absolute;
          height: 33px;
          right: 10px;
          cursor: pointer;
          z-index: 3;
          top: 10px;
        }
        .payment-successfull {
          // margin-top: 15px;
          text-align: center;
          padding: 0px 14px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .success-dialogs {
          // height: 396px;
          // display: flex;
          // justify-content: center;
          // align-items: center;
          // width: 280px;
          // max-width: 280px;
        }
        :global(.check-icon) {
          width: 79px;
        }
      `}</style>
    </div>
  );
};

export default SuccessOnly;
