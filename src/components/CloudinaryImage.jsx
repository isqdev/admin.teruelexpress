import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export function CloudinaryImage({ publicId, border = 0, ...props }) {
  const cld = new Cloudinary({ cloud: { cloudName } });

  let img = cld
    .image(publicId)
    .format('auto')
    .quality('auto');

  if (Number(border) > 0) {
    img = img.roundCorners(byRadius(Number(border)));
  }

  return <AdvancedImage cldImg={img} {...props} />;
}