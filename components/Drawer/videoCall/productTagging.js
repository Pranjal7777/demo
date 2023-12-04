import React, { useState } from 'react';
import { useTheme } from "react-jss";
import isMobile from '../../../hooks/isMobile';
import Header from '../../header/header';
import Icon from '../../image/icon';
import InputBox from "../../../components/input-box/input-box";
import { P_CLOSE_ICONS, SEARCHBAR_ICON } from '../../../lib/config';
import ProductCard from './productCard';
import Button from '../../button/button';

const productTagging = (props) => {
  const { onClose } = props;
  const [selectedProduct, setSelectedProduct] = useState({});
  const [mobileView] = isMobile();
  const theme = useTheme();
  const productId = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "25px",
    zIndex: "9",
    transform: "translateY(-50%)",
  };


  const skipButton = () => (
    <span className="txt-roman fntClrTheme fntSz15" onClick={onClose}>Skip</span>
  )

  return (
    <>
      {mobileView && <Header
        title={"Products"}
        back={onClose}
        right={skipButton}
      />}
      {
        !mobileView && (
          <>
          <div className="position-absolute w-100 dv_header_product d-flex align-items-center px-3">
            <Icon
              icon={`${P_CLOSE_ICONS}${"#cross_btn"}`}
              color={theme.type === "light" ? "#000" : "#fff"}
              size={25}
              class="cursorPtr"
              alt="close_icon"
              onClick={onClose}
            />
            <span className="txt-black ftnSz26 ml-3">Tagged</span>
            <div className="position-relative w-50 ml-auto">
              <InputBox
                placeholder="Search"
                autoComplete="off"
                cssStyles={theme.search_input}
              />
              <Icon
                icon={`${SEARCHBAR_ICON}#searchBar`}
                color={theme.type == "light" ? "#4e586e" : theme.text}
                width={13}
                style={style}
                height={22}
                viewBox="0 0 511.999 511.999"
              />
            </div>
            <span className="txt-roman fntClrTheme fntSz16 ml-3 cursorPtr" onClick={onClose}>Skip</span>
          </div>
          </>
        )
      }
      <div className={`container ${mobileView ? "" : "pb-3"}`} style={{ paddingTop: "60px", backgroundColor: "#F2F2F2" }}>
        {mobileView && <div className="mx-0 mt-3 position-relative">
          <InputBox
            placeholder="Search"
            autoComplete="off"
            cssStyles={theme.search_input}
          />
          <Icon
            icon={`${SEARCHBAR_ICON}#searchBar`}
            color={theme.type == "light" ? "#4e586e" : theme.text}
            style={style}
            width={18}
            height={22}
            viewBox="0 0 511.999 511.999"
          />
        </div>}

        <div
          className="form-row mt-3 align-content-start"
          style={{ height: mobileView ? "calc(100vh - 183px)" : "calc(89vh - 146px)", overflow: "auto" }}
        >
          {
            productId.map((item) => (
              <ProductCard key={item.id} item={item} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            ))
          }
        </div>

      
        <Button onClick={onClose} disabled={!Object.keys(selectedProduct).length} fclassname="txt-black mt-1" cssStyles={theme.blueButton}>Done Tagging & Start Call</Button>
    


      </div>
      <style jsx>
          {`
          :global(.MuiDrawer-paper) {
            overflow: inherit !important;
          }
          .dv_header_product {
            top: 0;
            height: 60px;
            left: 0;
            box-shadow: 0px 3px 6px #00000029;
          }
          `}
      </style>
    </>
  )
}

export default productTagging;