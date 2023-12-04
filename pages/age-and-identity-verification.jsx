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
                        <p>JUICY VENTURES intends that its website and services are accessed and used only by persons who are of the age of majority.&nbsp;</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>1)&nbsp; &nbsp;&nbsp;I am 12 years old, can I use &nbsp;JUICY VENTURES services?</h3>
                        <p>&nbsp;</p>
                        <p>It is the policy of JUICY VENTURES to admit a person who is the age 18 or older. Therefore, since you are less than 18 you cannot use JUICY VENTURES&apos; services.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>2)&nbsp; &nbsp;&nbsp;Why are persons less than 18 years not admitted to the JUICY VENTURES platform?</h3>
                        <p>&nbsp;</p>
                        <p>Please check our Terms and Conditions which specify that you should have the right, authority, and capacity to agree to and abide by the Terms and Conditions.&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>As per applicable law, persons who are less than 18 years are considered to be incompetent to contract and provide consent.</p>
                        <p>&nbsp;</p>
                        <p>Also, certain content on our platform may be suitable only for adults and not for children.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>3)&nbsp; &nbsp;&nbsp;How do JUICY VENTURES attempt to verify the age and identity of users?</h3>
                        <p>&nbsp;</p>
                        <p>JUICY VENTURES implements multiple tools and mechanisms in its business environment to verify the age and identity of users. These include but are not limited to:</p>
                        <p><br /></p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Using a dedicated team equipped with industry best practices and tools to perform age and identify verification</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Engagement of third-party service providers to perform age and identify verification&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Requiring the users to provide certain documentation at the time of account registration. These documents include documents related to age and identity verification such as government photo ID, standalone selfie, selfie while holding their photo ID, &nbsp;bank account information.</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;We also constantly perform know-the-user process.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>4)&nbsp; &nbsp;&nbsp;Why are JUICY VENTURES so strict in the admission of members and identity verification?</h3>
                        <p><br /></p>
                        <p>This is for the users&rsquo; benefit. If the identity is verified, there are fewer chances that fake persons will operate in our environment. When these fake persons don&rsquo;t operate in our setup, there is a high chance that our environment will be free from fraudulent and illegal transactions/content.</p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>5)&nbsp; &nbsp;&nbsp;What if the user fails to provide the necessary age and identify verifications?</h3>
                        <p><br /></p>
                        <p>We will either not open the account of such person or if such person has opened one, suspend the account of such a user until the user provides us with the necessary documentation. That means the relevant content will be blocked from viewing for the time period of suspension.</p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>6)&nbsp; &nbsp;&nbsp;What is the retention policy of JUICY VENTURES related to the age and identity verification information made available to JUICY VENTURES?</h3>
                        <p><br /></p>
                        <p>We will retain your personal information only for as long as necessary. We will retain your information as long as we have a continuing relationship with you such as if you are availing services from us. We will retain the information to comply with any of our legal or contractual obligations. On the expiry of any foregoing stated periods, as applicable, we will either delete or de-identify your personal information.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>7)&nbsp; &nbsp;&nbsp;Do JUICY VENTURES sell age and identity verification information?&nbsp;</h3>
                        <p>No, JUICY VENTURES does not monetize age and identity verification information.</p>
                        <p><br /></p>
                        <p>&nbsp;</p>
                        <h3>8)&nbsp; &nbsp;&nbsp;Is there a guarantee that JUICY VENTURES will be able to prevent users of age less than 18 years from registering for its services?</h3>
                        <p>&nbsp;</p>
                        <p>JUICY VENTURES will do commercially reasonable efforts to prevent its services from being used by users less than 18 years. However, there may be certain elements in society who will always try to create or develop certain tools or measures to circumvent our systems and/our circumvent our systems. However, once we are aware that any user has circumvented our systems or breached our user agreement, then in such case we will terminate such person&apos;s account and will also report such person to law enforcement authorities.</p>
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