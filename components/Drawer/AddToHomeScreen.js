import React from 'react'
import * as env from "../../lib/config";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import useLang from '../../hooks/language';
import Button from "../button/button";

export default function AddToHomeScreen(props) {
    const theme = useTheme();
    const [lang] = useLang();

    return (
        <div className="addToHomeScreen pt-5 vh-100">
            <div className="pt-5 mt-3 px-3 content">
                <h6 className="fntSz18 txt-heavy txt_whiteClr">{`Add ${env.APP_NAME} shortcut`}</h6>
                <p className="txt-roboto fntSz14 dv_primary_color">
                    Click{" "}
                    <Icon
                        icon={`${env.MORE_ICON}#more_icon`}
                        color={theme.palette.white}
                        size={18}
                        unit="px"
                        viewBox="0 0 4.584 20"
                        class="d-inline"
                    />
                    {lang.addToHomeScreenMsg}
                </p>
                <Button
                    type="submit"
                    cssStyles={theme.whiteButton}
                    onClick={() => {
                        props.handleCreateEvent()
                        props.onClose()
                    }
                    }
                    fclassname="radius03 widthContent"
                >
                    {lang.gotIt}
                </Button>
            </div>
        </div>
    )
}
