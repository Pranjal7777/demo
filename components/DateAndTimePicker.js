
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import { useState } from 'react';
import InputField from '../containers/profile/edit-profile/label-input-field';
import { useTheme } from 'react-jss';
import isMobile from '../hooks/isMobile';
import moment from 'moment';

export const DateAndTimePicker = ({ dateTimeStamp = null, setDateTimeStamp, value, setAutoMeridium = false }) => {
  const [date, setDate] = useState(value);
  const [mobileView] = isMobile()
  const theme = useTheme()


  function handleButtonClick(time) {
    let amButton = document.querySelector('.MuiClock-amButton');
    let pmButton = document.querySelector('.MuiClock-pmButton');
    if (time === 'AM') {
      amButton?.setAttribute('id', 'am-selected-datetime-picker');
      pmButton?.removeAttribute('id');
    }
    if (time === 'PM') {
      pmButton?.setAttribute('id', 'pm-selected-datetime-picker');
      amButton?.removeAttribute('id');
    }
  }


  return <div className='position-relative dateTimePickerDiv'>
    {mobileView ?
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={1}>
          <DateTimePicker
            value={date}
            disablePast={true}
            onChange={(newValue) => {
              setDateTimeStamp(moment(newValue?.$d).local().unix())
              setDate(newValue)
            }}
            renderInput={(params) => {
              return <>
                <div>
                  <InputField
                    className="cursorPtr overflow-hidden fntSz15 form-control ipt__brod mv_form_control_Input pickerBoxLayout"
                    placeholder="mm-dd-yyyy"
                    value={(date && params.inputProps.value) || date}
                    onClick={params.inputProps.onClick}
                    readOnly
                  />
                  <div className="position-absolute cursorPtr mt-0" style={{ right: "1rem", top: "0.7rem" }} onClick={params.inputProps.onClick}>
                    <DateRangeOutlinedIcon
                      style={{ color: "var(--l_app_text)", width: "20px", height: "20px" }}
                    />
                  </div>
                </div>
              </>
            }
            }
          />
        </Stack>
      </LocalizationProvider>
      :
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <MobileDateTimePicker
            onViewChange={() => {
              setTimeout(() => {
                const amButton = document.querySelector('.MuiClock-amButton');
                const pmButton = document.querySelector('.MuiClock-pmButton');
                amButton?.addEventListener('click', () => handleButtonClick('AM'));
                pmButton?.addEventListener('click', () => handleButtonClick('PM'));
              }, 500)
            }}
            disablePast={true}
            value={date}
            onChange={(newValue) => {
              setDateTimeStamp(moment(newValue?.$d).local().unix())
              setDate(newValue)
            }}
            renderInput={(params) => {
              return <>
                <InputField
                  className="cursorPtr overflow-hidden fntSz15 form-control ipt__brod mv_form_control_Input pickerBoxLayout"
                  placeholder="mm-dd-yyyy"

                  value={date && params.inputProps.value || date}
                  onClick={params.inputProps.onClick}
                  readOnly
                />
                <div className="position-absolute cursorPtr mt-0" style={{ right: "1.2rem", top: "0.7rem" }} onClick={params.inputProps.onClick}>
                  <DateRangeOutlinedIcon
                    style={{ color: "var(--l_app_text)", width: "20px", height: "20px" }} />
                </div >
              </>
            }}
          />
        </Stack>
      </LocalizationProvider>
    }
    <style jsx>{`
                     :global(.MuiDialog-paperScrollPaper){
                        width:${!mobileView && "450px!important"};
                      }
                      :global(.MuiDialogContent-root:first-child::-webkit-scrollbar){
                        display:none;
                      }
                      :global(.css-1okebmr-indicatorSeparator){
                        background-color:${!mobileView && "var(--l_drawer)!important"};
                      }
                      :global(.MuiTabs-root){
                        top:142px !important;
                      }
                      :global(.MuiPaper-root){
                        background:var(--l_app_bg) !important;
                        color:var(--l_app_text) !important;
                        border-radius:10px !important;
                      }
                      :global(.MuiTypography-overline){
                        color:var(--l_app_text) !important;
                      }
                      :global(.pickerBoxLayout){
                        border-radius: ${mobileView ? "8px" : "12px"} !important;;
                        border: 1.5px solid var(--l_border) !important;
                      }
                      :global(.pickerBoxLayout::placeholder){
                        color:${theme.type === "light" ? "#12121242" : "gray"};
                      }
                      :global(.MuiPickersDay-dayWithMargin ){
                        background:var(--l_app_bg) !important;
                        color:var(--l_app_text) !important;
                      }
                      // :global(.MuiPickersDay-today){
                      //   background:var(--l_base) !important;
                      // }
                      :global(.MuiTypography-root){
                        color: var(--l_app_text) !important;
                      }
                      :global(.MuiClock-pmButton:hover),
                      :global(.MuiClock-pmButton:focus){
                        background-color: var(--l_base) !important;
                      }
                      :global(.MuiDayPicker-weekContainer){
                        background:var(--l_app_bg) !important;
                        color:var(--l_app_text) !important;
                      }
                      :global(.am-selected, .pm-selected){
                        background-color:var(--l_base)!important;
                      }
                      :global(.MuiPickersClockPointer-pointer),
                      :global(.MuiClockPointer-root),
                      :global(.MuiClock-pin),
                      :global(.MuiClockNumber-root),
                      :global(button.Mui-selected){
                          background-color:var(--l_base) !important;
                      }
                      :global(.MuiClockPointer-thumb){
                        border-color:var(--l_base) !important;
                        background-color:var(--l_base) !important;
                    }
                    :global(.MuiClockNumber-root),
                    :global(.MuiTypography-root),
                    :global(.MuiTypography-subtitle2){
                        color:var(--l_app_text) !important;
                    }
                    :global(.MuiTypography-subtitle2.Mui-selected),
                    :global(.MuiTypography-root.Mui-selected){
                        color:var(--l_base) !important;
                    }
                    :global(.MuiClockNumber-root){
                        background-color:var(--l_app_bg) !important;
                    }
                    :global(.MuiPickerStaticWrapper-content){
                      background-color:var(--l_profileCard_bgColor) !important;
                  }
                  :global(.MuiPickersToolbar-penIconButton ){
                    display :none !important;
                }
                :global(.MuiTabs-indicator){
                  background:var(--l_base) !important;
                }
                :global(.MuiModal-backdrop){
                  background-color:rgba(0, 0, 0, 0.5) !important;
                }

                :global(.MuiDialog-container){
                    height:100% !important
                }
                  :global(.control_input){
                  background-color:var(--l_drawer)!important;
                  width:100%!important;
                  border:1px solid ${theme.type === "light" ? "#E0E1E4!important" : "#667491!important"};
                  padding:0px 0px 0px 15px!important;
                  font-size:16px!important;
                  color:var(--l_app_text) !important
                }
                :global(.control_input:focus){
                  border:1px solid var(--l_app_text)!important;
                }
                :global(.MuiCalendarPicker-root){
                  max-height:250px!important;
                }
                :global(.MuiClock-pmButton:hover),
                :global(.MuiClock-pmButton:focus){
                  background-color: var(--l_base) !important;
                }
                :global(.MuiClock-amButton:hover),
                :global(.MuiClock-amButton:focus){
                  background-color: var(--l_base) !important;
                }
                :global(.MuiClock-amButton){
                  background-color:${`${theme.type === "light" ? "#fff" : "#000"}`}!important;
                }
                :global(.MuiClock-pmButton){
                  background-color:${`${theme.type === "light" ? "#fff" : "#000"}`}!important;
                }
              
                :global(.MuiTab-textColorPrimary){
                  color:var(--l_app_text) !important;
                }
                :global(.Mui-disabled){
                  color: var(--l_light_grey) !important;
                }
                :global(.MuiPickersArrowSwitcher-button){
                  color: var(--l_light_grey) !important;
                }
                :global(.MuiPickersCalendarHeader-switchViewIcon){
                  color: var(--l_light_grey) !important;
                }
                :global(.css-1lwbda4-MuiStack-root>:not(style)+:not(style)){
                  margin-top:${!mobileView && "0px"};
                }
                :global(.MuiSvgIcon-root){
                  fill:var(--l_app_text) !important;
                }
        `}</style>
  </div >
}