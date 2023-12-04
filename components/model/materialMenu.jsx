import React from 'react'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";

const MaterialMenu = (props) => {
    const { anchorEl, setAnchorEl, theme, handleChange } = props

    return <Menu
        elevation={2}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        id="fade-menu"
        TransitionComponent={Fade}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        PaperProps={{
            style: {
                backgroundColor: "var(--l_profileCard_bgColor)",
                borderRadius: "8px",
                color: "var(--l_app_text)",
                boxShadow: "0px 3px 20px var(--l_boxshadow)",
                padding: "4px"
            },
        }}
        onClose={() => {
            setAnchorEl(null);
            props.handleOpenMenu && props.handleOpenMenu(false);
        }}
    >
        {props.items.map((data, index) => (
            <MenuItem
                onClick={() => handleChange(index)}
                style={{ background: theme.palette.l_profileCard_bgColor }}
                key={index}
            >
                {data.label}
            </MenuItem>
        ))}
        <style jsx>{`
            :global(.MuiPaper-elevation2) {
                box-shadow: 0px 3px 20px var(--l_boxshadow) !important;
            }
        `}</style>
    </Menu>
}

export default MaterialMenu