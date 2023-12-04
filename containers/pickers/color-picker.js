import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = (props) => {

    const [background, setBackground] = useState('');

    const {
        setBgColor,
        ...otherPorps
    } = props;

    const handleChangeComplete = (color) => {
        setBackground(color.hex)
        // this.setState({ background: color.hex });
        setBgColor(color.hex)
    };

    return (
        <SketchPicker
            color={background}
            onChangeComplete={handleChangeComplete}
        />
    );
}

export default ColorPicker;