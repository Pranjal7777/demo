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
                        <p>JUICY VENTURES is highly committed to keeping its website and services devoid of any child sexual abuse material (CSAM). We aim to prevent our website and services from being used to spread CSAM. With this objective at the fore front, we have taken and are taking constantly multiple steps to prevent, identify, and eliminate such material on our website. We have zero tolerance for CSAM on our website or any activities related to child sexual abuse.</p>
                        <p>&nbsp;</p>
                        <h3>1) &nbsp; What is meant by CSAM?&nbsp;</h3>
                        <p>As per Public Safety Canada, Child sexual abuse material means actual, but also fictitious, written depictions of child sexual abuse, audio, video, and images, also known as child pornography.</p>
                        <p>&nbsp;Source: <a data-fr-linked="true" href="https://www.publicsafety.gc.ca/cnt/cntrng-crm/chld-sxl-xplttn-ntrnt/index-en.aspx?wbdisable=true ">https://www.publicsafety.gc.ca/cnt/cntrng-crm/chld-sxl-xplttn-ntrnt/index-en.aspx?wbdisable=true</a></p>
                        <p><br /></p>
                        <h3>2) &nbsp; How do JUICY VENTURES prevent, identify, and eliminate CSAM on its website?</h3>
                        <p>&nbsp;JUICY VENTURES implements multiple tools and mechanisms to prevent, identify, and eliminate CSAM. These include but are not limited to</p>
                        <p>&nbsp;(A) Identify verification of users;&nbsp;</p>
                        <p>(B) closely scanning the content to detect any appearance of CSAM;</p>
                        <p>(C) using a dedicated content moderating team equipped with industry best practices and tools to identify CSAM;</p>
                        <p>(D) manual review (after initial review) performed of the content uploaded within 24 hours of initial review;</p>
                        <p>(E) comparing the content against databases and tools used by law enforcement authorities to prevent the appearance of any known CSAM;</p>
                        <p>(F) blocking and/or removing any content that we believe is or has the tendency of CSAM;</p>
                        <p>(G) immediate reporting of offenders to law enforcement authorities and Non-Governmental organizations (NGOs);</p>
                        <p>(H) forging partnerships with NGOs and industry coalitions to enable a joint understanding of the changing nature of child sexual abuse and exploitation.</p>
                        <p><br /></p>
                        <h3>3) Is there a guarantee that CSAM will not appear on the JUICY VENTURES website?</h3>
                        <p>&nbsp;JUICY VENTURES will do commercially reasonable efforts to prevent, identify, and eliminate such material from its website. However, no guarantee can be provided that all such material will be prevented or identified at all times. Especially if the CSAM is not already a part of databases and tools used by law enforcement, it may be difficult to identify. However, with the various steps outlined herein, JUICY VENTURES &nbsp;believes that the appearance of CSAM on its website will be at a minimum. It is the constant endeavor of JUICY VENTURES to ensure that its website, services, and business environment are free from CSAM.</p>
                        <p>&nbsp;</p>
                        <h3>4) What should I as a responsible user of the JUICY VENTURES website do to prevent child sexual abuse?</h3>
                        <p>You are advised not to post any content on our website that sexually features minors and/or content that sexually exploits minors. In addition, you should not post content a) showing a minor participating in dangerous activities b) encouraging minors to do dangerous activities, c) inflicting emotional distress on minors, d) containing sexual themes or obscenity, d) involves sexual harassment of minors. The above list is not exhaustive.</p>
                        <p><br /></p>
                        <h3>&nbsp;5) What happens if I post any content containing CSAM?</h3>
                        <p>We will block or remove your content.&nbsp;</p>
                        <p>You will get an email from us regarding your violating conduct.</p>
                        <p>&nbsp;We may terminate and/or suspend your account.</p>
                        <p>&nbsp;We may report to law enforcement authorities depending on the nature of your CSAM and the frequency of your violations.</p>
                        <p><br /></p>
                        <h3>&nbsp;6) What should I do if I suspect any CSAM on the website of JUICY VENTURES?</h3>
                        <p>&nbsp;As a responsible user, you must avoid any activity that may lead to, or suggest, CSAM.</p>
                        <p>&nbsp;Instantly report any such material that you see to:</p>
                        <p>&bull; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;us at <a data-fr-linked="true" href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a></p>
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