import React, { useEffect, useState } from 'react';
const fontStyle = ['Dancing Script', 'Pacifico', 'Roboto', 'cursive', 'Abril Fatface', 'Carter One', 'Cookie', 'Kaushan Script', 'Permanent Marker', 'Rampart One' ]

function FontStylePicker(props) {
    const [fontIndex, setFontIndex] = useState(fontStyle.indexOf(props.font) >= 0 ? fontStyle.indexOf(props.font) : 0)

    useEffect(() => {
        let activeEle = document.getElementById('activContain');
        activeEle.scrollLeft = fontStyle.indexOf(props.font) * 13;
        handleSelectFont(fontStyle[fontIndex], fontIndex)
    }, [])

    const handleSelectFont = (item, index) => {
        props.setFont(item)
        setFontIndex(index)
        let activeEle = document.getElementById('activContain');
        activeEle.scrollLeft = index * 13;
    }

    return (
        <div className='font__style' id='activContain'>
            {
                fontStyle.map((item, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => handleSelectFont(item, index)}
                            id={`${fontIndex === index ? 'active' : ''}`}
                            className={`ml-1 mr-1 mb-0 pb-0 ${fontIndex === index ? 'active' : 'inactive'}`}
                            style={{
                                fontFamily: `${item}`
                            }}>
                            Aa
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
                        width: 30px;
                        color: #fff;
                        height: 30px;
                        cursor: pointer;
                    }
                    .inactive {
                        padding: 2px 5px;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
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

export default FontStylePicker