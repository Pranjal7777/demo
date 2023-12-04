import React, { useEffect, useState } from 'react'
import FilterListIcon from "@material-ui/icons/FilterList";
import Button from '../button/button';
import { CLOSE_ICON_WHITE } from '../../lib/config/logo';
import Icon from '../image/icon';
import isMobile from '../../hooks/isMobile';
import Image from '../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../lib/config';
import { useTheme } from 'react-jss';
import { Drawer } from '@mui/material';

/**
 * @description you can show filter with just pass leftFilterShow or rightFilterShow.
 * @author kashinath
 * @date 10/08/2023
 */

const FilterOption = ({ filterList, leftFilterShow, rightFilterShow, defaultSelected, setSelectedValue = () => { return }, ...props }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterOption, setFilterOption] = useState("");
    const [selectedOption, setSelectedOption] = useState(defaultSelected || "");
    const [mobileView] = isMobile()
    const theme = useTheme()


    const handleFilterOpen = (item) => {
        setFilterOpen(!filterOpen)
        if (item) {
            setFilterOption(item?.tab || item?.title || item?.label);
            setSelectedOption(item?.tab || item?.title || item?.label);
            if (item?.label) {
                setSelectedValue(item);
            } else {
                setSelectedValue(item?.value);
            }
        }
    }

    const handleFilterRemove = () => {
        setFilterOption("");
        setSelectedOption("")
        setSelectedValue(0)
    }

    useEffect(() => {
        return () => setSelectedValue(0);
    }, [])

    const renderFilterOption = (filterList) => {
        return (filterOpen && <div className={`${mobileView ? 'filterList cursorPtr specific_section_bg pb-4 pt-2' : 'position-absolute specific_section_bg py-1 radius_8 cursorPtr borderStroke'}`} style={{ top: "30px", right: "0px", zIndex: "999", boxShadow: "2px 3px 10px 1px var(--l_drawer)" }}>
            {filterList?.map((item, index) => {
                return (
                    <div className={`fItem dv_appTxtClr py-2 px-3 text-nowrap ${filterList?.length - 1 > index && "borderBtm"} ${filterOption === (item?.tab || item?.title || item?.label) && "gradient_text"}`} onClick={() => handleFilterOpen(item)}>
                        {item?.title || item?.label}
                    </div>
                )
            })}
            <style jsx>
                {`
                .filterList {
                   position: ${mobileView ? 'static' : 'absolute'};
                }
                .filterList .fItem{
                    text-align: center;
                }
                `}
            </style>
        </div>)
    }

    return (
        <>
            {filterOpen && <div className="w-100 vh-100 position-fixed" style={{ top: "0px", left: "0px", zIndex: "9" }} onClick={() => handleFilterOpen()}></div>}
            <div className="position-relative">
                <div className='d-flex flex-row'>
                    {leftFilterShow && selectedOption && <div className='mr-2'>
                        <Button
                            type="button"
                            fixedBtnClass={"active"}
                            fclassname="text-nowrap headerBtnPadding"
                        >
                            {selectedOption}
                            <span className='ml-2' onClick={handleFilterRemove}>
                                <Icon
                                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                                    color="#fff"
                                    width={11}
                                    height={11}
                                    viewBox="0 0 11 11"
                                />
                            </span>
                        </Button>
                    </div>}
                    <div className='cursorPtr pl-2' onClick={() => handleFilterOpen()}>
                        <FilterListIcon color="var(--l_app_text)" />
                    </div>
                    {rightFilterShow && selectedOption && <div className='ml-3'>
                        <Button
                            type="button"
                            fixedBtnClass={"active"}
                            fclassname="text-nowrap headerBtnPadding"
                        >
                            {selectedOption}
                            <span className='ml-3' onClick={() => { setFilterOption(""), setSelectedOption("") }}>
                                <Icon
                                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                                    color="var(--l_app_text)"
                                    width={11}
                                    height={11}
                                    viewBox="0 0 11 11"
                                />
                            </span>
                        </Button>
                    </div>}
                </div>
                {
                    mobileView ?
                        <Drawer
                            onOpen={() => handleFilterOpen()}
                            onClose={() => handleFilterOpen()}
                            open={filterOpen} anchor='bottom'
                            className='mu-dialog'
                        >
                            <div className="postHeader p-4">
                                <h3 className="mainTitle text-center dv_appTxtClr">Choose Options</h3>
                                <div className='close_icon'>
                                    <Image
                                        src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                                        onClick={() => handleFilterOpen()}
                                        color="white"
                                        width="20"
                                        height="20"
                                        alt="close_icon"
                                        style={{ marginBottom: "4px" }}
                                    />
                                </div>
                            </div>
                            {renderFilterOption(filterList)}
                        </Drawer> : renderFilterOption(filterList)
                }
                <style jsx>
                    {`
                    :global(.mu-dialog .MuiPaper-root,) {
                        background: var(--l_profileCard_bgColor) !important;
                        border-radius: 20px 20px 0px 0px;
                    }
                    :global(.mainTitle) {
                        font-size: ${mobileView ? '1.3rem' : '1.75rem'} !important;
                        font-weight: 500 !important;
                    }
                    .close_icon {
                        top: 0.75rem;
                        right: 1.5rem;
                    }
                    `}
                </style>
            </div>
        </>
    )
}

export default FilterOption