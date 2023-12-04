import React from 'react';
import Router from 'next/router';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import ReactDOM from 'react-dom';
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from "@fullcalendar/daygrid";
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import { addDays } from 'date-fns';
import moment from 'moment';
import Image from '../image/image';
import { getBookingDetailsAPI } from '../../services/videoCall';
import { getCookie } from '../../lib/session';
import DatePicker from '../formControl/datePicker';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import CustomDataLoader from '../loader/custom-data-loading';
import { isAgency } from '../../lib/config/creds';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { defaultTimeZone } from '../../lib/config';
import { fetchSlotsSubject } from '../../lib/rxSubject';
import { close_dialog } from '../../lib/global/loader';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      selectedDate: '',
      apiResponse: true,
      dateRange: [{
        startDate: new Date(moment(new Date()).startOf('isoWeek').format('dddd YYYY-MM-DD')),
        endDate: addDays(new Date(moment(new Date()).startOf('isoWeek').format('dddd YYYY-MM-DD')), 6),
        key: 'selection'
      }],
      calendarOptions: {
        height: '70vh',
        firstDay: (new Date('2015-04-25T14:00:00').getDay()),
        startStr: '2018-09-01T12:30:00-05:00',
        initialView: 'timeGridDay', // the name of a generic view
        plugins: [momentPlugin, timeGridPlugin, interactionPlugin, dayGridPlugin, momentTimezonePlugin],
        headerToolbar: {
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        droppable: false,
        selectable: true,
        selectHelper: false,
        editable: false,
        allDaySlot: false,
        eventDragStart: (dd) => {
          console.log('days', dd);
        },
        eventClassNames: 'myclassname',
        slotLabelInterval: '00:60',
        slotMinTime: '00:30:00',
        slotDuration: '00:05:00',
        scrollTime: moment(new Date()).format('HH:mm:ss'),
        aspectRatio: 5,
        eventResizableFromStart: false,
        eventDurationEditable: false,
        eventResourceEditable: false,
        eventStartEditable: false,
        titleFormat: 'D MMM YYYY',
        selectOverlap: false,
        eventOverlap: false,
        eventShortHeight: 50,
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false, hour12: true },
        dayHeaderFormat: (currentPostionData) => {
          const { date: { marker } } = currentPostionData;
          const currentPostionDay = moment(marker).format('ddd');
          const currentPostionMonth = moment(marker).format('MMM');
          const currentDayMonth = moment(marker).format('DD');
          return (
            <div className="d-flex flex-column celander_header">
              <div className="text-uppercase font-10">{currentPostionDay}</div>
              <div>{currentDayMonth}</div>
              <div className="text-uppercase font-12">{currentPostionMonth}</div>
            </div>
          );
        },
        eventDidMount: (aa) => {
          console.log(aa);
        },
        eventClassNames: (aa) => {
          console.log(aa);
        },
        eventWillUnmount: (aa) => {
          console.log(aa);
        },
        events: [],
      }
    };
  }

  eventDataFormat = (eventData = []) => {
    const eventArrayGen = eventData.map((item) => ({
      start: new Date(`${moment(this.state.selectedDate).format('MM/DD/YYYY')} ${item.startTime}`),
      end: new Date(`${moment(this.state.selectedDate).format('MM/DD/YYYY')} ${item.endTime}`),
      border: `1px solid ${item?.status === 1 ? '#0027ff' : item?.status === 2 ? "#0027ff" : item?.status === 3 ? "#0027ff" : "#0027ff"}`,
      personDetails: item?.status === 3 && !!item?.userDetails?.userId,
      backgroundColor: `${item?.status === 1 ? 'var(--green_dark)' : item?.status === 2 ? "var(--blue_light)" : item?.status === 3 ? "var(--red_dark)" : "#0027ff"}`,
      textcolor: `${item?.status === 1 ? '#47e2ad' : item?.status === 2 ? "#847fdd" : item?.status === 3 ? "#9b9b9b" : "#0027ff"}`,
      title: item?.userDetails?.name,
      profilePic: "",
    }));
    this.setState({
      calendarOptions: {
        ...this.state.calendarOptions,
        events: eventArrayGen
      }
    });
  }

  fetchDetails = () => {
    getBookingDetailsAPI({ dateToFetch: moment(this.state.selectedDate).format('YYYY-MM-DD'), userId: isAgency() ? this.props.selectedCreatorId : getCookie('uid') })
      .then((res) => {
        if (res.status === 200 && res.data.data?.length) {
          this.eventDataFormat(res.data.data);
          this.setState({apiResponse: false});
        }else{
          this.setState({apiResponse: false});
        }
      })
      .catch(err => {
        this.eventDataFormat([]);
        this.setState({apiResponse: false});
      });
  }

  componentDidMount = () => {
    fetchSlotsSubject.subscribe((fetchCallBack = false) => {
      if (fetchCallBack) {
        this.fetchDetails()
        close_dialog("ScheduleSection")
      }
    })
    this.setState({
      selectedDate: new Date()
    }, this.fetchDetails);
    if (this.props.refreshFunction) this.props.refreshFunction.current = this.fetchDetails;
  }

  componentWillUnmount = () => {
    if (this.props.refreshFunction) this.props.refreshFunction.current = null;
  }


  EventDetail = ({ event, el }) => {
    const profilePic = event.extendedProps.profilePic;
    const userName = event.title;
    const content = (
      <div className='d-flex align-items-center w-100'>
        <div className='col-auto pl-1 pr-2'>
          {(userName && profilePic) && <div className='peronImage'>
            <Image
              src={profilePic}
              width={26}
              height={26}
              className="rounded-circle"
              alt="user icon"
            />
          </div>}
        </div>
        <div className='col p-0' style={{ fontSize: '11px' }}>
          {userName && <div style={{ color: '#000', fontWeight: '600' }}>{userName}</div>}
          <div style={{ color: event?.extendedProps?.textcolor }}>{`${moment(event.start).format('h:mm a')} - ${moment(event.end).format('h:mm a')}`}</div>
        </div>
        {(userName && profilePic) && <div className='col-auto pr-1 pl-2'>
          <RightIcon style={{ color: '#000', fontSize: '18px' }} />
        </div>}
      </div>
    );
    ReactDOM.render(content, el);
    return el;
  };

  handleSelect(ranges) {
    console.log(ranges);
  }

  drop = (info) => {
    info.draggedEl.parentNode.removeChild(info.draggedEl);
  }

  handleChange = (e) => {
    this.setState({ event: { ...this.state.event, title: e.target.value } });
  }

  createEvent = () => {
    this.fullCalendar.getApi().addEvent(this.state.event);
    this.fullCalendar.getApi().unselect();
    // this.toggleModal();
  }

  select = ({ start }) => {
    console.log('select event', start);
  }

  prev = () => {
    const isToday = moment(0, "HH").diff(this.state.selectedDate, "days") == 0;
    if (isToday) return;
    const currentDatetime = moment(this.state.selectedDate);
    const prevDate = currentDatetime.clone().subtract(1, 'day').startOf('day');
    const formattedPrevDate = prevDate.format("ddd MMM DD YYYY 00:00:00 [GMT]ZZ (z)");
    this.fullCalendar.getApi().prev();
    this.setState({
      selectedDate: formattedPrevDate,
    }, this.fetchDetails);
  }

  next = () => {
    const currentDatetime = moment(this.state.selectedDate);
    const nextDate = currentDatetime.clone().add(1, 'day').startOf('day');
    const formattedNextDate = nextDate.format("ddd MMM DD YYYY 00:00:00 [GMT]ZZ (z)");
    this.fullCalendar.getApi().next();
    this.setState({
      selectedDate: formattedNextDate,
    }, this.fetchDetails);
  }

  today = () => {
    this.fullCalendar.getApi().today();
  }

  changeView = (view = "2022-05-31") => {
    this.fullCalendar.getApi().gotoDate(view);
    this.setState({
      selectedDate: moment.tz(view, defaultTimeZone()).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')
    }, this.fetchDetails);
  }

  eventClick = (info) => {
    if (info.event?.extendedProps?.personDetails) {
      Router.push('/my-orders');
    }
  }


  render() {
    const { calendarOptions } = this.state;
    return (
      <div className={`${!this.props.mobileView && "px-3"}`}>
        {this.props.mobileView ? <div className='w-100 d-flex my-3 borderStroke' style={{ background: "#F5D0FF1A", borderRadius: "12px" }}>
          <div style={{ width: "12.5%", paddingTop: "10px", marginLeft: "10px" }}>
            <div className=''>
              <DatePicker
                className="date__input__custom"
                min={moment().format('YYYY-MM-DD')}
                type='fullCalender'
                value={moment(this.state.selectedDate).format('YYYY-MM-DD')}
                onChange={(e) => this.changeView(moment(e.target.value).format('YYYY-MM-DD'))}
              />
            </div>
          </div>
          <div style={{ width: "75%", justifyContent: "space-evenly" }} className='d-flex flex-column align-items-center'>
            <div>
              <div className='d-flex align-items-center'>
                <div className='px-1 cursorPtr' onClick={this.prev}><LeftIcon /></div>
                <div className='px-1'>  {moment(this.state.selectedDate).format('DD MMMM YYYY')}</div>
                <div className='px-1 cursorPtr' onClick={this.next}><RightIcon /></div>
              </div>
            </div>
            <div className=''>
              <div className=' d-flex'>
                <div className='AvailableSlots slots'>Available</div>
                <div className='NotAvailable slots'>Not Available</div>
                <div className='Booked slots'>Booked</div>
              </div>
            </div>

          </div>
          <div className='d-flex pr-1' style={{ width: "12.5%", paddingTop: "10px", fontSize: "12px", justifyContent: "center" }}>
            {moment(this.state.selectedDate).format('ddd')}
          </div>
        </div> :
          <div className='d-flex flex-row justify-content-between align-items-center mb-3'>
            <div className='d-flex align-items-center'>
              <div className='ml-4'>
                <DatePicker
                  className="date__input__custom"
                  min={moment().format('YYYY-MM-DD')}
                  type='fullCalender'
                  value={moment(this.state.selectedDate).format('YYYY-MM-DD')}
                  onChange={(e) => this.changeView(moment(e.target.value).format('YYYY-MM-DD'))}
                />
              </div>
              <div className='d-flex align-items-center'>
                <div className='px-1 cursorPtr' onClick={this.prev}><LeftIcon /></div>
                <div className='px-1'>  {moment(this.state.selectedDate).format('MMMM DD, YYYY')}</div>
                <div className='px-1 cursorPtr' onClick={this.next}><RightIcon /></div>
              </div>
              <div>{moment(this.state.selectedDate).format('dddd')}</div>
            </div>
            <div className='d-flex'>
              <div className='AvailableSlots slots'>Available</div>
              <div className='NotAvailable slots'>Not Available</div>
              <div className='Booked slots'>Booked</div>
            </div>
          </div>
        }
        <div className="scheduleCalander position-relative">
          <div className='whiteLayer'></div>
          {!calendarOptions.events.length && this.state.apiResponse && <div className="d-flex align-items-center justify-content-center position-absolute profileSectionLoader" style={{height: '20%', top: '50%'}}>
              <CustomDataLoader type="ClipLoader" loading={this.state.apiResponse} size={60} />
            </div>}
          <FullCalendar
            firstDay="1"
            ref={(node) => { this.fullCalendar = node; }}
            defaultView="timeGridDay"
            plugins={this.state.calendarPlugins}
            select={this.select}
            height='70vh'
            headerToolbar={{
              start: 'prev',
              center: 'title',
              end: 'next',
            }}
            eventClick={this.eventClick}
            eventRender={this.EventDetail}
            drop={this.drop}
            timeZone={defaultTimeZone()}
            {...calendarOptions}
          />
        </div>
        <style>{`
                .scheduleCalander .fc-time-grid-container{
                    height: calc(calc(var(--vhCustom, 1vh) * 100) - 165px) !important
                }

                .fc-ltr .fc-time-grid .fc-event-container{
                  margin: 0 5px;
                }

                .whiteLayer{
                  position: absolute;
                  z-index: 99;
                  height: 14px;
                  bottom: -2px;
                  width: 100%;
                  background: linear-gradient(0deg, #121212 0%, rgba(18, 18, 18, 0) 100%);
                }
                
                .scheduleCalander .fc-time-grid .fc-event{
                  color: #ffffff;
                  width:100%;
                  align-items: center;
                  display: flex;
                  border: none;
                  border-radius: 0px;
                }
                .fc-time-grid-event{
                  margin: 1px;
                }
                .fc-view-container *{
                  color: #ffffff !important;
                }

                .fc-widget-content>span{
                  color: #B3ADBD !important;
                }
                
                .scheduleCalander .fc-header-toolbar{
                    display: none!important;
                }

                // .headerSection{
                //     padding: 10px 0px;
                //     border-radius: 10px;
                //     font-weight: 700;
                //     background: #f5f5f5;
                // }
                
                .AvailableSlots::before {
                    content: '';
                    margin-right: 6px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    background: var(--green_dark);
                }

                .NotAvailable::before {
                    content: '';
                    margin-right: 6px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    background: var(--red_dark);
                }

                .Booked::before {
                    content: '';
                    margin-right: 6px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    background: var(--blue_light);
                }

                .slots{
                  padding: 0px 8px;
                  font-weight: 500;
                  font-size: 11px;
                  display: flex;
                  align-items: center;
                }

                .scheduleCalander td.fc-today {
                    background-color: var(--l_app_drawer) !important;
                }
                
                .date__input__custom {
                  position: relative;
                  width: 25px;
                  height: 25px;
                  right:18px;
                  border: none;
                  background: none;
                }
                
                .date__input__custom::-webkit-datetime-edit, .date__input__custom::-webkit-inner-spin-button, .date__input__custom::-webkit-clear-button {
                  display: none;
                }
                
                .date__input__custom::-webkit-calendar-picker-indicator {
                  position: absolute;
                  top: 0px;
                  right: 0;
                  color: black;
                  opacity: 1;
                  cursor: pointer;
                  width: 25px;
                  height: 25px;
                  filter: ${this.props.theme.type === 'light' ? 'unset' : 'invert(79%) sepia(100%) saturate(0%) hue-rotate(147deg) brightness(118%) contrast(106%)'};
                }
                
                @media (min-width: 700px) and (max-width: 991.98px){
                  .date__input__custom {
                    width: auto;
                    height: auto;
                  }
                }
                .MuiSvgIcon-fontSizeSmall{
                  font-size:1.90rem!important;
                  pointer-events: none;
                }
                
              
        `}</style>
      </div>
    );
  }
}

export default Calendar;