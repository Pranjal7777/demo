import { APP_NAME } from "../config";

export const handleEmailShare = () => {
  let email = `mailto:tech@bombshellinfluencers.com?Subject=Support Request from ${APP_NAME} App:.`;
  window.open(email);
};

export const handleFBShare = () => {
  // href={`https://www.facebook.com/sharer/sharer.php?u=`} target="_blank"
  //   console.log("URL is --> ", window.location);
  let fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;

  //   console.log("URL is --> ", fbShareUrl, window.location);

  // window.open(
  //     fbShareUrl,
  //     '_blank' // <- This is what makes it open in a new window.
  // );
};
