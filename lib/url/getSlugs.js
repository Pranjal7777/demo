import Router from "next/router";

export const getUrlSlugs = () => {
    let urlPath = Router.asPath;
    return urlPath.split("/").filter((slug) => slug && slug.length > 0).map((slug) => slug.replace(/%20/g, " ").replace(/-percentage/g, "%"));
}