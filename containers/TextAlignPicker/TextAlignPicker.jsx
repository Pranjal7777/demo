import React, { useEffect, useState } from 'react';
const textStyle = ['left', 'center', 'right']

function TextStylePicker(props) {
    const [fontIndex, setFontIndex] = useState(textStyle.indexOf(props.font) >= 0 ? textStyle.indexOf(props.font) : 0)

    useEffect(() => {
        let activeEle = document.getElementById('activContain');
        activeEle.scrollLeft = textStyle.indexOf(props.font) * 3;
        handleSelectFont(textStyle[fontIndex], fontIndex)
    }, [])

    const handleSelectFont = (item, index) => {
        console.log(item, index, "jsodaojddojo")
        props.setTextAlign(item)
        setFontIndex(index)
        let activeEle = document.getElementById('activContain');
        activeEle.scrollLeft = index * 3;
    }

    return (
        <div className='font__style' id='activContain'>
            {
                textStyle.map((item, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => handleSelectFont(item, index)}
                            id={`${fontIndex === index ? 'active' : ''}`}
                            className={`ml-1 mr-1 mb-0 pb-0 ${fontIndex === index ? 'active' : 'inactive'}`}
                            style={{
                                fontFamily: `${item}`
                            }}>
                            {item}
                        </div>
                    )
                })
            }
            <style jsx>
                {`
                    .font__style {
                        width: ${props.mobileView ? '250px' : '30vw'};
                        margin-right: ${props.mobileView ? '-14vw' : '0vw'};
                        overflow-x: scroll;
                        display: flex;
                    }
                    .active {
                        background: #000;
                        padding: 2px 5px;
                        border-radius: 50%;
                        width: fit-content;
                        color: #fff;
                        height: 28px;
                        cursor: pointer;
                    }
                    .inactive {
                        padding: 2px 5px;
                        border-radius: 50%;
                        width: fit-content;
                        height: 28px;
                        cursor: pointer;
                    }
                    ::-webkit-scrollbar {
                        width: 20px !important;
                        height: 0.1px !important;
                        background: transparent !important;
                      }
                      ::-webkit-scrollbar-track {
                        border-radius: 10px !important;
                      }
                      ::-webkit-scrollbar-thumb {
                        background: transparent !important; 
                        border-radius: 10px !important;
                      }
                      ::-webkit-scrollbar-thumb {
                        background: transparent !important; 
                      }
                `}
            </style>
        </div>
    )
}

export default TextStylePicker