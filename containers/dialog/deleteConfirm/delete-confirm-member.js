import React, { useEffect, useState } from "react";
import useLang from "../../../hooks/language";

const DeleteDialog = (props) => {
    const [lang] = useLang();
    return (
        <div>
            <div className="detete-div text-center">
                <div className="delete-title">
                    <h5 className="content_heading fntSz22 w-700 px-1 py-2 fntSz26 text-center m-0 ">
                        {"Confirm Delete"}
                    </h5>
                </div>
                <div className="delete-desc fntSz16 text-gray w-330 m-auto mt-2">
                    {"Are you sure want to delete members from this list..."}
                </div>
            </div>
            <div className="row w-330 m-auto pb-4 align-items-center">

                <div className="col">
                    <div
                        className=" btn  border-grey button-rounded text-app  w-100"
                        onClick={() => props.cancel?.()}
                    >
                        {lang.cancel}
                    </div>
                </div>
                <div className="col">
                    <div
                        className=" btn button-rounded border-red  w-100"
                        style={{
                            background: "rgba(255, 52, 52, 0.1)",
                            border: '1px solid #FF3434',
                        }}
                        onClick={() => props.delete?.()}
                    >
                        {lang.delete}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DeleteDialog;
