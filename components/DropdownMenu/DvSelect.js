import React, { useState } from 'react';
import { FACEBOOK_AG, INSTARGAM_AG, TWITTER_AG } from '../../lib/config/homepage';
import DVinputText from '../DVformControl/DVinputText';
import useLang from '../../hooks/language';
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { handleContextMenu } from '../../lib/helper';


const DvSelect = (props) => {
  const { socialMediaLink, formik } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [links, setLinks] = useState([]);
  const [lang] = useLang();
  const options = [
    { name: "Twitter", logo: TWITTER_AG, url: "www.twitter.com", id: "" },
    { name: "Instagram", logo: INSTARGAM_AG, url: "www.instagram.com" },
    { name: "Facebook", logo: FACEBOOK_AG, url: "www.facebook.com" },
  ];
  const handleSelectOption = (option) => {
    setShowDropdown(false);
    setLinks((prevLinks) => [...prevLinks, option]);
  };

  const handleRemoveLink = (index) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };


  return (
    <div>
      <p className='text-muted mb-0'>Social Links</p>
      {links.map((link, index) => (
        <div key={index} className="pt-2 position-relative">
          <DVinputText
            className="form-control dv_form_control stopBack position-relative w-100 inputselect "
            placeholder={link?.url}
            name={`socialMediaLink.${link.name}`}
            value={socialMediaLink[link.name]}
            onChange={formik.handleChange}
            isAgency
          />
          <img width="12px" height="12px" className='position-absolute callout-none' style={{ zIndex: 1, top: "48%", left: "88%" }} src={link.logo} alt={link.name} contextMenu={handleContextMenu}
          />
          <button className="remove-link position-absolute text-app" style={{ zIndex: 1, top: "37%", left: "91%" }} onClick={() => handleRemoveLink(index)}>
            x
          </button>
        </div>
      ))}
      {links.length !== options.length && <div className={`select-field cursorPtr form-control dv_form_control py-2 ${!showDropdown && "mb-3"}`} onClick={() => setShowDropdown(!showDropdown)}>
        <span className='fntSz14 text-muted'>{links.length ? lang.addAnotherSocial : lang.selectAccount}</span>
        <div className={`${!showDropdown ? "arrow_on_down" : "arrow_on_up"} position-absolute`}>
          <ArrowForwardIosIcon className=" fntSz15 cursor-pointer" color='#000' />
        </div>      </div>}

      {showDropdown && (
        <div style={{ border: "1px solid #D7D7D7", borderRadius: "8px" }} className='cursorPtr'>
          {options.map((data, index) => (
            !links.some((link) => link.name === data.name) && (
              <div key={index} className='col-12 d-flex flex-row align-items-center borderBottom p-2' onClick={() => handleSelectOption(data)}>
                <img width="12px" height="12px" className='callout-none' src={data.logo} alt={data.name} contextMenu={handleContextMenu}
                />
                <p className='text-app mb-0 ml-2'>{data.name}</p>
              </div>
            )
          ))}
        </div>
      )}
      <style jsx>{`
        .textDark {
          color: #000;
        }

        .selected-link {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        :global(.dv_form_control.inputselect){
          background:var(--l_app_bg);
        }
        .remove-link {
          background-color: transparent;
          border: none;
          cursor: pointer;
          margin-left: 8px;
        }
        .arrow_on_down{
  top:20%;
  transform: rotate(90deg) !important;
   left: 94%;
}
.arrow_on_up{
  top:20%;
  transform: rotate(270deg) !important;
   left: 94%;
}
.borderBottom{
  border-bottom:1px solid #D7D7D7 !important;
}
      `}</style>
    </div>
  );
};

export default DvSelect;
