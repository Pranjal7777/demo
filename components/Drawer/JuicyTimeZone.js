import React from "react";
import { useState } from "react";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
const SearchBar = dynamic(
  () => import("../../containers/timeline/search-bar"),
  { ssr: false }
);
import DVRadioButton from "..//DVformControl/DVradioButton";
import { JUICY_TIMEZONE_LIST } from "../../lib/juicytimezones";
import { close_dialog } from "../../lib/global";
import { useEffect } from "react";
import { Button } from "@material-ui/core";

const JuicyTimeZone = (props) => {
  const timeZoneList = JUICY_TIMEZONE_LIST;
  const [lang] = useLang();
  const [searchKey, setSearchKey] = useState("");
  const [timeZone, setTimeZone] = useState(props.isSceduleTime);

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };

  const handlesetTimezone = () => {
    setTimeZone(props.setIsSceduleTime);
    props.onClose();
  };
  const handlesetCancelTimezone = () => {
    // setTimeZone(props.setIsSceduleTime);
    props.onClose();
  };

  const searchData = timeZoneList.filter((data) =>
    data.label.toLowerCase().includes(searchKey.toLowerCase())
  );

  useEffect(() => {
    props.setIsSceduleTime(timeZone);
  }, [timeZone]);

  return (
    <div>
      <div
        className="card_bg"
        style={{ position: "sticky", top: "0px", zIndex: "20" }}
      >
        <div className="w-100">
          <div
            className="d-flex"
            style={{ marginRight: "1rem", marginLeft: "1rem" }}
          >
            <h5 className="txt-black dv__fnt20 content_heading px-2 py-3 m-0 d-flex align-items-center">
              {lang.selectTimeZone}
            </h5>
            {/* <div className=' h-5 px-1 py-3 m-0' style={{width:"150px"}}>
                <Button
                  disabled={!timeZone}
                  type="button"
                  // cssStyles={theme.blueButton}
                  onClick={() => handlesetTimezone()}
                >
                  <span className='text-white'>{lang.save}</span>
                </Button>
              </div> */}
          </div>
          <div style={{ padding: "1vw" }} className="searchBar_section">
            <SearchBar onlySearch handleSearch={handleSearch.bind(this)} />
          </div>
        </div>
      </div>
      <div className="min_hight">
        {searchData.length === 0 ? (
          <div style={{ marginTop: "30%", marginLeft: "40%" }}>
            {lang.noDataFound}
          </div>
        ) : (
          searchData.map((time) => {
            return (
              <>
                <div className="d-flex justify-content-between pt-2">
                  <DVRadioButton
                    name={"juicyTimeZone"}
                    value={time.value}
                    label={time.label}
                    timezonelabel={time.label}
                    checked={timeZone?.value?.label === `${time.label}`}
                    onChange={(value, timezonelabel) =>
                      setTimeZone({ value, timezonelabel })
                    }
                  />
                </div>
              </>
            );
          })
        )}
        <div
          style={{
            background:
              "linear-gradient(0deg, #121212 0%, rgba(18, 18, 18, 0) 100%)",
            height: "35px",
            width: "100%",
            position: "sticky",
            bottom: "-5px",
            zIndex: "20",
          }}
        ></div>
      </div>
      <div
        className="card_bg"
        style={{ position: "sticky", bottom: "0px", zIndex: "20" }}
      >
        <div className="d-flex justify-content-end">
          <Button
            className="text-white text-capitalize"
            onClick={() => handlesetCancelTimezone()}
            disableRipple
          >
            Cancel
          </Button>
          <Button
            className="text-capitalize"
            disabled={!timeZone}
            type="button"
            onClick={() => handlesetTimezone()}
            style={{
              color: "var(--l_base)",
              fontWeight: "600",
            }}
            disableRipple
          >
            Save
          </Button>
        </div>
      </div>
      <style jsx>{`
        :global(.gender_container) {
          width: 100% !important;
        }
        :global(.gender_container .checkmark) {
          left: 100% !important;
        }
        :global(.searchBar_section input) {
          color: white !important;
          background: #353535 !important;
          height: 40px;
        }
        :global(.searchBar_section > div > div) {
          margin-top: 0px !important;
        }
        :global(.mu-dialog > div > div) {
          border-radius: 16px !important;
        }
        :global(.mu-dialog > div > div > div) {
          border-radius: 14px !important;
        }

        .min_hight {
          min-height: 52vh !important;
          padding-bottom: 5px;
          max-height: 52vh;
          overflow-y: auto;
        }
        :global(.btmModal h5) {
          font-size: 1.5rem !important;
        }
        @media screen and (max-width: 767px) {
          :global(.mu-dialog > div > div) {
            max-height: 60vh !important;
          }
          .min_hight {
            min-height: 40vh !important;
            padding-bottom: 5px;
            max-height: 41vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default JuicyTimeZone;
