import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { p_down_arrow } from '../../lib/config';
import Icon from '../image/icon';
import { toggleSidebarDropdown } from '../../redux/actions/sidebarData';

const SidebarDropdown = (props) => {
  const router = useRouter();
  const sidebarDropDown = useSelector(state => state?.sidebarDropDown);
  const [isOpen, setIsOpen] = useState(false);
  const { title, items, titleClasses, titleStyle, listClasses, listStyle } = props
  const [activeTab, setActiveTab] = useState(props?.pageLink || "")
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    dispatch(toggleSidebarDropdown({ isOpen: !isOpen, dropDownType: title }))
  };

  const onItemClick = (e, listData) => {
    e.stopPropagation();
    setActiveTab(listData?.url)
    router.replace(listData?.url)
  };

  return (
    <>
      <div className='mainDropDown_section'>
        <div onClick={toggleDropdown} className={`${titleClasses} d-flex flex-row justify-content-between align-items-center dropDown_title`} style={{ ...titleStyle, cursor: 'pointer' }}>
          <div>{title}</div>
          <Icon
            icon={`${p_down_arrow}#Layer_1`}
            color={sidebarDropDown?.[title] && "var(--l_app_text)"}
            width={16}
            height={14}
            class='dropdown_arrowIcon'
            style={{ transform: sidebarDropDown?.[title] ? "rotate(180deg)" : "", fontWeight: "600" }}
            viewBox='0 0 16 14'
          />
        </div>
        {sidebarDropDown?.[title] && (
          <ul className='m-0 dropDown_List' style={{ listStyle: 'none', padding: "8px 0" }}>
            {items.map((listData, index) => (
              <li key={index} className={`${listClasses} ${listData?.url == activeTab && "gradient_text"} dropDown_itemList`} style={{ ...listStyle }} onClick={(e) => onItemClick(e, listData)}>{listData?.label}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SidebarDropdown;