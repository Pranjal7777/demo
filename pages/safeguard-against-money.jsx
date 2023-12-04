import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import CustomHead from "../components/html/head";
import Image from "../components/image/image";
import isMobile from "../hooks/isMobile";
import { WEB_LINK } from "../lib/config";
import { backArrow } from "../lib/config/homepage";
import { goBack } from "../lib/global";
import Header from "../components/landingHeader/Header";

export default function AgeAndIdentityVerification(props) {
    const router = useRouter();
    const [mobileView] = isMobile();

    return (
        <React.Fragment>
            <CustomHead
                url={`${WEB_LINK}/terms-and-conditions`}
                {...props.seoSettingData}
            />
            <Header {...props}/>
            <div className='html_page_container d-flex justify-content-center'>
                <div className={`html_page ${mobileView ? "px-3" : "px-5"}`}>
                {router.query.goback == 'legal' && <Button className="rounded-pill text-primary mb-3" onClick={() => goBack()}>
                    <Image
                        alt="model-registration"
                        src={backArrow}
                        width={22}
                        id="scr2"
                        className='mr-2'
                    />
                    Back
                    </Button>}
                    <div>
                        <p>We at JUICY VENTURES consider it to be our highest obligation to safeguard your hard-earned money from payment fraud and money laundering. For this purpose, JUICY VENTURES &nbsp;has implemented a couple of controls to prevent, identify, and address fraud and money laundering.</p>
                        <p><br /></p>
                        <h3>1)&nbsp; &nbsp;&nbsp;What does JUICY VENTURES do to prevent, identify, and address suspicious transactions on its website?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES has taken the following steps to address frauds and money laundering on its website:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Setting up inbuilt mechanisms such as minimum and maximum pricing, daily limits, and identity verification.</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Utilization of a dedicated team that constantly attempts to identify suspicious transactions such as multiple failed payment card attempts, payment attempts from flagged IP addresses, purchases with bad email domains</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;The dedicated team is constantly trained on industry best practices to effectively combat fraudulent transactions</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Immediate investigation of any red flags noticed</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Reporting red flags, fraudulent transactions, and illegitimate accounts &nbsp;to law enforcement authorities</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Taking such steps as may be reasonable at the discretion of Juicy Ventures such as including but not limited to suspension and/or termination of the suspicious account, removal of content</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Utilization of third-party technology as needed to help combat the threat of fraud effectively</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Working in collaboration with law enforcement agencies to bring the perpetrator behind bars</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>2)&nbsp; &nbsp;&nbsp;Is there a guarantee that JUICY VENTURES will be able to prevent frauds and money laundering on its website?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES will do commercially reasonable efforts to prevent any fraudulent transactions and/or activities on its website. However, no guarantee can be provided that all such transactions will be prevented or identified at all times. However, with the various steps outlined herein, JUICY VENTURES &nbsp;believes that the prevalence of fraudulent transactions on its website will be at a minimum. It is the constant endeavor of JUICY VENTURES to ensure that its website and services are free from fraudulent transactions.&nbsp;</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>3)&nbsp; &nbsp;&nbsp;How does JUICY VENTURES comply with applicable laws on money laundering and fraud?</h3>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;We use third-party service providers to check relevant databases such as the Office of Foreign Assets Controls, Denied person List, terrorism, drug trafficking, and arms dealing list and similar others. We do not deal with persons identified on such lists.&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;If we believe that any of our users is on such a list, we will immediately terminate that person&rsquo;s account and report the same to the legal enforcement authority&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Our dedicated legal and compliance team ensures that &nbsp;we are at all times compliant with applicable anti-money laundering laws</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Also, See our FAQ 1</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>4)&nbsp; &nbsp;&nbsp;What should I do if I suspect any fraudulent transactions in my account?</h3>
                        <p><br /></p>
                        <p>Instantly report any irregularities in your transactions/account to&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;us at <a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a></p>
                        <p>⦁&nbsp; &nbsp;&nbsp;your bank&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;legal enforcement authorities</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p><br /></p>
                    </div>

                </div>
            </div>
            <style jsx>
                {`
        .html_page_container {
            width: 100%;
          }
          .html_page {
            position: absolute;
            top: 52px;
            width: ${mobileView ? "100%" : "85.359vw"};
          }
          .html_page p{
            font-size: ${mobileView ? "3.7vw" : "1.7vw"};
          }
        `}
            </style>
        </React.Fragment>
    );
}