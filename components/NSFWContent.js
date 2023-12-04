import React from 'react'
import useProfileData from '../hooks/useProfileData';
import useFooterApi from '../containers/customHooks/useFooterApi';
import parse from "html-react-parser";


const NSFWContent = () => {
  const [profileData] = useProfileData();
  const [content, getLegalContentApi] = useFooterApi();
  React.useEffect(() => {
    getLegalContentApi(3);
  }, []);

  return (
    <React.Fragment>
      <div className='d-flex justify-content-center w-100 h-100'>
        <div className={`html_page2`}>
            {content ? parse(content) : "DMCA Content"}
        </div>
      </div>
      <style>{`
          .html_page2 {
          overflow:${profileData?._id ? "initial" : "auto"};
          height: 100%;
          padding: ${profileData?._id ? '15px' : '30px 15vw'};
          background: var(--l_app_bg);
          color: white;
          }
          .html_page p, .html_page span, .html_page strong {
            color: var(--l_app_text) !important;
          }
      `}</style>
    </React.Fragment>
  )
}

export default NSFWContent;