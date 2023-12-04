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
                        <p>JUICY VENTURES respects the intellectual property rights of creators and expects its users to do the same. Following the 17 USC &sect; 512(c)(3) of the United States Digital Millennium Copyright Act of 1998, JUICY VENTURES will respond expeditiously to copyright infringement claims committed using the JUICY VENTURES website and/or services that are being reported to JUICY VENTURES.</p>
                        <h3>1)&nbsp; &nbsp;&nbsp;Who is the owner of content on the JUICY VENTURES website and services?</h3>
                        <p>A creator who creates the content is the owner of such content. When a such person posts the content on the JUICY VENTURES website and services, the person is providing a license to JUICY VENTURES to display the said content to other users.</p>
                        <p>Any content that is posted or created solely by JUICY VENTURES shall stand vested in JUICY VENTURES. For example, the website is created by JUICY VENTURES and hence JUICY VENTURES will be the owner of its website.</p>
                        <h3>2)&nbsp; &nbsp;&nbsp;If I pay for accessing content, does that mean I am the owner of that content?</h3>
                        <p>No, your payment of fees is for you to have access (a license to access) to the content. This is the pure license that is being provided to you only for accessing and/or viewing for the specified duration but you do not become the owner of such content. The original creator who created this content will be the owner.</p>
                        <h3>3)&nbsp; &nbsp;&nbsp;What are the various mechanisms available to the Creators to protect their created content on JUICY VENTURES &nbsp;website or in what way does JUICY VENTURES protect the content of the Creators from being infringed?</h3>
                        <p>JUICY VENTURES provides various mechanisms to help the creators to protect their created content. These include:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Adding a watermark (that can be customized) on the content; the feature of customizing the watermark is available in the Privacy Settings&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;JUICY VENTURES regularly scans the web to identify if any websites are hosting a substantial amount of content that is stolen from JUICY VENTURES website. JUICY VENTURES proactively reaches out to such websites and requests them to take down such alleged infringing content</p>
                        <h3>4)&nbsp; &nbsp;&nbsp;What can I do if believe that my content is copied or reproduced on another platform without my consent?</h3>
                        <p>Your content may have been allegedly infringed by the infringer. In such case, please report such alleged copyright infringement to the concerned website by following their copyright infringement policy.&nbsp;</p>
                        <p>You can also report such instances to JUICY VENTURES.</p>
                        <h3>5)&nbsp; &nbsp;&nbsp;Will JUICY VENTURES take any action if I report such alleged copyright infringement as per 4 above</h3>
                        <p>Our dedicated team will assess your case and may issue formal &quot;takedown&quot; notices on behalf of you to the concerned websites under the DMCA. We may also &nbsp;notify hosting services, domain registrars, and major search engines regarding these infringements.&nbsp;</p>
                        <h3>6)&nbsp; &nbsp;&nbsp;Is there a guarantee that JUICY VENTURES will be able to take down the content that I reported above?</h3>
                        <p>JUICY VENTURES will do commercially reasonable efforts to take down the allegedly infringed content. However, no guarantee can be provided that all such content shall be taken down. Each website has its policies and we do not have control over their policies. You are also advised to pursue in parallel necessary actions like reaching out to such websites where such alleged content is available and/or reaching out to legal enforcement authorities.&nbsp;</p>
                        <h3>7)&nbsp; &nbsp;&nbsp;I stay outside the United States, is my content protected under international copyright laws?&nbsp;</h3>
                        <p>Yes, your content is protected under international copyright laws.Copyright protection is automatic in all states party to the Berne Convention. Whilst there may be nuances to the particular national laws applicable in these states, in general, there is a high degree of harmony.</p>
                        <p>Source: <a href="https://www.wipo.int/copyright/en/faq_copyright.html">https://www.wipo.int/copyright/en/faq_copyright.html</a></p>
                        <h3>8)&nbsp; &nbsp;&nbsp;Someone has posted my content on the JUICY VENTURES website without my consent. What should I do?</h3>
                        <p>If you believe that your content has been copied and posted on any of our services or website in a way that constitutes copyright infringement, please provide Our Copyright Agent with the following information:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Description and location of the copyrighted work that you claim has been infringed</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Identification and location of the material that you believe to be infringing</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Written statement by you indicating that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner&rsquo;s behalf</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Your address, telephone, and email address</p>
                        <p>Contact information for JUICY VENTURES for providing the above notice is: <a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a></p>
                        <h3>9)&nbsp; &nbsp;&nbsp;If I believe that my content has been wrongly removed by JUICY VENTURES for infringing copyright, what should I do?</h3>
                        <p>In such cases, you have to submit copyright infringement counter notifications. You need to include all the required information listed below.</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Your contact information-Full legal name, Email address, Physical address, Telephone number</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Identify the content that was disabled and the location where it appeared.&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Include the following legal statements:&nbsp;</p>
                        <p>&quot;I consent to the jurisdiction of the Federal District Court for the district in which my address is located, or if my address is outside of the United States, the judicial district in which JUICY VENTURES is located, and will accept service of process from the claimant.&quot;</p>
                        <p>&quot;I swear, under penalty of perjury, that I have a good faith belief that the material was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled.&quot;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;include a statement that clearly and concisely explains why you believe the removal of the content at issue was a mistake or misidentification</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;your (or your agent&rsquo;s) physical or electronic signature &nbsp;&nbsp;</p>
                        <p>You must not submit false information. Misuse of our processes may result in the termination of your account or other legal effects.&nbsp;</p>
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