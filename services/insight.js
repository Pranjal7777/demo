import { PayloadToLink } from "../lib/helper";
import { get } from "../lib/request";

export const getInsights = (payload, token, address) => {
  // console.log("fidh", payload);
  let data = PayloadToLink(payload);

  // console.log("services ===> ", data)

  let url = `/insight/?${data}`;
  if (payload && !payload.assetId) {
    url = `/creatorInsight/?${data}`;
  }
  return get(url);
};
