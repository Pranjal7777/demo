// import moment from "moment";
// import React from "react";
// import isMobile from "../../../hooks/isMobile";
// import { CLOSE_ICON_BLACK } from "../../../lib/config";

// const scheduleStreamDrawer = (props) => {
//   const [mobileView] = isMobile();
//   const { onClose, setScheduleTime } = props;
//   const [scheduleDate, setScheduleDate] = React.useState(moment().add(1, 'days'));

//   const handleScheduleChange = (dateObj) => {
//     setScheduleDate(dateObj.target?.value);
//   };

//   const handleConfirm = () => {
//     setScheduleTime(moment(scheduleDate).unix());
//     onClose();
//   };

//   return (
//    <>
//     <div className="p-3 position-relative">
//       {!mobileView && <img
//           src={CLOSE_ICON_BLACK}
//           width="15"
//           height="15"
//           alt="Close Icon"
//           className="close_option cursor-pointer"
//           onClick={onClose}
//       />}
//       <div className="text-center txt-black fntSz18 schedule_color">Schedule</div>
//       {scheduleDate && <div className="txt-heavy text-center schedule_color schedule_date py-2 my-2 fntSz18 text-uppercase">{moment(scheduleDate).format('ddd, MMM DD h:mm a')}</div>}
//     <label for="scheduletimepicker">Schedule Time:</label>
//     <input type="datetime-local" id="scheduletimepicker" onChange={handleScheduleChange} name="scheduletimepicker" />
//     <button onClick={handleConfirm} className="btn mt-3 scheduleConfirmBtn txt-black w-100 text-white">Confirm</button>
//     </div>
//     <style jsx="true">
//       {
//       `
//       .schedule_color {
//         color: #242A4B;
//       }
//       .scheduleConfirmBtn {
//         background-color: var(--l_base);
//         border-radius: 30px;
//         padding: 12px;
//       }
//       .schedule_date {
//         border-top: 1px solid #EDEDED;
//         border-bottom: 1px solid #EDEDED;
//       }
//       .close_option{
//         position: absolute;
//         top: 1.5rem;
//         right: 1rem;
//       }
//       `
//       }
//     </style>
//    </>
//   )
// }

// export default scheduleStreamDrawer;
