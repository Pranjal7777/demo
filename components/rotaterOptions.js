import React, { useState } from 'react'
import Button from './button/button';
import Icon from './image/icon';
import { CLOSE_ICON_WHITE_IMG } from '../lib/config';
import { cross_icon_call, plus_icon_call } from '../lib/config/logo';

/**
 * @description you can use as select tag.
 * @author Pranjal k
 * @date 28/08/2023
 */

const RotaterOptions = (props) => {
    const { filterList, leftFilterShow, rightFilterShow } = props;
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterOption, setFilterOption] = useState("");
    const [selectedOption, setSelectedOption] = useState("");


    const handleFilterOpen = (data) => {
        setFilterOpen(!filterOpen)
        if (data) {
            setFilterOption(data);
            setSelectedOption(data);
        }
    }

    return (
        <>
            {filterOpen && <div className="w-100 vh-100 position-fixed" style={{ top: "0px", left: "0px", zIndex: "9" }} onClick={() => handleFilterOpen()}></div>}
            <div className="position-relative pointer" style={{ zIndex: "10" }}>
                <div className='d-flex flex-row'>
                    {leftFilterShow && selectedOption && <div className='mr-3'>
                        <Button
                            type="button"
                            fclassname="gradient_bg rounded-pill py-1 pl-3 pr-2"
                        >
                            {selectedOption}
                            <span className='ml-2' onClick={() => { setFilterOption(""), setSelectedOption("") }}>
                                <Icon
                                    icon={`${CLOSE_ICON_WHITE_IMG}#close-white`}
                                    color="var(--l_app_text)"
                                    width={12}
                                    height={12}
                                    viewBox="0 0 12 12"
                                />
                            </span>
                        </Button>
                    </div>}
                    <div className='cursorPtr pl-2' onClick={() => handleFilterOpen()}>
                        {filterOpen ? <img src={cross_icon_call} alt="cross_icon" /> : <img src={plus_icon_call} alt="plus_icon" />}
                    </div   >
                    {rightFilterShow && selectedOption && <div className='ml-3'>
                        <Button
                            type="button"
                            fclassname="gradient_bg rounded-pill py-1 px-3"
                        >
                            {selectedOption}
                            <span className='ml-3' onClick={() => { setFilterOption(""), setSelectedOption("") }}>
                                <Icon
                                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                                    color="var(--l_app_text)"
                                    width={12}
                                    height={12}
                                    viewBox="0 0 12 12"
                                />
                            </span>
                        </Button>
                    </div>}
                </div>
                {filterOpen && <div className="position-absolute specific_section_bg py-2 radius_8 cursorPtr borderStroke d-flex flex-column" style={{ top: "-117px", right: "-11px", zIndex: "999", boxShadow: "2px 3px 10px 1px var(--l_drawer)", width: "177px", gap: "10px" }}>
                    {filterList?.map((item, index) => {
                        return (
                            <div onClick={() => {
                                item.onClick()
                                setFilterOpen(false)
                            }}>
                                <div className={'d-flex align-items-center justify-content-around w-100'} key={index} >
                                    <div>{item.title}</div>
                                    <div className='iconDiv'>{
                                        <Icon
                                            icon={`${item.iconDetails.icon}#${item.iconDetails.id}`}
                                            size={item.iconDetails.size}
                                            class="pointer adjustSvg"
                                            alt="follow icon"
                                            viewBox={item.viewBox}
                                            color="var(--l_app_text)"
                                        />
                                    }</div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
            <style jsx>{`
    .iconDiv{
    padding: 5px;
    background: var(--l_app_bg);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    `}
            </style>
        </>
    )
}

export default RotaterOptions