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
                        <p>JUICY VENTURES gives paramount importance to the safety of its creators and fans. To ensure that this objective is fulfilled, JUICY VENTURES takes hate speech very seriously. JUICY VENTURES will not stand for any kind of discrimination, violence, or hatred against individuals or groups based on factors such as</p>
                        <p>age, caste, and others.&nbsp;</p>
                        <p><br /></p>
                        <p>Read our FAQ below to know how you can help JUICY VENTURES protects the rights of its creators and fans and make their journey on JUICY VENTURES a safe and vibrant one. If you have any further questions, please do not hesitate to reach out to us at <a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a>&nbsp;</p>
                        <p><br /></p>
                        <h3>1)&nbsp; &nbsp;&nbsp;What kind of content should I not post on JUICY VENTURES ?</h3>
                        <p><br /></p>
                        <p>For posting the content, you should first read our other policies pertinent among which are the Terms of Service.&nbsp;</p>
                        <p><br /></p>
                        <p>In brief, you should not post any content that:</p>
                        <p><br /></p>
                        <p>A)&nbsp; &nbsp;&nbsp;Encourages violence or incites hatred against individuals or groups based on any of the following attributes:</p>
                        <p><br /></p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Age</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Caste</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Disability</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Ethnicity</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Gender Identity and Expression</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Nationality</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Race</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Immigration Status</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Religion</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Sex/Gender</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Sexual Orientation</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Victims of a major violent event and their kin</p>
                        <p>&bull;&nbsp; &nbsp;&nbsp;Veteran Status</p>
                        <p><br /></p>
                        <p>B)&nbsp; &nbsp;&nbsp;is illegal, fraudulent, discriminatory, or defamatory.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>2)&nbsp; &nbsp;&nbsp;What kind of content is covered under 1 above?</h3>
                        <p><br /></p>
                        <p>All kinds of content that you post on the JUICY VENTURES platform</p>
                        <p><br /></p>
                        <h3>3)&nbsp; &nbsp;&nbsp;What do you mean by Hate Speech?</h3>
                        <p><br /></p>
                        <p>In common language, &quot;hate speech&quot; loosely refers to offensive discourse targeting a group or an individual based on inherent characteristics - such as race, religion, or gender - and that may threaten social peace.</p>
                        <p><br /></p>
                        <p>Under International Human Rights Law, there is no universal definition of hate speech as the concept is still widely disputed especially regarding its relation to freedom of opinion and expression, non-discrimination, and equality.</p>
                        <p><br /></p>
                        <p>To provide a unified framework for the UN system to address the issue globally, the United Nations Strategy and Plan of Action on Hate Speech defines hate speech as&hellip;&quot; any kind of communication in speech, writing or behavior, that attacks or uses pejorative or discriminatory language concerning a person or a group based on who they are, in other words, based on their religion, ethnicity, nationality, race, color, descent, gender or another identity factor.</p>
                        <p><br /></p>
                        <p>(Reference: <a href="https://www.un.org/en/hate-speech/understanding-hate-speech/what-is-hate-speech">https://www.un.org/en/hate-speech/understanding-hate-speech/what-is-hate-speech</a>)</p>
                        <p><br /></p>
                        <p>JUICY VENTURES follows the above stated model.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>4)&nbsp; &nbsp;&nbsp;Is it possible that any users may engage in hate speech on JUICY VENTURES ?</h3>
                        <p><br /></p>
                        <p>The chances of engaging in hate speech on JUICY VENTURES are &nbsp;very less &nbsp;because JUICY VENTURES a) does not allow the posting of content anonymously, b) verifies the identity of users under a strict check model, c) constantly attempts to monitor the content posted by users, d) investigates any complaints by other users, e) removes any content that JUICY VENTURES believes is a hate speech and f) provides you (as a user) the mechanisms through which you can voice your complaint to &nbsp;JUICY VENTURES for any kind of content that you come across which you feel is a hate speech,&nbsp;</p>
                        <p><br /></p>
                        <h3>5)&nbsp; &nbsp;&nbsp;What can do if I come across content that I feel is hate speech?</h3>
                        <p><br /></p>
                        <p>You have to report to JUICY VENTURES . JUICY VENTURES will investigate your complaint and if JUICY VENTURES feels that the content posted is indeed hate speech, it will immediately remove such content. The determination of whether a content constitutes hate speech or not and removal of such content is at the sole discretion of JUICY VENTURES .</p>
                        <p><br /></p>
                        <h3>6)&nbsp; &nbsp;&nbsp;What action JUICY VENTURES will take against the user who has posted hate speech?</h3>
                        <p><br /></p>
                        <p>First of all, such content will be removed. Secondly, the user will be issued a warning. Depending on the nature of the content or the frequency of such posting of content by a user, the account of such user can be suspended and/or terminated permanently. The user may be subject to penal action under applicable law and JUICY VENTURES will report the matter to the law enforcement authorities and will cooperate with such authorities to take action against the violating user.</p>
                        <p><br /></p>
                        <p><br /></p>
                        <h3>7)&nbsp; &nbsp;&nbsp;How do I report on any content constituting hate speech or similar such content to JUICY VENTURES ?</h3>
                        <p><br /></p>
                        <p>You will see a REPORT button under the content such as post, message, and account. You need to click on that REPORT button. Alternatively, you could also send a mail to us at <a href="mailto:tech@bombshellinfluencers.com">tech@bombshellinfluencers.com</a> and provide us with details of the content.</p>
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