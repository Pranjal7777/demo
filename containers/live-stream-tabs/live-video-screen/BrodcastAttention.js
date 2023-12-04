import * as React from 'react';
import Button from '../../../components/button/button';
import { useTheme } from 'react-jss';
import { Fade } from 'react-reveal';
import useLang from '../../../hooks/language';

const BrodcastAttention = ({handleClose}) => {
    const theme = useTheme()
    const [lang] = useLang()
    return (
        <Fade bottom>
        <div className='p-4 stream-attention'>
            <p className='dv_appTxtClr'>{lang.streamNote}</p>
            <div className='d-flex justify-content-end'>
                <Button cssStyles={theme?.dv_blueButton} fclassname='okBtn dv_appTxtClr' onClick={() => handleClose()}>
                   {lang.gotIt}
                </Button>
            </div>
            <style jsx>
                {
                    `
                    .stream-attention {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        background: var(--l_app_bg);
                        z-index: 10;
                      }
                     :global(.okBtn){
                        width: auto;
                        font-size: 16px !important;
                        padding: 5px 10px!important;
                        border-radius: 10px!important;
                     }
                     :global(.okBtn span){
                        font-size: 14px !important;
                     }
                     :global(.MuiPaper-root) {
                        background: tansparent
                     }
                    `
                }
            </style>
        </div>
        </Fade>
    );
};

export default BrodcastAttention