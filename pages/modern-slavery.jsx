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
                        <p>JUICY VENTURES has a zero-tolerance approach to modern slavery and human trafficking. JUICY VENTURES is committed to acting in an ethical spirit to implement and enforce effective measures and controls to ensure modern slavery is not taking place in its business environment. JUICY VENTURES is dedicated to treating all its employees and business partners with respect and dignity. JUICY VENTURES does not allow, assist or accept Modern Slavery.</p>
                        <p><br /></p>
                        <h3>1)&nbsp; &nbsp;&nbsp;What is meant by modern slavery?</h3>
                        <p>Modern slavery is a violation of fundamental human rights. It can take multiple forms such as slavery, enslavement, forced labor, and human trafficking, all of which have a common element i.e. to deprive a person&rsquo;s liberty.</p>
                        <p><br /></p>
                        <p>As per the US Department of State, &ldquo;Trafficking in persons,&rdquo; &ldquo;human trafficking,&rdquo; and &ldquo;modern slavery&rdquo; are used as umbrella terms to refer to both sex trafficking and compelled labor. The Trafficking Victims Protection Act of 2000 (Pub. L. 106-386), as amended (TVPA), and the Protocol to Prevent, Suppress and Punish Trafficking in Persons, Especially Women and Children, supplementing the United Nations Convention against Transnational Organized Crime (the Palermo Protocol) describe this compelled service using several different terms, including involuntary servitude, slavery or practices similar to slavery, debt bondage, and forced labor.</p>
                        <p><br /></p>
                        <p>Source: <a href="https://www.state.gov/what-is-modern-slavery/ ">https://www.state.gov/what-is-modern-slavery/</a></p>
                        <p><br /></p>
                        <h3>2)&nbsp; &nbsp;&nbsp;How do JUICY VENTURES prevent, detect and assess Modern Slavery and Human Trafficking in its business environment?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES implements multiple tools and mechanisms in its business environment to prevent, detect and assess Modern Slavery and Human Trafficking. These include but are not limited to:</p>
                        <p><br /></p>
                        <p>A)&nbsp; &nbsp;&nbsp;Closely supervising content to identify possible warnings of Modern Slavery and Human Trafficking; this is possible because JUICY VENTURES can review and monitor any content on its platform; we remove, and report if needed any content that we believe is or has the tendency towards Modern Slavery and Human Trafficking activities&nbsp;</p>
                        <p><br /></p>
                        <p>B)&nbsp; &nbsp;&nbsp;Identify verification of users whereby we assess identity and payment details for each creator; we employ technical protections to prevent creator payment details from being modified by users for Modern Slavery and Human Trafficking activities</p>
                        <p>&nbsp;</p>
                        <p>C)&nbsp; &nbsp;&nbsp;Using IP tracking to determine upload locations and relationships.</p>
                        <p><br /></p>
                        <p>D)&nbsp; &nbsp;&nbsp;Using a dedicated legal and compliance team equipped with industry best practices and tools to identify and report Modern Slavery and Human Trafficking incidents</p>
                        <p><br /></p>
                        <p>E)&nbsp; &nbsp;&nbsp;Performing constant assessment taking into consideration reports, standards, and emerging risks in its environment; in higher-risk areas, we may require an additional &quot;selfie&quot; identification process for accessing the account.</p>
                        <p><br /></p>
                        <p>F)&nbsp; &nbsp;&nbsp;Performing due diligence (constantly) of suppliers and other business partners</p>
                        <p>&nbsp;</p>
                        <p>G)&nbsp; &nbsp;&nbsp;Utilization of third-party technology and third-party service providers as needed to help combat the threat of Modern Slavery and Human Trafficking &nbsp;effectively</p>
                        <p><br /></p>
                        <p>H)&nbsp; &nbsp;&nbsp;Immediate reporting to and coordinating with law enforcement authorities and Non-governmental organizations&nbsp;</p>
                        <p><br /></p>
                        <p>I)&nbsp; &nbsp;&nbsp;Additionally,</p>
                        <p><br /></p>
                        <p><br /></p>
                        <p>⦁&nbsp; &nbsp;&nbsp;All our users are bound by our Terms and Conditions. We have laid down in our Terms and Conditions that we do not allow the upload, posting, display, or publishing of content that promotes Modern Slavery and Human Trafficking;</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;If we believe that any user has violated our Terms and Conditions (that means indulging in any acts that constitute Modern Slavery and Human Trafficking we take stern actions including but not limited to termination of accounts and reporting such users to law enforcement authorities)</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;We have a code of conduct for employees and we provide regular training for employees, if we believe that any of our employees have indulged in Modern Slavery and Human Trafficking, we may terminate their employment&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;We have a code of conduct for suppliers to follow, if we believe that any of our suppliers/business partners has indulged in Modern Slavery and Human Trafficking, we may terminate their relationship with us; we assess our supply chain constantly to recognize and mitigate any risks of modern slavery and human trafficking;</p>
                        <p><br /></p>
                        <p>&nbsp;&nbsp;</p>
                        <h3>3)&nbsp; &nbsp;&nbsp;Is there a guarantee that JUICY VENTURES will be able to prevent Modern Slavery and Human Trafficking in its business environment?</h3>
                        <p>&nbsp;</p>
                        <p>JUICY VENTURES will do commercially reasonable efforts to prevent any Modern Slavery and Human Trafficking activities. However, no guarantee can be provided that all such activities will be prevented or identified at all times. However, with the various steps outlined herein, JUICY VENTURES &nbsp;believes that the prevalence of Modern Slavery and Human Trafficking on its website and business environment will be at a minimum. It is the constant endeavor of JUICY VENTURES to ensure that its website, services and business environment are free from Modern Slavery and Human Trafficking activities.</p>
                        <p><br /></p>
                        <p>We also believe that the risk of Modern Slavery and Human Trafficking may be high in areas that are prone to such Modern Slavery and Human Trafficking activities. These areas also known as &ldquo;high-risk areas&rdquo; may be a cause of concern but we ensure that our risk assessment and mitigation are applied at a more robust level in such regions.</p>
                        <p><br /></p>
                        <h3>4)&nbsp; &nbsp;&nbsp;What should I do if I suspect any Modern Slavery and Human Trafficking activities on the website of JUICY VENTURES?</h3>
                        <p><br /></p>
                        <p>As a responsible user, you must avoid any activity that may lead to, or suggest, Modern Slavery and Human Trafficking activities.</p>
                        <p><br /></p>
                        <p>Instantly report any such activities to:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;us at <a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a></p>
                        <p>⦁&nbsp; &nbsp;&nbsp;legal enforcement authorities</p>
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