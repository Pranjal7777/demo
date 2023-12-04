import React from "react";
import * as config from "../../lib/config";
import useLang from "../../hooks/language";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import Img from "../../components/ui/Img/Img";
import { handleContextMenu } from "../../lib/helper";

const DVUserProfile = (props) => {
    const [lang] = useLang();
    return (
        <div className="dv_wrap_home">
            <div className="dv_header">
                <div className="col-12">
                    <div className="row">
                        <div className="container">
                            <div className="row align-items-center justify-content-between py-3">
                                <div className="col-auto">
                                    <figure className="mb-0">
                                        {/* <a href="index.html"> */}
                                        <a onClick={() => { props.setVal(false) }}>
                                            <Img src={config.LOGO} width={110} height={44} alt="logo" />
                                        </a>
                                    </figure>
                                </div>
                                <div className="col-auto">
                                    <figure className="mb-0">
                                        <Img src={config.NOTIFICATION_ICON} width={20} height alt="notification" />
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dv_cont_posts">
                <div className="col-12 mb-3">
                    <div className="row dv_pro_banner py-3" style={{ backgroundImage: 'url(../images/desktop/profile_gallery/pro_banner.jpg)' }}>
                        <div className="container position-relative">
                            <figure>
                                {/* <a href="home_user.html"> */}
                                <a onClick={() => {
                                    props.setVal(true);
                                    props.setChat(false);
                                    props.setProfile(false);
                                }}>
                                    <Img src={config.backArrow} width={26} alt="backarrow" />
                                </a>
                            </figure>
                            <div className="dv_pro_details">
                                <div className="form-row align-items-center">
                                    <div className="col-auto callout-none" onContextMenu={handleContextMenu}>
                                        <FigureCloudinayImage
                                            publicId={props.profilePic}
                                            width={76}
                                            height={76}
                                            alt="rectangle"
                                        />
                                        {/* <Img src={config.DV_RECTANGLE} width={76} height={76} alt="rectangle" /> */}
                                    </div>
                                    <div className="col">
                                        <div className="fntSz22 txt-heavy">{lang.jennyjane}</div>
                                        <div className="fntSz13 txt-book dv_appTxtClr" style={{ color: '#ffffff !important' }}><a type="button">oshun.com/barbaragordon</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mb-3">
                    <div className="row">
                        <div className="container">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-auto">
                                    <div className="row text-center">
                                        <div className="col-auto">
                                            <div className="txt-roboto fntSz18">32</div>
                                            <div className="txt-roman fntSz16 dv_upload_txt_color">{lang.posts}</div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="txt-roboto fntSz18">548</div>
                                            <div className="txt-roman fntSz16 dv_upload_txt_color">{lang.followers}</div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="txt-roboto fntSz16">548</div>
                                            <div className="txt-roman fntSz16 dv_upload_txt_color">{lang.following}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="form-row">
                                        <div className="col-auto">
                                            <button className="btn btn-default dv_liveBtnProfile_big">{lang.edit}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mb-3">
                    <div className="row">
                        <div className="container">
                            <span className="dv_pro_status_desc">{lang.beCool}</span>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="container">
                            <div className="row row-cols-md-3 dv_profile_gallery">
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_1.png" width="100%" />
                                    </figure>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_2.png" width="100%" />
                                    </figure>
                                    <button className="btn btn-default dv_live_video">
                                        <Img src="/images/desktop/icons/live_video_outline.svg" width={18} />
                                    </button>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_3.png" width="100%" />
                                    </figure>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_4.png" width="100%" />
                                    </figure>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_5.png" width="100%" />
                                    </figure>
                                    <button className="btn btn-default dv_live_video">
                                        <Img src="/images/desktop/icons/live_video_outline.svg" width={18} />
                                    </button>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_6.png" width="100%" />
                                    </figure>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_7.png" width="100%" />
                                    </figure>
                                </div>
                                <div className="col mb-4">
                                    <figure>
                                        <Img src="/images/desktop/profile_gallery/pro_gallery_8.png" width="100%" />
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DVUserProfile;