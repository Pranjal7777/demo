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
                        <p><br /></p>
                        <h3>JUICY VENTURES MISSION, VISION, AND VALUES STATEMENT</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES aims to help creators earn a living by using our services.&nbsp;</p>
                        <p><br /></p>
                        <h3>Our Mission:</h3>
                        <p>To empower creators to earn a living and empower themselves.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>Our Vision:</h3>
                        <p>We want to provide unlimited opportunities for creators to make money by using our services. We want to provide fans with content that they will enjoy and cherish. We want both the creators and fans to use our services for their empowerment. This will eventually help us at serving our mission. Ultimately, we want more and more users (creators and fans) to join our community and empower themselves.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>Our Values:</h3>
                        <p><br /></p>
                        <p><strong>Create:</strong> Create good, Create better, Create the best! Yes, we want our creators to be creating more and more creative content each day and getting better each day.</p>
                        <p><br /></p>
                        <p><strong>Share:</strong> &nbsp;We want to be as transparent as possible in our dealings. We will share our successes as well as a failure with others. We want to share with others and learn from others. We will provide Transparency Reports demonstrating our continuing and preemptive steps to ensure safety of our users, information requested by law enforcement agencies, reporting of fraudulent and illegal transactions, reporting of CSAM, content removal information, information on user account requests accepted/declined and other relevant information sharing our transparency efforts.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p><br /></p>
                        <p><strong>Safety:</strong> We want our community to be as safe as possible. With this aim, we will implement measures on an ongoing scale to ensure the safety of the users.</p>
                        <p><br /></p>
                        <p><strong>Success:</strong> We want our people to succeed. We want our creators to write lasting success stories. We want to be proud of our association with successful creators.</p>
                        <p><br /></p>
                        <p><strong>Freedom of Expression:</strong> We want our users to express themselves freely subject to keeping in view reasonable restrictions on such freedom of speech.</p>
                        <p><br /></p>
                        <p><strong>Integrity:</strong> We want to be honest and transparent. We will adhere to moral and ethical principles in all our dealings.</p>
                        <p><br /></p>
                        <p><strong>Empowerment:</strong> We want creators to have control over their content. We will provide creators with the support they need that is right for them.</p>
                        <p><br /></p>
                        <p><strong>No Discrimination:</strong> This is an integral part of our values. We will respect all our users.</p>
                        <p>We will not deny any users any of their rights because of factors such as race, color, sex, language, religion, political or other opinion, national or social origin, property, or birth.</p>
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