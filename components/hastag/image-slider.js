import dynamic from "next/dynamic";
const Slider = dynamic(() => import("react-slick"));
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import Image from "../image/image";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{ ...style, display: "block", position: 'absolute', right: '15px' }}
      onClick={onClick}
    />
  );
}

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", position: 'absolute', left: '15px', zIndex: 1 }}
      onClick={onClick}
    />
  );
}

const SimpleSlider = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div>
      <Slider {...settings}>
        {props.bannerList?.map((img) => (
          <div className="cursorPtr w-100" key={img._id} onClick={() => props.title == "hashtag" && props.bannerClickHandler(img)}>
            <Image
              src={props.title == "hashtag" ? s3ImageLinkGen(props.S3_IMG_LINK, img.webImage, null, '100%') : img?.webImage}
              className='radius_8 w-100 object-fit-cover'
              alt="Cover Image"
            />
          </div>
        ))}
      </Slider>
      <style>{`
        .slick-dots {
          position: absolute;
          bottom: 10px;
      }
      `}</style>
    </div>
  );
}

export default SimpleSlider;
