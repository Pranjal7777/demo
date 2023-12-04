import Route from 'next/router';

import Icon from "../image/icon";
import * as config from "../../lib/config";
import { palette } from "../../lib/palette";


function HastagImages() {

  const handleHastagProfile = () => {
    Route.back();
  }

  return (
    <>
      <div className='my-3 d-flex justify-content-center'>
        <div className='' style={{ width: '85.359vw' }}>
          <div className='hastag__container'>
            <div className='hastag__details w-100 d-flex justify-content-between align-items-center mb-3'>
              <div className='d-flex align-items-center' onClick={handleHastagProfile}>
                <div className="mr-2 p-2 rounded-pill mySubscription border1pxSolid">
                  <Icon
                    icon={`${config.HASTAG_ICON}#hashtag`}
                    color={theme.palette.l_base}
                    viewBox="0 0 42.465 41.134"
                    width={30}
                    height={30}
                  />
                </div>
                <div className='hastag__username d-flex flex-column'>
                  <h4 className='m-0 p-0'>#sunnybeach</h4>
                  <span>10 posts</span>
                </div>
              </div>
              <div>
                <p className='hastag__viewAll m-0 p-0'>View All</p>
              </div>
            </div>
            <div className='hastag__images mt-4'>
              <div>
                <div className='row'>
                  <div className='col-3'>
                    <figure className='m-0 p-0'>
                      <img src='https://images.pexels.com/photos/341970/pexels-photo-341970.jpeg?cs=srgb&dl=pexels-raydar-341970.jpg&fm=jpg' className='hastag__img' />
                    </figure>
                  </div>
                  <div className='col-3'>
                    <figure className='m-0 p-0'>
                      <img src='https://images.pexels.com/photos/341970/pexels-photo-341970.jpeg?cs=srgb&dl=pexels-raydar-341970.jpg&fm=jpg' className='hastag__img' />
                    </figure>
                  </div>
                  <div className='col-3'>
                    <figure className='m-0 p-0'>
                      <img src='https://images.pexels.com/photos/341970/pexels-photo-341970.jpeg?cs=srgb&dl=pexels-raydar-341970.jpg&fm=jpg' className='hastag__img' />
                    </figure>
                  </div>
                  <div className='col-3'>
                    <figure className='m-0 p-0'>
                      <img src='https://images.pexels.com/photos/341970/pexels-photo-341970.jpeg?cs=srgb&dl=pexels-raydar-341970.jpg&fm=jpg' className='hastag__img' />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
        .hastag__icon {
          width: 39px;
          height: 38px;
          object-fit: cover;
          margin-right: 10px;
        }
        .hastag__username h4 {
          font-weight: 800;
          color: #000000;
          cursor: pointer;
          }
        .hastag__username span {
          font-weight: 600;
          color: #343434;
        }
        .hastag__viewAll {
          font-weight: 600;
          color: var(--l_base) !important;
        }
        .hastag__img {
          width: 100%;
          min-height: 260px;
          object-fit: cover;
          border-radius: 12px;
        }
        `}
      </style>
    </>
  )
}

export default HastagImages
