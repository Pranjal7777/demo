import { useState, useRef, useEffect } from 'react';
import Icon from './image/icon';
import { Prev_Arrow_Story } from '../lib/config/profile';
import { Next_Arrow_Story } from '../lib/config';
import isMobile from '../hooks/isMobile';
import { getCookie } from '../lib/session';
import Button from './button/button';

const CustomSlider = ({ options, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
  const [isForwardButtonVisible, setIsForwardButtonVisible] = useState(true);
  const [mobileView] = isMobile();
  let userType = getCookie("userType");
  const handleButtonClick = (index, notifyType) => {
    setSelectedIndex(index);
    onChange(0, notifyType);
  };
  const handleWheelScroll = (evt) => {
    evt.preventDefault();
    sliderRef.current.scrollLeft += evt.deltaY;
  };

  const handleScroll = (scrollDirection) => {
    const containerWidth = sliderRef.current.offsetWidth;
    const scrollAmount = scrollDirection === 'left' ? -containerWidth : containerWidth;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setIsBackButtonVisible(true);
  };


  useEffect(() => {
    const handleScrollVisibility = () => {
      const container = sliderRef.current;
      setIsBackButtonVisible(container.scrollLeft > 0);
      const isAtEnd = container.scrollLeft + container.clientWidth + 1 >= container.scrollWidth;
      setIsForwardButtonVisible(!isAtEnd);
    };
    const container = sliderRef.current;
    container.addEventListener('scroll', handleScrollVisibility);
    return () => {
      container.removeEventListener('scroll', handleScrollVisibility);
    };
  }, []);


  return (
    <div className="slider-container p-3">
      <div className="slider scroll-hide" ref={sliderRef} onWheel={handleWheelScroll} >
        {options.map((option, index) => (
          <div>
            <Button
              type="button"
              key={index}
              fixedBtnClass={selectedIndex === index ? "active" : "inactive"}
              fclassname='text-nowrap headerBtnPadding'
              onClick={() => handleButtonClick(index, option.notifyType)}
            >
              <span className="label">{option.label}</span>
            </Button>
          </div>
        ))}
      </div>
      <style jsx>{`
      .slider-container {
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index:99;
        background-color:var(--l_app_bg);
        width:${mobileView ? "100vw" : "100%"};
      }
      .slider {
        display: flex;
        overflow-x: scroll;
        scroll-behavior: smooth;
        -ms-overflow-style: none;  
        scrollbar-width: none;
        gap:1vw;
      }
      
      `}</style>
    </div>
  );
};

export default CustomSlider;
