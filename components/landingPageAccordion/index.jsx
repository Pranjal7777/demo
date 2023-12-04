import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  // root: {
  //     width: '100%',
  // },
  // heading: {
  //     // fontWeight: 900,
  //     fontSize: '10vw',
  // },
}));

const Accordion = withStyles({
  // root: {
  //   boxShadow: 'none',
  //   '&:not(:last-child)': {
  //     borderBottom: 0,
  //   },
  //   '&:before': {
  //     display: 'none',
  //   },
  //   '&$expanded': {
  //     margin: 'auto',
  //   },
  // },
  // expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  // root: {
  //     backgroundColor: '#DEEEFA',
  //     borderBottom: '1px solid rgba(0, 0, 0, .125)',
  //     marginBottom: -1,
  //     minHeight: 56,
  //     '&$expanded': {
  //       minHeight: 56,
  //     },
  //   },
  content: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
  },
})(MuiAccordionSummary);

export default function SimpleAccordion(props) {
  // const classes = useStyles();
  
  const {
    outsideText,
    insideText3,
    array,
    insideText_li1,
    insideText_li2,
    insideText_li3,
    isSubData,
    subData,
    insideHead,
    insideText,
    insideText1,
    insideText2,
    expanded,
    messagesList,
    insideTextList,
    panel,
    ...otherPros
  } = props;
  const [isExpanded, setIsExpanded] = useState(expanded);
  console.log('isExpanded -> ', isExpanded);
  // console.log('props -> ', props);

  const handleSubData = () => {
    return subData.map((single, index) => (
      <div key={index}>
        <h3
          style={{
            fontSize: "1vw",
            color: "#6189c4",
          }}
        >
          {single.heading}
        </h3>
        <p
          style={{
            fontSize: "0.8vw",
          }}
        >
          {single.para}
        </p>
      </div>
    ));
  };

  const handleAccordionExpand = () => {
    setIsExpanded(true);
  };

  const handleAccordionCollapse = () => {
    setIsExpanded(false);
  };

  const handleOnAccordionClick = (panel) => (event, toExpand) => {
    // toExpand -> true (expand the accordion), false ->  collapse the accordion
    toExpand ? handleAccordionExpand() : handleAccordionCollapse();
  }

  const ExpandedIcon = () => {
    return(
      isExpanded ? 
      <div className="text-white">-</div>
      :
      <div className="text-white">+</div>  
    )
  }

  return (
    <>
      <div className="">
        <Accordion expanded={isExpanded} defaultExpanded={expanded} onChange={handleOnAccordionClick()}>
          <AccordionSummary
            style={{
              width: "100%",
              backgroundColor: "none",
              fontSize: "2rem !important",
              fontWeight: '300',
              display: "flex",
              justifyContent: "space-between",
            }}
            expandIcon={<ExpandedIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              className="d-sm-block d-none"
              style={{color: "#FFFFFF", fontSize: '0.99vw !important', fontWeight: '500'}}  >
              {outsideText}
            </Typography>
            <Typography
              className="d-block d-sm-none"
              style={{color: "#FFFFFF", fontSize: '3vw !important' }}  >
              {outsideText}
            </Typography>
            <div className="col-1">
              {/* <p
                // className="museoSansFontFamily"
                onClick={handleAccordionExpand}
                style={{
                  textAlign: "end",
                  fontWeight: "600",
                  fontSize: "1.250vw",
                  color: "#FFFFFF",
                  marginRight: "0.313vw",
                  marginTop:"8px",
                }}
              >
                +
              </p> */}
            </div>
          </AccordionSummary>
          <AccordionDetails
            style={{
              textAlign: "left",
            }}
          >
            <Typography>
              <div className="accordion__container">
                <div className="d-flex my-1 accordionheading" style={{ height: "0vw" }}>
    
                    <span
                      className="museoSansFontFamily"
                      style={{
                        fontWeight: "600",
                        fontSize: "0.99vw",
                        lineHeight: "1.267vw",
                        color: "#FFFFFF",
                      }}
                    >
                      {insideHead}
                    </span>   
                    {/* <p
                      className="collapsebutton"
                      onClick={handleAccordionCollapse}
                      style={{
                        textAlign: "end",
                        fontWeight: "600",
                        fontSize: "1.250vw",
                        color: "#FFFFFF",
                        position:"absolute",
                        cursor: "pointer",
                        right:"2.70vw"
                      }}
                    >
                      -
                    </p> */}
                 
                </div>
                <p
                  className={`mx-1  my-0 ${insideHead && "pt-4"} `}
                  style={{
                    fontWeight: "400",
                    fontSize: "0.88vw",
                    color: "#FFFFFF",
                    lineHeight: "1.400vw",
                    width: "95%",
                  }}
                >
                  {insideText}
                </p>
                {insideText1 && (
                  <p
                    className="mx-1 my-2 p-0 "
                    style={{
                      fontWeight: "400",
                      fontSize: "0.833vw",
                      color: "#FFFFFF",
                      lineHeight: "1.400vw",
                    }}
                  >
                    {insideText1}
                  </p>
                )}
                {insideText2 && (
                  <p
                    className="mx-1 my-2 p-0 "
                    style={{
                      fontWeight: "400",
                      fontSize: "0.833vw",
                      color: "#FFFFFF",
                      lineHeight: "1.400vw",
                    }}
                  >
                    {insideText2}
                  </p>
                )}
                {messagesList && (
                  <ul
                    className="mx-5 my-2 p-0 "
                    style={{
                      fontWeight: "400",
                      fontSize: "0.833vw",
                      color: "#FFFFFF",
                      lineHeight: "1.400vw",
                      fontFamily: "Roboto !important"
                    }}
                  >
                    {messagesList.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul>
                )}
                {insideTextList && (
                  <div
                    className="mx-3 my-2 p-0 "
                    style={{
                      fontWeight: "400",
                      fontSize: "0.833vw",
                      color: "#FFFFFF",
                      lineHeight: "1.400vw",
                    }}
                  >
                    {insideTextList.map((item) => (
                      <div>
                        <p
                          className="mx-1 my-2 p-0 "
                          style={{
                            fontWeight: "600",
                            fontSize: "0.833vw",
                            color: "#000000",
                            lineHeight: "1.400vw",
                            fontFamily: "Roboto !important",
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="mx-1 my-2 p-0 "
                          style={{
                            fontWeight: "400",
                            fontSize: "0.833vw",
                            color: "#FFFFFF",
                            lineHeight: "1.400vw",
                            fontFamily: "Roboto !important",

                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <style jsx>
        {`
        :global(.MuiPaper-root) {
            background: none !important;
            border: 1px solid #9063FD;
            border-radius: 12px !important;
           }
          :global(.MuiAccordionSummary-root.Mui-expanded) {
            min-height: 48px !important;
          }
          p {
            font-size: 1.089vw;
            line-height: 1.307vw;
          }
          .accordion__container p {
            font-size: 1vw;
            font-family: 'Roboto' !important;
            line-height: 1.6vw !important;
          }
          :global(.MuiAccordionSummary-root){
            height: 10px;
            min-height: 40px !important;
          }
          :global(.MuiTypography-body1 ){
            line-height: 2.5;
            font-family: 'Roboto' !important;
            font-size: 1rem !important;
          }
          .museoSansFontFamily{
            line-height: 2.5;
            font-family: 'Roboto' !important;
            font-size: 1rem !important;
            font-weight: 700 !important;
          }
          @media (max-width: 575.98px) {
            .accordion__container p {
              font-size: 10px !important;
              line-height: 1.2 !important;
            }
            .accordion__container ul li {
              font-size: 3.733vw !important;
              line-height: 1.2 !important;
              
            }
            p {
              font-size: 5vw !important;
              font-weight: 500!important;
            }
            :global(.MuiTypography-body1 ){
            line-height: 1.5;
            font-family: 'Roboto' !important;
            font-size: 0.7rem !important;
            position:relative !important;
            // top:1vw!important
          }
          :global(.MuiAccordionDetails-root){
            display: block !important;
          }
          .museoSansFontFamily{
            line-height: 2.5;
            font-family: 'Roboto' !important;
            font-size: .7rem !important;
            font-weight: 700 !important;
          }
          .collapsebutton{
            position: absolute!important;
            cursor: pointer !important;
            right: 1.5vw!important;
            top: -1vw !important;
            font-weight: 500 !important;
            font-size:12px !important;
          }
          }

          @media(max-width:320px){

            :global(.MuiTypography-body1 ){
            line-height: 1.5;
            font-family: 'Roboto' !important;
            font-size: 0.6rem !important;
            position:relative !important;
          }
          :global(.MuiAccordionDetails-root){
            padding-left: 0;
            padding-right: 0;
          }
          .museoSansFontFamily{
            line-height: 2.5;
            font-family: 'Roboto' !important;
            font-size: .7rem !important;
            font-weight: 700 !important;
            margin-left: 0px !important;
            white-space: normal;
            -webkit-box-decoration-break: clone;
            padding-left:10px;
          }
          .accordionheading{
            height: auto !important;
           display: inline-block !important;
           word-break: break-word !important;
          }
          .collapsebutton{
            right: 3.5vw!important;
           top: 2vw !important;
          }
       
          }
        `}
      </style>
    </>
  );
}
