import SumsubWebSdk from '@sumsub/websdk-react'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import isMobile from '../../hooks/isMobile';
import { close_dialog, startLoader, stopLoader } from '../../lib/global/loader';

const SubSum = (props) => {
    const router = useRouter()
    const [mobileView] = isMobile()

    useEffect(() => {
        startLoader()
    }, [])

    const redirect = (router) => {
        setTimeout(() => {
            close_dialog("SumSub")
            window.location.href = "/"
        }, 7000)
    }

    const onReady = () => {
        stopLoader()
        console.log("onReady")
    }

    const accessTokenExpirationHandler = (accessToken) => {
        console.log("accessTokenExpirationHandler", accessToken)
    }

    const messageHandler = (data, payload) => {
        if (data == "idCheck.onInitialized") {
            stopLoader()
        }
        if (data == "idCheck.applicantStatus" && payload.levelName === "basic-kyc-level") {
            stopLoader()
            console.log("documentsUploaded")
            redirect(router)

        }
        console.log("onMessage", data, payload)
    }

    const errorHandler = (error) => {
        console.error("onError", error)
        stopLoader()
    }

    const onActionSubmitted = (e) => {
        console.log("onActionSubmitted", e)
    }

    const onApplicantSubmitted = (e) => {
        console.log("onApplicantSubmitted", e)
        // Router.push("/")
    }
    const setCustomVhToBody = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
    };

    useEffect(() => {
        setCustomVhToBody();
        window.addEventListener('resize', setCustomVhToBody);

        return () => {
            window.removeEventListener('resize', setCustomVhToBody);
        };
    }, []);

    return <>
        <div className='sumsubParent'>
            <SumsubWebSdk
                accessToken={props.accessToken}
                expirationHandler={accessTokenExpirationHandler}
                config={props.config}
                options={{ addViewportTag: false, adaptIframeHeight: true }}
                onReady={onReady}
                onMessage={messageHandler}
                onError={errorHandler}
                onActionSubmitted={onActionSubmitted}
                onApplicantSubmitted={onApplicantSubmitted}
            />
        </div>
        <style jsx>{`
        .sumsubParent{
            height:${mobileView && "calc(var(--vhCustom, 1vh) * 90) !important"};
            overflow-y:${mobileView && "scroll"};
        }
        `}
        </style>

    </>
}

export default SubSum;