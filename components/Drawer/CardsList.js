import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";

import {
  backNavMenu,
  close_dialog,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { Button as MuiButton } from "@material-ui/core";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import useLang from "../../hooks/language";
import * as env from "../../lib/config";
import { getCards } from "../../redux/actions";
import isMobile from "../../hooks/isMobile";
import defaultCardsData from "../../hooks/defaultCardsData";
import Wrapper from "../../hoc/Wrapper"
import { deleteCardAPI, putCardAPI } from "../../services/card";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const Drawer = dynamic(() => import("./Drawer"), { ssr: false });
const AddCard = dynamic(() => import("./AddCard"), { ssr: false });
const CardTile = dynamic(() => import("./CardTile"), { ssr: false });
const DeleteCardConfirm = dynamic(() => import("./DeleteCardConfirm"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });
import PullToRefresh from "react-simple-pull-to-refresh";

export default function CardsList(props) {
  const theme = useTheme();
  const [lang] = useLang();
  // const [cards] = useCardsData();
  const [Dcard] = defaultCardsData();
  const [toggleaddCardDrawer, setToggleAddCardDrawer] = useState(false);
  const [toggledeleteCardDrawer, setToggleDeleteCardDrawer] = useState(false);
  const [initialLorder, setInitialLoader] = useState(true);
  const [selectedCard, setCardData] = useState(false);
  const [defaultCard, setDefaultCardData] = useState(Dcard ? Dcard.id : null);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const [mobileView] = isMobile();

  // Redux State
  const cards = useSelector((state) => state.cardsList);

  useEffect(() => {
    // if(router.asPath == '/cards') {
    //   router.push('/');
    //   close_drawer("Cards");
    //   return;
    // }
    if (!mobileView) {
      setInitialLoader(true);
      setTimeout(() => {
        setInitialLoader(false);
      }, 1000);
    }
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (defaultCard && mobileView) {
      handleDefaultCard(true)
    }
  }, [defaultCard])

  const handleAddCards = () => {
    setToggleAddCardDrawer(true);
  };

  const handleCloseDrawer = () => {
    setToggleAddCardDrawer(false);
  };

  const openConfirmModel = (data, index) => {
    setCardData(data);
    mobileView
      ? setToggleDeleteCardDrawer(true)
      : open_dialog("confirmDeleteAddress", {
        title: lang.cardDeleteConfirmation,
        selectedCard: data,
        handleDeleteCard,
        index: index
      });
  };

  const closeConfirmModel = () => {
    mobileView
      ? setToggleDeleteCardDrawer(false)
      : close_dialog("confirmDeleteAddress");
  };

  const handleDeleteCard = async (data) => {
    startLoader();
    try {
      const response = await deleteCardAPI({
        cardId: data.id,
      });

      if (response.status == 200) {
        stopLoader();
        dispatch(getCards());
        Toast("Card Deleted", "success");
        closeConfirmModel();
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const handleDefaultCard = async (initialCall = false) => {
    startLoader();
    try {

      const payload = {
        cardId: defaultCard
      };
      // const response = await setDefaultCard(payload);
      const response = await putCardAPI(payload);

      if (response.status == 200) {
        stopLoader();
        dispatch(getCards());

        if (!initialCall) {
          Toast("Successfully set the card to default", "success");
        }
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  useEffect(() => {
    if (mobileView) {
      dispatch(getCards());
      setDefaultCardData(null)
    }
  }, [])

  const handleRefresh = () =>
    new Promise(resolve => {
      setTimeout(() => {
        dispatch(getCards());
        setDefaultCardData(null)
        resolve();
      },);
    });

  return (
    <Wrapper>
      <PullToRefresh onRefresh={handleRefresh} fetchMoreThreshold={500} >
        {!mobileView && initialLorder && <div className="cardLoaderCss">
          <CustomDataLoader type="ClipLoader" loading={true} size={60} />
        </div>}
        <div className={mobileView ? "drawerBgCss w-100 h-100" : "w-100"}>
          {mobileView ? (
            <Header
              title={lang.debitCreditCard}
              back={() => {
                backNavMenu(props);
              }}
            />
          ) : (
            <div className="myAccount_sticky__section_header">
              <div className="row m-0 align-items-center justify-content-between">
                <h5 className="content_heading px-1 py-3 m-0 dv_appTxtClr sectionHeading">
                  {lang.debitCreditCard}
                </h5>
                <div className="mr-3">
                  <Button
                    variant="text"
                    fixedBtnClass={"active"}
                    onClick={() => open_dialog("addCard")}
                  >
                    {lang.addCard}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div
            className="col-12 overflow-auto"
            style={mobileView
              ? { paddingTop: "80px", height: "100vh" }
              : {}
            }
          >
            {mobileView ? (
              <div className="row">
                <div className={`${cards?.length > 1 ? "col-6" : "col-12"}`}>
                  <Button
                    type="button"
                    fixedBtnClass={"active"}
                    onClick={() => {
                      handleAddCards();
                    }}
                  >
                    {lang.addCard}
                  </Button>
                </div>
                <div className="col-6">
                  {cards?.length > 1 && (
                    <Button
                      fixedBtnClass={"inactive"}
                      onClick={handleDefaultCard}
                    >
                      {lang.setDefault}
                    </Button>
                  )}

                </div>

              </div>
            ) :
              <div className="d-flex align-items-center mt-3 justify-content-between">
                <p className="m-0 dv__fnt20 txt-heavy" style={{ color: `${theme?.text}` }}>
                  {cards?.length ? lang.savedCards : ""}
                </p>
                {/* <p
                className="m-0 dv_base_color dv__fnt20 txt-heavy cursorPtr"
                onClick={() => {
                  open_dialog("addCard");
                }}
              >
                + Add
              </p> */}
                {/* <Button
                onClick={() => {
                  open_dialog("addCard");
                }}
                type="button"
                cssStyles={theme.blueButton}
              >
                + Add
              </Button> */}
                {cards?.length > 1 && (
                  <Button
                    fixedBtnClass={"inactive"}
                    onClick={handleDefaultCard}>
                    {lang.setDefault}
                  </Button>
                )}
              </div>
            }
            {cards && cards.length ? (
              <div className={mobileView ? "col-12 py-3 px-0" : "row mt-2 vh-50 overflow-auto"}

              >
                {cards.map((data, index) => (
                  <div className={mobileView ? "" : "col-6 col-md-12 col-lg-6"}>
                    <CardTile
                      cardData={data}
                      key={index}
                      openConfirmModel={openConfirmModel}
                      onCardSelect={(id) => setDefaultCardData(id)}
                      selectedCard={data.isDefault === "true" ? data.id : defaultCard}
                      radio={mobileView ? false : true}
                      handleDefaultCard={handleDefaultCard}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              !showLoader && <div className="vh-50 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <Img src={env.No_Card_Found} alt="no_card" />
                  <p
                    className={`m-0 mt-3 dv_appTxtClr
                  ${!mobileView && "dv__fnt20  font-weight-bold"}`}
                  >
                    {lang.noCardsFound}
                  </p>
                </div>
              </div>
            )}
            {showLoader && !mobileView ? (
              <div className="loaderCss">
                <CustomDataLoader type="ClipLoader" loading={true} size={60} />
              </div>
            ) : ""}
          </div>

        </div>


        {/* Add Card Model */}
        <Drawer
          open={toggleaddCardDrawer}
          anchor="right"
          onClose={() => handleCloseDrawer()}
        >
          <AddCard onClose={() => handleCloseDrawer()} />
        </Drawer>

        {/* Delete Confirmation Model */}
        <Drawer
          open={toggledeleteCardDrawer}
          anchor="bottom"
          onClose={closeConfirmModel}
        >
          <DeleteCardConfirm
            title={lang.cardDeleteConfirmation}
            selectedCard={selectedCard}
            handleDeleteCard={handleDeleteCard}
            onClose={closeConfirmModel}
          />
        </Drawer>
        <style jsx>
          {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .cardLoaderCss{
            position: absolute;
            top: 41%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
          :global(.MuiButton-root:hover) {
            text-decoration: none;
            background-color: var(--l_base_o60);
        }
          :global(.MuiButton-outlined){
            padding:0.470rem 1.13rem!important;
          }
          :global(.ptr),
          :global(.ptr__children){
            overflow:${!mobileView && "unset!important"};
          }
        `}
        </style>
      </PullToRefresh>
    </Wrapper>
  );
}
