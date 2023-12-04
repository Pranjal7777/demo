import React from 'react';

import FigureImage from "../../../components/image/figure-image";
import Button from "../../../components/button/button";
import * as config from "../../../lib/config";
import Img from '../../../components/ui/Img/Img';

export default function VideoProfile (props) {
    return (
        <div id="menu2" className="tab-pane fade">
        <div className="row row-cols-md-3 row-cols-2 dv_profile_gallery">
        {props.post.video.map( (video, id) => {
              //  console.log(id)
                return  (<div key={id} className="col mb-4">
                <FigureImage
                  src= {video}
                  width="100%"
                  alt="pro_gallery_1"
                />
               <Button className="btn btn-default dv_live_video">
                 <Img
                src={config.VIDEO_OUTLINE}
                width={18}
                />
               </Button>
            </div>
                )
            })}
         </div>
      </div>
    )
}