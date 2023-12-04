import React,{ createRef } from 'react';
import Icon from "../../../image/icon"; 
import * as config from "../../../../lib/config";
import { useTheme } from "react-jss";
import Wrapper from '../../../../hoc/Wrapper';
import Calendar from "../../../calender/fullCalender";
const calendarEvents = [
  { 
    title: "Event Now",
    start: new Date()
  }
];
const SetSchedule = (props) => {
    const theme = useTheme();
    const calendarRef = createRef();
    const handleDateClick = (arg) => {
      // bind with an arrow function
      alert(arg.dateStr);
    };
  
    const handleEventClick = (arg) => {
      console.log(arg);
    };
    return (
        <Wrapper>
            <div className='header_section d-flex justify-content-center py-3'>
                <div className='position-fixed back_option'>
                    <Icon
                        icon={`${config.backArrow}#left_back_arrow`}
                        color={theme.type === "light" ? "#000" : "#fff"}
                        width={20}
                        height={25}
                        style={{ marginBottom: "4px" }}
                        alt="close_icon"
                        onClick={() => props.onClose()}
                    />
                </div>
                <div>Video Call Schedule Settings</div>
            </div>
            <div className='px-2 py-3'>
              <Calendar />
                {/* <FullCalendar
                    allDaySlot={true}
                    // businessHours={true}
                    customButtons={{
                    futureDay: {
                        text: 'Future Date',
                        click: () => {
                        const calendarApi = calendarRef?.current?.getApi();

                        let futureDate = new Date('2021-07-30');

                        console.log(futureDate);

                        calendarApi?.gotoDate(futureDate);
                        },
                      },
                    }}
                    dateClick={handleDateClick}
                    editable={true}
                    eventClick={handleEventClick}
                    events={calendarEvents}
                    expandRows={false}
                    droppable={false}
                    eventDrop={(info) => {
                    //<--- see from here
                    const { start, end } = info.oldEvent._instance.range;
                    console.log(start, end);
                    const { start: newStart, end: newEnd } = info.event._instance.range;
                    console.log(newStart, newEnd);
                    if (new Date(start).getDate() === new Date(newStart).getDate()) {
                        info.revert();
                      }
                    }}
                    eventOverlap={false}
                    headerToolbar={{
                      start: 'prev',
                      center: 'title',
                      end: 'next',
                    }}
                    customButtons= {{
                      prev: {
                        text: 'Prev',
                        click: () => {
                          calendarRef.getApi().prev();
                          console.log(calendarRef);
                          // const startDate = this.calendarRef._calendarApi.currentDataManager.state.dateProfile.activeRange.start;
                          // const endDate = this.calendarRef._calendarApi.currentDataManager.state.dateProfile.activeRange.end;
                          // this.props.setGetDates({ startDate, endDate });
                        }
                      },
                      next: {
                        text: 'true',
                        click: () => {
                          calendarRef.getApi().next();
                        }
                      }
                    }}
                    height="100%"
                    initialView="timeGridDay"
                    nowIndicator={false}
                    defaultView="timeGridDay"
                    header={{
                      left: "prev title next",
                      center: "",
                      right: ""
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    // plugins={[
                    //   interactionPlugin,
                    //   dayGridPlugin,
                    //   // momentTimezonePlugin,
                    //   // scrollGridPlugin,
                    //   resourceTimeGridPlugin,
                    // ]}
                    ref={calendarRef}
                    // resources={resources}
                    selectable={false}
                    slotLabelInterval={{
                      hour: 1,
                    }}
                    slotDuration={{
                      minute: 30,
                    }}
                    slotEventOverlap={false}
                    timeZone="America/Los_Angeles"
                    timeZoneParam="America/Los_Angeles"
                    dayMinWidth={240}
                /> */}
            </div>
            <style jsx>
                {`
                .header_section{
                    box-shadow: 0px 0px 8px 0px #888888;
                    font-weight: 500;
                    position: sticky;
                    top: 0;
                }
                .back_option{
                    left:15px
                }
                `}
            </style>
        </Wrapper>
    )
}

export default SetSchedule
