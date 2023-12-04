import { handleContextMenu } from "../../../lib/helper";
import { convertImage } from "../../../lib/helper/convertImage";

const Img = ({ src, compress = true, picture, slideCount, currentSlide, alt, ...props }) => {
  return picture ? (
    <picture>
      <source
        srcset={convertImage({ src, compress: compress, webp: true })}
        type="image/webp"
      />
      <img
        {...props}
        loading={'lazy'}
        src={convertImage({ src, compress: compress, webp: false })}
        alt={alt || "img"}
        className={`${props.className} callout-none`}
        contextMenu={handleContextMenu}
      />
    </picture>
  ) : (
      <img {...props} className={`${props.className} callout-none`} loading={'lazy'} contextMenu={handleContextMenu}
        src={src} alt={alt || "img"} />
  );
};
export default Img;
