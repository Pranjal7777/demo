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
                        <p>JUICY VENTURES is committed to cooperating with and supporting law enforcement authorities to ensure the safety of its users and the society. &nbsp;</p>
                        <p><br /></p>
                        <h3>1.&nbsp; &nbsp;&nbsp;How do JUICY VENTURES cooperate with and support law enforcement agencies?</h3>
                        <p>&nbsp;</p>
                        <p>JUICY VENTURES performs multiple tasks to cooperate with and support law enforcement agencies. These include but are not limited to:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;providing information as requested/required by law enforcement agencies through a valid legal process</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;providing certified records in court proceedings</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;preservation of records</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;reporting suspicious, fraudulent, or illegal transactions when deemed necessary</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <h3>2.&nbsp; &nbsp;&nbsp;Does JUICY VENTURES support/assist law enforcement agencies based in Canada only?</h3>
                        <p>&nbsp;</p>
                        <p>No, JUICY VENTURES aims to&nbsp;</p>
                        <p>cooperate with/support law enforcement agencies based globally.</p>
                        <p>&nbsp;</p>
                        <h3>3.&nbsp; &nbsp;&nbsp;Can a law enforcement agency request/require user content from the JUICY VENTURES website to be removed?</h3>
                        <p>&nbsp;</p>
                        <p>Yes, in such a situation our content removal team will evaluate the request and the content in question and after vetting with the legal team respond as appropriate.</p>
                        <p>&nbsp;</p>
                        <h3>4.&nbsp; &nbsp;&nbsp;Is there any content of the user that any law enforcement agency can view without making a formal request to JUICY VENTURES?</h3>
                        <p>&nbsp;</p>
                        <p>Yes, certain content such as the user&rsquo;s username, display name, profile photo, bio, URL, posts, or comments which are publicly viewable on the website can be accessed by law enforcement agencies without making a request to JUICY VENTURES to share the same.</p>
                        <p>&nbsp;</p>
                        <h3>5.&nbsp; &nbsp;&nbsp;Is there a guarantee that all content of the users can be made available to the law enforcement agency?</h3>
                        <p>&nbsp;</p>
                        <p>Not necessarily, if certain content is deleted by the user before us processing a valid law enforcement request, such information may not be available. So also, if some content was not backed up in real-time, the same will not be available. The foregoing is not an exhaustive list.</p>
                        <p>&nbsp;</p>
                        <h3>6.&nbsp; &nbsp;&nbsp;Will the user be informed before the information is disclosed to a law enforcement agency?</h3>
                        <p><br /></p>
                        <p>We will notify the user before disclosing information. However, such notification will not be provided if legally prohibited under the terms of the request. Note that we are not bound to provide notice when the account has been disabled or suspended or user is in breach. We will also not give notice where the request is related to an emergency such as a request/requirement involving a risk of imminent harm to an individual.&nbsp;</p>
                        <p>&nbsp;</p>
                        <h3>7.&nbsp; &nbsp;&nbsp;How will non-public information of a user be made available to a law enforcement agency?</h3>
                        <p><br /></p>
                        <p>Non-public information of users can be made available to a law enforcement agency under valid legal processes such as a subpoena, court order, warrant, or another valid legal process.</p>
                        <p><br /></p>
                        <p>All such legal requests shall be addressed to:</p>
                        <p>JUICY VENTURES</p>
                        <p>PO Box 25125 Kitchener RPO HIWAY, ON, N2A 4A5, Canada</p>
                        <p><br /></p>
                        <h3>8.&nbsp; &nbsp;&nbsp;Can a preservation request for records be made to JUICY VENTURES?</h3>
                        <p>&nbsp;</p>
                        <p>Yes, JUICY VENTURES will accept such requests.&nbsp;</p>
                        <p>The following information needs to be provided:</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Name of the law enforcement agency</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Address of the law enforcement agency</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Name of the law enforcement agency official</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Designation of the law enforcement agency official&nbsp;</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Request/Requirement description</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Description of the information to be preserved</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Relation of the information to be preserved to the investigation</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Relevant documentation attached</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;The preservation period</p>
                        <p>⦁&nbsp; &nbsp;&nbsp;Relevant user identifiers</p>
                        <p>&nbsp;</p>
                        <p>Law enforcement agencies are requested not to make broad or vague requests. A 90-day preservation period is acceptable. If the 90 days preservation period needs to be extended, the same can be done via a separate request.</p>
                        <p>&nbsp;</p>
                        <h3>9.&nbsp; &nbsp;&nbsp;How do JUICY VENTURES respond in an emergency?&nbsp;</h3>
                        <p><br /></p>
                        <p>In very rare circumstances involving imminent serious bodily harm or death, JUICY VENTURES will consider responding to an emergency request for information. These requests must be signed under penalty of perjury by a law enforcement official. We will not respond to requests submitted by non-law enforcement officials.</p>
                        <p>While filling in the request/requirement details, the concerned law enforcement agency has to specify among other things if there is an imminent threat of death or serious physical injury to a person. If the foregoing is specified as Yes, then in such case, the request/requirements will be immediately escalated to &nbsp;</p>
                        <p>to Senior Management of JUICY VENTURES and dealt with immediate basis.</p>
                        <p><br /></p>
                        <h3>10.&nbsp; &nbsp;&nbsp;Will JUICY VENTURES seek reimbursement for costs related to supporting law enforcement agencies?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES will seek reimbursement for costs associated with preservation and information requests to the extent permitted by applicable law.</p>
                        <p><br /></p>
                        <h3>11.&nbsp; &nbsp;&nbsp;What is the timeline of JUICY VENTURES for responding to requests?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES will make &nbsp;commercially reasonable effort to process all non-emergency requests within 14 days from receipt. However, response times can differ based on the nature of the request and the current volume of requests processed by JUICY VENTURES.&nbsp;</p>
                        <p><br /></p>
                        <h3>12.&nbsp; &nbsp;&nbsp;Will the records be, made available in hard copy or electronic version?</h3>
                        <p>We only provide records in electronic format.</p>
                        <p><br /></p>
                        <h3>13.&nbsp; &nbsp;&nbsp;How should a law enforcement member contact JUICY VENTURES?</h3>
                        <p><br /></p>
                        <p>JUICY VENTURES can be contacted at:</p>
                        <p>JUICY VENTURES</p>
                        <p>PO Box 25125 Kitchener RPO HIWAY , ON, N2A 4A5, Canada</p>
                        <p><a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a></p>
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