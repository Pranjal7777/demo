import React from "react"
import ThemeContext from "../context/themeContext"

const useTheme = () => {
    const theme = React.useContext(ThemeContext);
    return [theme]
}

export default useTheme;