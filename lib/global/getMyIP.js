import publicIp from "public-ip";

export const getMyIP = async (req) => {
    return await publicIp.v4({
        fallbackUrls: ["https://ifconfig.co/ip", "https://checkip.amazonaws.com"],
    });
};