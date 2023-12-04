import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isMobile from '../../hooks/isMobile';
import { setSelectedSoltExtendStream } from '../../redux/actions/extendVideoStream';

const extensionSlots = (props) => {
  const { slotArray = [], } = props;
  const [mobileView] = isMobile();
  const selectedSlot = useSelector((state) => state?.setSelectedSlot);
  const dispatch = useDispatch()
  return (
    <>
    <div className="mb-3 col-12 px-0 d-flex justify-content-center">
        {slotArray.map((slot) => (
            <div key={slot.value} className={mobileView ? "col-4 px-1" : "col-3 px-1"}>
            <div className={`slot__design d-flex flex-column justify-content-between py-3 cursorPtr ${selectedSlot?.value === slot.value ? 'slot__selected' : ''}`} onClick={() => dispatch(setSelectedSoltExtendStream(slot))}>
                <span className="txt-black fntSz14 text-center">{slot.extensionDuration}</span>
                <span className="txt-heavy fntSz12 text-center">${slot.extensionCharges}</span>
                </div>
            </div>
        ))}
    </div>
    <style jsx="true">
    {`
    .slot__design {
        border: 1px solid var(--l_lightgrey_bg); 
        box-shadow: 0px 3px 6px #6f6f6f21;
    }
    .slot__selected {
        background-color: var(--l_base);
        color: var(--l_white);
    }
    `}
    </style>
    </>
  )
}

export default extensionSlots;