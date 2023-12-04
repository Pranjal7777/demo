import React, { useState } from "react";
import { useTheme } from 'react-jss';
import * as config from "../../../lib/config";
import Icon from "../../../components/image/icon";
import isMobile from "../../../hooks/isMobile";

const daySlotTile = ({ slotData = {}, selectedSlots = {}, setSelectedSlots }) => {
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [slotsDuration, setSelectSlotDurations] = useState([]);

    const selectBetweenSlots = (slotArr = []) => {
        const lengthOfSelectedSlots = slotArr.filter(item => item.checked).length;
        if (lengthOfSelectedSlots <= 1) return slotArr;
        let selected = false;
        const startItemIndex = slotArr.findIndex(item => item.checked);
        const lastItemIndex = slotArr.findLastIndex((item) => item.checked);
        const disabledSlotIndex = slotArr.findIndex((item, index) => item.status === 2 && index > startItemIndex && index < lastItemIndex);
        const indexToStop = disabledSlotIndex === -1 ? lastItemIndex : disabledSlotIndex;
        const finalArr = slotArr.map((item, index) => {
            if (item.checked) selected = true;
            if (selected && index < indexToStop && !item.checked){
                setSelectedSlots((prevSlots) => {
                    const selectedNewSlots = {...prevSlots};
                    selectedNewSlots[item.slotId] = { startTime: item.startTime, endTime: item.endTime };
                    return selectedNewSlots;
                })
                return {...item, checked: true};
            } else if (indexToStop !== lastItemIndex && index > indexToStop && index <= lastItemIndex) {
                setSelectedSlots((prevSlots) => {
                    const selectedNewSlots = {...prevSlots};
                    delete selectedNewSlots[item.slotId];
                    return selectedNewSlots;
                })
                return {...item, checked: false};
            } else return item;
        });
        return finalArr;
    }
    
    const selectRepeatDays = (event, slotInfo) => {
        event.persist();
        event.preventDefault();
        setTimeout(() => {
            const stateChange = slotsDuration.map((item) => {
                if (item.slotId === slotInfo.slotId) {
                    if (selectedSlots[slotInfo.slotId] && item.checked) {
                        const selectedNewSlots = {...selectedSlots};
                        delete selectedNewSlots[slotInfo.slotId];
                        setSelectedSlots(selectedNewSlots);
                    } else {
                        const selectedNewSlots = {...selectedSlots};
                        selectedNewSlots[slotInfo.slotId] = { startTime: slotInfo.startTime, endTime: slotInfo.endTime };
                        setSelectedSlots(selectedNewSlots);
                    }
                    return {...item, checked: !item.checked}
                } else return item;
            });
            setSelectSlotDurations(selectBetweenSlots(stateChange));
        }, 100);
    };
    
    React.useEffect(() => {
        const slotsDurationMapping = slotData.slots.length ? slotData.slots.map((item, i) => ({ name: `${item.startTime} - ${item.endTime}`, slotId: `${item.startTime} - ${item.endTime}`, checked: false, startTime: item.startTime, endTime: item.endTime, status: item.status }))  : [];
        setSelectSlotDurations(slotsDurationMapping);
    }, [slotData]);

    return (
    <>
    <div className="px-3 py-2">
        <div className="d-flex align-items-center">
            <div className="px-1">
                <Icon
                    icon={`${config.SUNRISE_ICON}#sunrise_icon`}
                    color={theme.type === "light" ? "#3a3a3a" : "#fff"}
                    width="15"
                    height="15"
                    viewBox="0 0 13.895 15.438"
                    class="d-flex align-items-center"
                />    
            </div>
            <div className="px-1 txt-heavy fntSz13">{slotData.time}</div>
            <div className="px-1 liteColorTxt fntSz9">| {slotData.slots.length} Slots</div>
        </div>
        <div className="row m-0 pt-2 radio-toolbar">
            {slotsDuration.map((day) => (
                <div key={day.slotId} className={`p-2 ${mobileView ? 'col-6' : 'col-6'} day__CheckBox`}>
                    <input type="checkbox" id={`checkbox${day.slotId}`} name="checkboxDays" value={day.slotId} checked={day.checked} onChange={(event) => day.status !== 2 && selectRepeatDays(event, day)} />
                    <label htmlFor={`checkbox${day.slotId}`} className={`shift_timing  p-2 w-100 fntSz13 text-center text-uppercase ${day.status === 2 ? 'disabled__slot' : day.status === 1 ? "pointer" : ''}`} onChange={(event) => day.status !== 2 && selectRepeatDays(event, day)}>{day.name}</label>
                </div>
            ))}
        </div>
    </div>
    <style jsx="true">
        {`
        .disabled__slot {
            // background-color: black;
            // opacity: 0.5;
            color:  ${theme.type === "light" ? "#c2bccdeb" : "#4C4755"};
        }
        .shift_timing{
            border-radius: 2px;
            background: ${theme.type === "light" ? "#f2f2f2" : "#1E1C22"};
        }
        .radio-toolbar input[type="radio"] {
            opacity: 0;
            position: fixed;
            width: 146px;
            height: 47px;
            cursor: pointer;
        }
        .radio-toolbar input[type="radio"]:checked + label {
            background-color: #FCFCFF;
            border-color: #FF8F00;
            color: blue;
            cursor:pointer;
        }
        .radio-toolbar input[type="checkbox"] {
            opacity: 0;
            position: fixed;
            width: 0;
          }
        .radio-toolbar input[type="checkbox"]:checked + label {
            background: var(--l_base);
            color: #fff;
            cursor:pointer;
        }
        `}
    </style>
    </>);
};

export default daySlotTile;
