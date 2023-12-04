import React from "react";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import {SEARCHBAR_ICON} from "../../lib/config";
const SearchInput = () => {
    const theme = useTheme()
    return (
        <div className="col-12">
            <form>
                <div className="form-group">
                    <div className="position-relative">
                        <input type="text" className="form-control ipt__brod ipt__selTag" placeholder="Search" />
                        <Icon
                            icon={`${SEARCHBAR_ICON}#searchBar`}
                            color={theme.type == "light" ? "#4e586e" : theme.text}
                            width={22}
                            height={22}
                            class="setRtMid"
                            viewBox="0 0 511.999 511.999"
                        />
                    </div>
                </div>
            </form>
            <style jsx>
                {`
                    .lbl__brod{
                        color: #666666;
                        font-size: 12px;
                        font-family: 'Roboto', sans-serif !important;
                    }

                    .ipt__brod{
                        background-color: #DBDBDB;
                        border-radius: 20px;
                        border-color: #DBDBDB;
                    }
                    .ipt__brod::placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        opacity: 0.7 !important;

                    }
                    
                    .ipt__brod:-ms-input-placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        opacity: 0.7 !important;
                    }
                    
                    .ipt__brod::-ms-input-placeholder {
                        color: #A5A5A5 !important;
                        font-size: 15px !important;
                        font-family: 'Roboto', sans-serif !important;
                        opacity: 0.7 !important;
                    }

                    .ipt__selTag{
                        border-radius: .25rem !important;
                    }

                    .setRtMid{
                        position: absolute;
                        z-index: 1;
                        cursor: pointer;
                        right: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    
                `}
            </style>
        </div>

    );
};
export default SearchInput;
