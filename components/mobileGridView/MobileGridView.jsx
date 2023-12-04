import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Button from "../../components/button/button";
import TextPost from "../TextPost/textPost";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import { Toast, startLoader, stopLoader } from "../../lib/global/loader";
import { makeScheduledPostActive } from "../../services/profile";
import { handleContextMenu } from "../../lib/helper";
const DateRangeOutlinedIcon = dynamic(() => import('@material-ui/icons/DateRangeOutlined'));

const MobileGridView = (props) => {
    const theme = useTheme();
    const [lang] = useLang();
    const [currentTime, setCurrentTime] = useState(dayjs().valueOf());
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [mobileView] = isMobile()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(dayjs().valueOf());
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const makePostActive = async (e, { postId, userId }) => {
        try {
            startLoader()
            await makeScheduledPostActive({ postId, userId })
            props.handleDialog(false);
            //   props?.setPage(1)
            Toast("Post Activated", "success");
            props.setActiveNavigationTab("grid_post")
            stopLoader()
        } catch (error) {
            stopLoader()
            Toast(error.message, "error");
            console.error(error.message)
        }
    }

    return <>
        <div className="col-4 p-0 hash_mob manageBoxSize p-1 callout-none" onContextMenu={handleContextMenu} key={props?.postId}
            onClick={() => {
                props.setId(props.postId);
                props.handleDialog(true);
            }}>

            {props.isAddBoxShadow ?
                <div className={` ${props.isScheduled && "position-relative h-100"} h-100 position-relative`}>
                    {props.mediaType === 4 ?
                        <TextPost textPost={props.postImage}
                            isVisible={props?.isVisible} />
                        :
                        <div className="adjustBoxShadow h-100 w-100 pointer"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(30, 30, 30, 0), rgba(0, 0, 0, 1)), url('${s3ImageLinkGen(S3_IMG_LINK, `${props?.postImage[0]?.type === 1 ? props?.postImage[0]?.url : props?.postImage[0]?.thumbnail}`, null, null, 230)}')`,
                            }}
                        ></div>
                    }
                    {!!props?.isScheduled && <div className="d-flex position-absolute align-items-center text-white  mb-2 fntSz8 " style={!mobileView ? { opacity: "0.95", bottom: "90%", left: "4%", width: "200px", height: "28px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.5)", zIndex: "999" } : { opacity: "0.95", bottom: "5.6rem", left: "5px", width: "100px", height: "20px", borderRadius: "6px" }}>
                        <DateRangeOutlinedIcon style={{ width: "12px", height: "12px" }} />
                        <p className="m-0 py-3 pl-1 text-center">{dayjs(props?.creationTs).format("MMM DD, h:mm a")} </p>
                    </div>}
                    {props.isScheduled && currentTime > props?.creationTs && <div className="position-absolute manageScheduleBtn callout-none" onContextMenu={handleContextMenu} style={mobileView ? { bottom: "1rem", right: "1.5rem" } : { bottom: "6rem", right: "1.5rem" }}>
                        <Button
                            type="button"
                            cssStyles={theme.blueButton}
                            onClick={(e) => makePostActive(e, { postId: props?.postId, userId: props?.userId })}
                            fclassname={`postBtn__btn p-2  disableBtn`}
                            btnSpanClass="fntSz12"
                            isDisabled={currentTime > props?.creationTs ? false : true}
                        >
                            {lang.makeActive}
                        </Button>
                    </div>}
                </div>
                : props?.postImage[0]?.type !== 4 ?
                    <FigureCloudinayImage
                        publicId={`${props.coverImage ? props.coverImage : props?.postImage[0]?.type === 1 ? props?.postImage[0]?.url : props?.postImage[0]?.thumbnail}`}
                        className='hastag__img__mobile cursorPtr radius_8'
                        style={{ objectFit: "cover" }}
                        transformWidth={250}
                        isPreview={!!props.coverImage}
                        isVisible={props?.isVisible}
                        uid={0}
                        userId={props?.userId}
                    /> :
                    <TextPost textPost={props.postImage}
                        isVisible={props?.isVisible} />
            }
            <style jsx>
                {`
                .manageBoxSize{
                    width: 27%;
                    aspect-ratio: 1/1;
                }
                :global(.manageBoxSize > span > img){
                    border-radius:5px;
                }
                :global(.adjustBoxShadow){
                    background-position: center;
                    border-radius: 4px;
                  }

                  :global(.disableBtn:disabled){
                    background:transparent;
                    border:2px solid white;
                    padding:10px 15px !important;
                    font-weight:500;
                    border-radius: 30px;
                    // opacity:50%;
                  }
                  :global(.disableBtn){
                    background:var(--l_base);
                    padding:11px 15px !important;
                    font-weight:500 !important;
                    border-radius: 30px !important;
                  }
                  .manageScheduleBtn{
                    bottom: 1rem;
                    left: 50%;
                    transform: translate(-50%, 0px);
                    width: 7rem;
                  }
                `}
            </style>
        </div>

    </>
}

export default MobileGridView
