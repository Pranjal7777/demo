import React, { useState } from 'react';
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { PROFILE_INACTIVE_ICON, Wallet_Icon } from '../../lib/config';
import { createTheme } from '@material-ui/core/styles'
import { height } from '@mui/system';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        textAlign: 'center',
        margin: 'auto',
        boxShadow: 'none !important',
        borderRadius: 'none',
        padding: '0px 0px',
        background: `var(--l_app_bg)`,
    },
    accordion: {
        textAlign: 'center',
        margin: 'auto',
        boxShadow: 'none !important',
        borderRadius: 'none',
        background: `var(--l_app_bg) !important`
    },
    accordionSummary: {
        width: '100%',
        boxShadow: 'none !important',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        width: "100%",
        textAlign: "left",
        marginLeft: "20px",
        fontSize: '30px'
    },
}));

export default function InsightAccordian({
    title,
    details,
    theme,
    defaultExpanded,
    isExpanded,
    accordId = '',
    handleToggle = () => true,
    ...props
}) {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(defaultExpanded)

    return (
        <div className={`${classes.root} insAccord mb-3`}>
            <Accordion expanded={expanded} defaultExpanded={defaultExpanded} className={classes.accordion} style={{ textAlign: 'center', margin: 'auto', boxShadow: 'none !important', borderRadius: 'none' }}>
                <AccordionSummary
                    onClick={() => setExpanded(!expanded)}
                    style={{ width: '100%', boxShadow: 'none !important', }}
                    className='insightAccordContent'
                    expandIcon={<ExpandMoreIcon className='exapnd' />}
                    aria-controls="insightAccordContent"
                    id={accordId}
                >
                    <div className='accordTitle w-100 py-3 pl-3'>{title}</div>
                </AccordionSummary>
                {
                    details ?
                        <AccordionDetails className={`accordDetails w-100 p-0`}>
                            {details}
                        </AccordionDetails>
                        : " "
                }
            </Accordion>
            <style jsx>
                {`
            :global(.insAccord .MuiAccordion-root) {
              background: inherit !important;
            }
            :global(.insAccord .MuiAccordionSummary-expandIcon) {
                color: ${theme.type === "light" ? "#000" : '#fff'} !important;
            }
            :global(.insAccord .MuiAccordionSummary-root) {
                padding: 0px 0px;
            }
            :global(.insAccord .MuiAccordionSummary-content) {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 !important;
            }
            :global(.insAccord .MuiAccordionDetails-root) {
                display: flex;
                align-items: center;
            }
            :global(.insAccord .MuiCollapse-wrapperInner) {
              background: inherit !important;
              width: 100% !important;
              padding: 0 !important;
            }
            :global(.insAccord .MuiCollapse-wrapperInner > div) {
                width: 100%;
            }
            :global(.insAccord .MuiCollapse-entered) {
                margin: 0 !important
            }
            :global(.insAccord .MuiAccordionSummary-root) {
                border: 1px solid var(--l_border);
                border-radius: 20px;
            }
            
            :global(.insAccord .MuiAccordionSummary-root.Mui-expanded) {
                background-color: var(--l_grayf6);
                border-color: var(--l_grayf6);
            }
            :global(.insAccord .MuiCollapse-root) {
                margin: 0 !important
            }
          `}
            </style>
        </div >
    );
}