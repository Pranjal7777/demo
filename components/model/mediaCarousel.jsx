import React, { useEffect, useRef, useState } from 'react'
import { SLIDER_LEFT_ARROW } from '../../lib/config/logo';
import Icon from '../image/icon';
import { P_CLOSE_ICONS, videoPlay_icon } from '../../lib/config';
import Image from '../image/image';
import { Avatar } from '@material-ui/core';
import { s3ImageLinkGen } from '../../lib/UploadAWS/uploadAWS';
import useProfileData from '../../hooks/useProfileData';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ProgressRangeBar from '../../containers/imageZoom/progressBar';
import useLang from '../../hooks/language';
import ReactJWPlayer from "react-jw-player";
import { close_drawer } from '../../lib/global/loader';
import { IMAGE_LOCK_ICON } from '../../lib/config/homepage';
import { CoinPrice } from '../ui/CoinPrice';
import { carouselPaginationSubject } from '../../lib/rxSubject';
import isMobile from '../../hooks/isMobile';


/**
 * @description image and video carousel slider with zoom functionality
 * @author kashinath
 * @date 26/05/2023
 */


const MediaCarousal = (props) => {
    const [profile] = useProfileData();
    const router = useRouter();
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [zoomValue, setZoomValue] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [initialDistance, setInitialDistance] = useState(0);
    const selectedMediaRef = useRef(null);
    const pageCount = useRef(1)
    const hasMore = useRef(true)
    const rxRef = useRef()
    const distRef = useRef(0);
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const swipStartRef = useRef(0);

    const { // mandatory
        selectedMediaIndex,
        scrolledPositionRef,
        isTransform = true
    } = props;

    const {
        isProfileShow = true,
        isThumbnailShow = true,
    } = props;

    let propAsstes = props?.assets || []

    const [assets, setAssets] = useState([])

    useEffect(() => {
        if (propAsstes) {
            setAssets([...propAsstes])
        }
    }, [propAsstes])

    useEffect(() => {
        rxRef.current = carouselPaginationSubject.subscribe((payload) => {
            if (payload) {
                if (payload?.pageCount) {
                    pageCount.current = payload?.pageCount
                }
                if (payload?.data && Array.isArray(payload?.data)) {
                    setAssets((prev) => payload?.replace ? [...payload?.data] : [...prev, ...payload?.data])
                }
                hasMore.current = payload?.hasMore
            }
        })
        return () => {
            if (rxRef.current) {
                rxRef.current?.unsubscribe()
                rxRef.current = undefined;
            }
        }
    }, [])

    useEffect(() => {
        if (assets.length > 0) {
            handleSelectedThumbnail(scrolledPositionRef.current || 0)
        }
    }, [assets])

    // use for zoom functionality
    const handleMouseDown = (e) => {
        e.stopPropagation()
        if (e.touches?.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            let initDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            setInitialDistance(initDistance)
            return
        }
        if (!e.touches || e.touches?.length <= 1) {
            setIsDragging(true);
        }

        if (e.touches && e.touches[0]) {
            setStartPosition({ x: e.touches[0].screenX - position.x, y: e.touches[0].screenY - position.y });
        } else {
            setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
        }

    };

    function getZoomLevel(event) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

            // Calculate the zoom level as the ratio of current distance to initial distance
            const zoomLevel = (currentDistance / initialDistance) * 100;
            setZoomValue(zoomLevel);
            setScale(1 + (zoomLevel / 100));
            return zoomLevel;
        }

        return 0; // No zoom (single touch)
    }
    useEffect(() => {
        const id = setTimeout(() => {
                if (selectedMediaRef?.current) {
                    selectedMediaRef?.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                        inline: 'end',
                    });
                }

            }, 1500);
        return clearTimeout(id)

    }, [props.selectedMediaId]);

    const handleMouseMove = (e) => {
        e.stopPropagation()
        if (e.touches?.length === 2) {
            getZoomLevel(e);
            return;
        }
        if (!isDragging || zoomValue < 20) return;

        if (e.touches && e.touches[0]) {
            setPosition({ x: e.touches[0].screenX - startPosition.x, y: e.touches[0].screenY - startPosition.y });
        } else {
            setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setInitialDistance(0)
    };

    const handleWheel = (e) => {
        if (e.deltaY < 0 && zoomValue < 300) {
            setZoomValue(zoomValue + 3);
            setScale(1 + zoomValue / 100);
        } else if (e.deltaY > 0 && zoomValue > 0) {
            setZoomValue(zoomValue - 3);
            setScale(1 + zoomValue / 100);
        }
    };

    const handleZoomChange = (value) => {
        const zoomFactor = value / 100;
        setScale(1 + zoomFactor);
        setZoomValue(value);
        if (value < 15) {
            setPosition({ x: 0, y: 0 })
        }
    };
    // end zoom functionality

    const ImageContainerRef = React.useRef(null);
    const thumbnailSlider = React.useRef(null);

    useEffect(() => {
        const ImageContainer = ImageContainerRef.current;
        if (ImageContainer) ImageContainer.style.transform = `translateX(-${(selectedMediaIndex) * 100}%)`;
        scrolledPositionRef.current = selectedMediaIndex;
        handleSelectedThumbnail(scrolledPositionRef.current);
    }, [selectedMediaIndex]);

    const handleOnClickThumbnail = (index) => {
        const ImageContainer = ImageContainerRef.current;
        if (ImageContainer) ImageContainer.style.transform = `translateX(-${(index) * 100}%)`;
        scrolledPositionRef.current = index;
        handleSelectedThumbnail(scrolledPositionRef.current);
    }

    const prevSlide = () => {
        const ImageContainer = ImageContainerRef.current;
        if (!assets.length) return;
        if (!scrolledPositionRef.current) {
            ImageContainer.style.transform = `translateX(-${(assets.length - 1) * 100}%)`;
            scrolledPositionRef.current = assets.length - 1;
            handleSelectedThumbnail(assets.length - 1);
            return;
        }
        if (ImageContainer) ImageContainer.style.transform = `translateX(-${(scrolledPositionRef.current - 1) * 100}%)`;
        scrolledPositionRef.current -= 1;
        handleSelectedThumbnail(scrolledPositionRef.current);
    }

    const nextSlide = () => {
        const ImageContainer = ImageContainerRef.current;
        if (!assets.length) return;
        if ((scrolledPositionRef.current + 1) >= assets?.length) {
            if (hasMore.current && props?.paginationCallback) {
                props?.paginationCallback(pageCount.current)
            } else {
                ImageContainer.style.transform = `translateX(0%)`;
                scrolledPositionRef.current = 0;
                handleSelectedThumbnail(0);
            }
            return;
        }
        if (ImageContainer) ImageContainer.style.transform = `translateX(-${(scrolledPositionRef.current + 1) * 100}%)`;
        scrolledPositionRef.current += 1;
        handleSelectedThumbnail(scrolledPositionRef.current);
    }



    const handleTouchStart = (e) => {
        swipStartRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (scale > 1) {
            return;
        }
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - swipStartRef.current;
        if (deltaX > 30 && scrolledPositionRef.current > 0) {
            prevSlide()
        } else if (deltaX < -30 && scrolledPositionRef.current < assets.length - 1) {
            nextSlide()
        }
        swipStartRef.current = 0;
    };

    const handleSelectedThumbnail = (selectedIndex) => {
        if (hasMore.current && props?.paginationCallback && selectedIndex === assets.length - 1) {
            props?.paginationCallback(pageCount.current)
        }
        const thumbnails = document.querySelectorAll('div.thumbnail');
        const thumbDiv = thumbnailSlider.current
        Array.from(thumbnails).forEach((ele, idx) => {
            thumbnails[idx]?.classList.remove('activeThumbnail');
        })
        thumbnails[selectedIndex]?.classList.add('activeThumbnail');
        if (thumbnails[selectedIndex]) {
            var scrollLeft = thumbnails[selectedIndex].offsetLeft - (thumbDiv.offsetWidth - thumbnails[selectedIndex].offsetWidth) / 2;
            thumbDiv.scrollTo({ left: scrollLeft })
        }
        setStartPosition(({ x: 0, y: 0 }))
        setScale(1)
        setPosition({ x: 0, y: 0 })
        setZoomValue(0)
    }

    const handlePlayAndResume = (playerId) => {
        const player = document.getElementById(playerId); // Get the JW Player element
        if (player && player.requestFullscreen) {
            player.requestFullscreen(); // Request fullscreen mode
        }
    };

    function touchStart(event) {
        const touches = event.touches;
        if (touches?.length === 2) {
            setIsDragging(false)
            distRef.current = getDistance(touches[0], touches[1]);
        } else if (touches.length === 1) {
            setIsDragging(true)
            let initialX = touches[0].clientX - (position.x * scale);
            let initialY = touches[0].clientY - (position.y * scale);
            setStartPosition({ x: initialX, y: initialY })
        }
    }
    function touchMove(event) {
        const touches = event.touches;
        if (touches?.length === 2 && !isDragging) {
            const currentDistance = getDistance(touches[0], touches[1]);
            const nscale = currentDistance / distRef.current;
            const deltaX = touches[0].clientX - startPosition.x;
            const deltaY = touches[0].clientY - startPosition.y;
            // Adjust translation based on the zoom level
            const newScale = scale * nscale;
            if (newScale >= 1 && newScale < 5) {
                setScale(newScale);
                const scaledDeltaX = deltaX / nscale;
                const scaledDeltaY = deltaY / nscale;
                setPosition({ x: scaledDeltaX, y: scaledDeltaY });
                setZoomValue(newScale * 100)
            }
            //   document.getElementById('zoom-image').style.transform = `scale(${scale})`;
        } else if (touches.length === 1 && isDragging && scale !== 1) {
            const deltaX = touches[0].clientX - startPosition.x;
            const deltaY = touches[0].clientY - startPosition.y;
            // Adjust translation based on the zoom level
            const scaledDeltaX = deltaX / scale;
            const scaledDeltaY = deltaY / scale;
            setPosition({ x: scaledDeltaX, y: scaledDeltaY });
        }
    }

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    const handleWheelScroll = (e) => {
        const container = thumbnailSlider.current;

        if (container) {
            container.scrollLeft += e.deltaY; // Use deltaY to determine the scroll direction

            // Prevent the default behavior of the wheel event to avoid conflicts
            e.preventDefault();
        }
    };


    return (
        <div className='outerContainer w-100 position-relative'>
            {isProfileShow ? <header className='d-flex justify-content-between align-items-center p-3'>
                <div className="d-flex flex-row justify-content-start align-items-center cursorPtr"
                    onClick={() => router.push('/profile')}
                >
                    <div className="px-3">
                        {profile?.profilePic ? <Avatar alt={profile.firstName} src={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic, 70, 42, 42)} />
                            :
                            <div className="tagUserProfileImage">{profile?.firstName ? profile?.firstName[0] : "" + (profile?.lastName && profile?.lastName[0])}</div>
                        }
                    </div>
                    <div className="">
                        <p className="m-0 bold fntSz14 text-app">{profile.username}</p>
                        <p className="m-0 fntSz10 text-app">@{profile.username}</p>
                    </div>
                    <hr className="m-0" />
                </div>
                <div className='d-flex'>
                    {
                        props.isLocked ? <span onClick={props?.handleUnlock} className="cursorPtr btn-subscribe  px-3 py-1 txt-heavy fntSz12">{lang.unlock}</span> : ""
                    }
                    <div className='hover_bgClr' onClick={props.onClose || close_drawer('openMediaCarousel')} style={{ borderRadius: "10px", padding: '6px' }}>
                        <Icon
                            icon={`${P_CLOSE_ICONS}#cross_btn`}
                            hoverColor='var(--l_base)'
                            color={'var(--l_app_text)'}
                            width={20}
                            height={20}
                            alt="Back Arrow"
                        />
                    </div>
                </div>
            </header> :
                <div className='hover_bgClr position-absolute' onClick={props.onClose || close_drawer('openMediaCarousel')} style={{ borderRadius: "10px", padding: '6px', top: "10px", right: "10px", zIndex: "99" }}>
                    <Icon
                        icon={`${P_CLOSE_ICONS}#cross_btn`}
                        hoverColor='var(--l_base)'
                        color={'#fff'}
                        width={20}
                        height={20}
                        alt="Back Arrow"
                    />
                </div>
            }
            <main className='w-100 position-relative' style={{ height: `calc(100% ${isThumbnailShow ? "- 87px" : ""} ${isProfileShow ? "- 73px" : ""})` }}>
                {/* <div className='d-flex justify-content-between align-items-center position-absolute w-100 px-1 px-md-3' style={{ zIndex: "999", top: 'calc(50% - 22px)' }}> */}
                {(!mobileView && assets?.length > 1) ? <Icon
                    icon={`${SLIDER_LEFT_ARROW}#left_arrow`}
                    hoverColor='var(--l_base)'
                    color={'var(--l_app_text)'}
                    width={44}
                    height={44}
                    onClick={prevSlide}
                    class={`${scrolledPositionRef.current === 0 && 'disable_UI'} cursorPtr leftArrow`}
                    alt="Back Arrow"
                /> : ""}
                {(!mobileView && assets?.length > 1) ? <Icon
                    icon={`${SLIDER_LEFT_ARROW}#left_arrow`}
                    hoverColor='var(--l_base)'
                    color={'var(--l_app_text)'}
                    width={44}
                    height={44}
                    onClick={nextSlide}
                    class={`${scrolledPositionRef.current === assets.length - 1 && 'disable_UI'} cursorPtr rightArrow`}
                    style={{ transform: "rotate(180deg) translate(0%, 50%)" }}
                    alt="Back Arrow"
                /> : ""}
                {/* </div> */}
                <div className='mainSlider d-flex w-100 h-100 text-app' ref={ImageContainerRef} >
                    {assets?.map((imgData, idx) => (
                        <div className='currImg h-100 w-100 d-flex flex-column mx-0 align-items-end' key={idx}>
                            <div className={`col-12 col-md-8 px-0 imageContainerStyles flex-1-1-full ${imgData.isLocked ? 'locked position-relative' : ""}`}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {
                                    imgData?.mediaType === "VIDEO" ?
                                        imgData.isLocked ? <div onClick={props.handleUnlock} className='lockImg'>
                                            <div className='lockIcon d-flex flex-column align-items-center'>
                                                <Icon
                                                    icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                                                    color={'#fff'}
                                                    size={60}
                                                    unit="px"
                                                    viewBox="0 0 68.152 97.783"
                                                />
                                                {
                                                    props.isLocked ? <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-2 ${"fntSz11" || mobileView ? 'fntSz13' : ''}`}>
                                                        <CoinPrice displayStyle={'flex'} price={props?.price || "0"} prefixText={lang.unlockPostFor} size={14} iconSize='14' />
                                                    </span> : ""
                                                }
                                            </div>
                                            <Image
                                                src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, imgData?.mediaUrl || imgData?.mediaThumbnailUrl, 100, 480, 480, imgData.isLocked ? 20 : 0) : imgData?.mediaUrl}
                                                width={imgData?.width || "100%"}
                                                height={imgData?.height || 'auto'}
                                                className="sliderMainImg"
                                                style={{ filter: 'blur(40px)' }}
                                            />
                                        </div> : <div className='videoPlay h-100 w-100'>{imgData?.mediaUrl ?
                                            <ReactJWPlayer
                                                playerId={imgData?.mediaUrl}
                                                playerScript="https://content.jwplatform.com/libraries/YIw8ivBC.js"
                                                playlist={[{
                                                    image: isTransform ? s3ImageLinkGen(S3_IMG_LINK, imgData?.mediaThumbnailUrl, 70, 480, 480) : imgData?.mediaThumbnailUrl,
                                                    file: imgData?.mediaUrl
                                                }]}
                                                onResume={() => { handlePlayAndResume(imgData?.mediaUrl) }}
                                                onPlay={() => { handlePlayAndResume(imgData?.mediaUrl) }}
                                                onEnterFullScreen={(event) => {
                                                    setTimeout(() => {
                                                        screen.orientation.lock('portrait');
                                                    }, 500)
                                                }}
                                                aspectRatio='9:16'
                                            />
                                            : <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
                                                <p className='dv_appTxtClr text-center'>{lang.videoProcessing}</p>
                                            </div>}</div>

                                        :
                                        <div className='h-100'>{imgData.isLocked ? <div onClick={props.handleUnlock} className='lockImg h-100'>
                                            <div className='lockIcon d-flex flex-column align-items-center'>
                                                <Icon
                                                    icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                                                    color={'#fff'}
                                                    size={60}
                                                    unit="px"
                                                    viewBox="0 0 68.152 97.783"
                                                />
                                                {
                                                    props.isLocked ? <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-2 ${"fntSz11" || mobileView ? 'fntSz13' : ''}`}>
                                                        <CoinPrice displayStyle={'flex'} price={props?.price || "0"} prefixText={lang.unlockPostFor} size={14} iconSize='14' />
                                                    </span> : ""
                                                }
                                            </div>
                                            <Image
                                                src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, imgData?.mediaUrl, 90, 480, 480, imgData.isLocked ? 20 : 0) : imgData?.mediaUrl}
                                                width={imgData?.width || "100%"}
                                                height={imgData?.height || '100%'}
                                                className="sliderMainImg"
                                                style={{ filter: 'blur(40px)' }}
                                            />
                                        </div> : <Image
                                            src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, imgData?.mediaUrl, 90) : imgData?.mediaUrl}
                                            width={imgData?.width || "100%"}
                                            height={imgData?.height || 'auto'}
                                            onMouseDown={handleMouseDown}
                                            onTouchStart={touchStart}
                                            onMouseMove={handleMouseMove}
                                            onTouchMove={touchMove}
                                            // onTouchEnd={handleMouseUp}
                                            onMouseUp={handleMouseUp}
                                            onWheel={handleWheel}
                                            className="sliderMainImg"
                                                isLazy={true}
                                        />}</div>
                                }
                            </div>
                            {imgData?.mediaType !== "VIDEO" ?
                                <div className='col-12 text-right mb-4 d-flex justify-content-end flex-1-1-auto'>
                                    <ProgressRangeBar value={zoomValue} onChange={handleZoomChange} />
                                </div> : ""
                            }
                        </div>
                    ))}
                </div>
            </main>
            {isThumbnailShow ? <footer className='thumbnailSlider scroll-hide' ref={thumbnailSlider} style={{ scrollBehavior: 'smooth' }} onWheel={handleWheelScroll}>
                {assets?.map((data, idx) => (
                    <div ref={(ref) => {
                        if (props.selectedMediaId === data._id) {
                            selectedMediaRef.current = ref;
                        }
                    }}
                        onClick={() => handleOnClickThumbnail(idx)} key={data._id + idx} id={data._id} className={`${idx == scrolledPositionRef.current && "activeThumbnail"} thumbnail`}>
                        {
                            data?.mediaType === "VIDEO"
                                ?
                                <div className='h-100'>
                                    {data.isLocked ? <div onClick={props.handleUnlock} className='lockImg locked position-relative'>
                                        <div className='lockIcon'>
                                            <Icon
                                                icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                                                color={'#fff'}
                                                size={50}
                                                unit="px"
                                                viewBox="0 0 68.152 97.783"
                                            />
                                        </div>
                                        <Image
                                            src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, data?.mediaUrl, 100, 120, 120, data.isLocked ? 20 : 0) : data?.mediaUrl}
                                            width={data?.width || "100%"}
                                            height={data?.height || 'auto'}
                                            className="sliderMainImg"
                                            style={{ filter: 'blur(40px)' }}
                                        />
                                    </div> : <div className='position-relative w-100 h-100 video_section'>
                                        <div className='video_play_icon'>
                                            <Icon
                                                icon={videoPlay_icon + "#videoPlayIcon"}
                                                width={50}
                                                height={50}
                                                viewBox="0 0 70.311 70.313"
                                            />
                                        </div>
                                        <Image
                                            src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, data?.mediaThumbnailUrl, 70, 120, 120, data.isLocked ? 20 : 0) : data?.mediaThumbnailUrl}
                                            width="100%"
                                            height='100%'
                                            style={{ objectFit: "cover", filter: "brightness(0.8)", borderRadius: '10px' }}
                                        />
                                    </div>}
                                </div>
                                :
                                <div className='h-100'>{data.isLocked ? <div onClick={props.handleUnlock} className='lockImg locked position-relative'>
                                    <div className='lockIcon'>
                                        <Icon
                                            icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                                            color={'#fff'}
                                            size={50}
                                            unit="px"
                                            viewBox="0 0 68.152 97.783"
                                        />
                                    </div>
                                    <Image
                                        src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, data?.mediaUrl, 100, 120, 120, data.isLocked ? 20 : 0) : data?.mediaUrl}
                                        width={data?.width || "100%"}
                                        height={data?.height || 'auto'}
                                        className="sliderMainImg"
                                        style={{ filter: 'blur(40px)', borderRadius: '10px' }}
                                    />
                                </div> : <Image
                                    src={isTransform ? s3ImageLinkGen(S3_IMG_LINK, data?.mediaUrl, 70, 120, 120, data.isLocked ? 20 : 0) : data?.mediaUrl}
                                    alt={data?.title}
                                    width={"100%"}
                                    height={"100%"}
                                    style={{ objectFit: "cover", borderRadius: '10px' }}
                                />}</div>

                        }
                    </div>
                ))}
            </footer> : ""}
            <style jsx>
                {`
                .outerContainer {
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: visibility .3s,opacity .3s cubic-bezier(.1,.82,.25,1);
                    width: 100%;
                    height: calc(var(--vhCustom, 1vh) * 100);
                    overflow-x: hidden;
                }
                .mainSlider {
                    transition: all 450ms ease-in-out 0ms;
                }
                :global(.imageContainerStyles img) {
                    height: 100% !important;
                }
                .imageContainerStyles{
                    position: relative;
                    max-width: 100%;
                    height: calc(calc(var(--vhCustom, 1vh) * 100 ) - 11.5rem);
                    overflow: hidden;
                }
                .thumbnailSlider {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: 98%;
                    margin: auto;
                    height: auto;
                    cursor: pointer;
                    transition: all 450ms ease-in-out 0ms;
                    overflow-x: auto;
                }
                .currImg {
                    max-height: 100% !important;
                    flex: 0 0 100%;
                }
                .thumbnail {
                    box-sizing: border-box;
                    border-radius: 12px;
                    overflow: hidden;
                    min-width: 80px;
                    max-width: 120px;
                    width: 100%;
                    height: 80px;
                    margin: 3px;
                }
                .activeThumbnail {
                    border: 3px solid var(--l_base);
                    border-collapse: separate;
                    padding: 2px;
                }
                :global(.sliderMainImg){
                    transform: scale(${scale}) translate(${position.x}px, ${position.y}px);
                    object-fit: contain;
                    height: calc(calc(var(--vhCustom, 1vh) * 100 ) - 16rem);
                    cursor: move;
                }
                @media(max-width: 576px) {
                    .imageContainerStyles{
                    height: calc(calc(var(--vhCustom, 1vh) * 100 ) - 16rem);
                    }
                    :global(.sliderMainImg){
                        height: calc(calc(var(--vhCustom, 1vh) * 100 ) - 16rem);
                    }
                }
                :global(.jw-icon.jw-icon-display) {
                    z-index: 1000 !important;
                    position: relative;
                }
                :global(.jw-button-container div[aria-label="Logo"]) {
                    display: none !important
                }
                :global(.leftArrow) {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 999;
                }
                :global(.rightArrow) {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 999;
                }
                .video_play_icon{
                    position: absolute;
                    top: calc(50% - 25px);
                    left: calc(50% - 25px);
                    z-index: 1;
                }
                .lockIcon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 3;
                    transform: translate(-50%, -50%);
                }
                .lockImg {
                    height: 100%;
                    width: 100%;
                }
                .locked::after {
                    display:block;
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top:0;
                    left:0;
                    background: var(--l_linear_btn_bg);
                    z-index:2;
                    opacity: 0.7;
                }
                :global(.outerContainer .jwplayer.jw-flag-aspect-mode), :global(.outerContainer .videoPlay > div) {
                    height: 100% !important;
                }
                .flex-1-1-auto {
                    flex: 1 1 auto;
                }
                .flex-1-1-full {
                    flex: 1 1 100%;
                }
            `}
            </style>
        </div>
    );
};
export default MediaCarousal;