import axios from "axios";
import btoa from "btoa";
import publicIp from "public-ip";
import { ParseToken } from "../lib/parsers/token-parser";
import { API_URL, PASSWORD, USER_NAME } from "./config/creds";
import { clearAll } from "./global/clearAll";
import { guestLogin, refreshTokenLogin } from "./global/guestLogin";
import { getCookie, isBrowser, removeCookie, setCookie } from "./session";

export const customAxios = axios.create();
const ipAddress = publicIp.v4({
	fallbackUrls: ["https://ifconfig.co/ip", "https://checkip.amazonaws.com"],
});

const API_HOST = API_URL;
export const basic = "Basic " + btoa(USER_NAME + ":" + PASSWORD);
export const getUrl = (endpoint, apiConfig = {}) => {
	if (Object.keys(apiConfig).length) {
		const { CUSTOM_API_HOST = '', V_GATE = '' } = apiConfig;
		return `${CUSTOM_API_HOST || API_HOST}${V_GATE || "/v1"}${endpoint}`;
	}
	else return API_HOST + "/v1" + endpoint;
	// return API_HOST + `${apiType == "node" ? "/v2" : "/v1"}` + endpoint;
};

customAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		// console.error("API error", error);
		if (!error.response) {
			return Promise.reject(error);
		} else if (error.response.status === 401 || error.response.status === 406) {
			try {
				if (isBrowser() && !Boolean(getCookie("guestLoginProgress"))) {
					setCookie("guestLoginProgress", true)
					if (isBrowser() && getCookie('token') && getCookie('refreshToken')) {
						try {
							let newToken = await refreshTokenLogin()
							if (newToken && isBrowser()) {
								setCookie('token', ParseToken(newToken.token))
								setCookie('refreshToken', ParseToken(newToken.refreshToken))
								removeCookie("guestLoginProgress")
								window.location.reload();
								return Promise.reject(e);
							}
						} catch (e) {
							console.log("err")
						}
					}

					clearAll();
					await guestLogin();
					removeCookie("guestLoginProgress")
					return window.location.reload()
				}
			} catch (e) {
				removeCookie("guestLoginProgress")
				console.log("request error", JSON.stringify(e))
				if (isBrowser()) {
					return window.location.href = "/login";
				}
				return Promise.reject(e);
			}
			// sessionExpire.next({
			//   sessionExpire: true,
			// });

			return Promise.reject(error);
		}
		return Promise.reject(error);
	}
);

export const commonHeader = () => {
	const userLocation = JSON.parse(getCookie("ipConfig") || "{}")
	return ({
		"Content-Type": "application/json",
		lan: "en",
		platform: "3",
		city: encodeURIComponent(userLocation?.city || "bengaluru"),
		state: encodeURIComponent(userLocation?.state || "karnataka"),
		country: encodeURIComponent(userLocation?.country_name || "India"),
		ipaddress: encodeURIComponent(userLocation?.ipaddress || "127.0.0.1"),
		latitude: encodeURIComponent(userLocation?.latitude || "13.344"),
		longitude: encodeURIComponent(userLocation?.longitude || "72.222")
	})
};

export const fetchIpConfig = async () => {
	let defaultConfig = {
		city: "bengaluru",
		state: "karnataka",
		country: "India",
		ipaddress: "127.0.0.1",
		latitude: "13.344",
		longitude: "72.222",
	}
	try {
		const res = await ipAddress
		defaultConfig["ipaddress"] = res
		const usersCurrentLocationUrl = `https://api.testbombshellsite.com/v1/usersCurrentLocation?ipAddress=${res}`;
		const locationRes = await axios.get(usersCurrentLocationUrl)
		if (locationRes && locationRes.data && locationRes.data.data) {
			const data = locationRes.data.data;
			defaultConfig["city"] = (data?.city || "bengaluru");
			defaultConfig["state"] = (data?.state || "karnataka");
			defaultConfig["country"] = (data?.country || "India");
			defaultConfig["latitude"] = (data?.latitude || "13.344");
			defaultConfig["longitude"] = (data?.longitude || "72.222");
		}
		setCookie("ipConfig", JSON.stringify(defaultConfig))
		setCookie("ipConfigFetched", "true")
	} catch (error) {
		setCookie("ipConfig", JSON.stringify(defaultConfig))
	}
}

ipAddress.then((res) => (commonHeader["ipaddress"] = res));

export const post = async (endpoint, data, apiConfig = {}) => {
	return customAxios.post(getUrl(endpoint, apiConfig), data, {
		headers: commonHeader(),
	});
};

export const patch = async (endpoint, data, apiConfig = {}) => {
	return customAxios.patch(getUrl(endpoint, apiConfig), data, {
		headers: commonHeader(),
	});
};

export const deleteReqPayload = async (endpoint, data) => {
	customAxios.defaults.headers.common["authorization"] = await getCookie("token", "");
	customAxios.defaults.headers.common = {
		...customAxios.defaults.headers.common,
		...commonHeader(),
	};

	return customAxios.request({
		method: "DELETE",
		url: getUrl(endpoint),
		data: data,
	});
};

export const get = async (endpoint, otherHeaders, apiConfig = {}) => {
	// export const get = async (endpoint, otherHeaders) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "") || basic
	);
	return customAxios.get(getUrl(endpoint, apiConfig), {
		// return customAxios.get(getUrl(endpoint), {
		headers: { ...commonHeader(), ...otherHeaders },
	});
};

// for temporary purposes
export const getAdmin = async (endpoint, otherHeaders) => {
	customAxios.defaults.headers.common["authorization"] =
		"Bearer eyJhbGciOiJSU0EtT0FFUCIsImN0eSI6IkpXVCIsImVuYyI6IkExMjhHQ00iLCJ0eXAiOiJKV1QifQ.gf2iIUjvzCRULlOEm-JTFtwpsD8uh2S69ohcONJSuQHDoGNP1Sug6NdljpvR_zHd67_MqAIFs8q7DPuZ-c8U542rO4zdbNHiRbEdMnYqFAS-0ZWRWDaqWJbk24vBwGx2ShGW6hbSOwyIi96orobCQy6vcNta7fnIHkSTxS2RXzE.Y-8rngV00x-Pqscn.MLae3zLqYJjl982PiZbJB4NZ2cOpSjJl0Llu2gMfwvhPQMOp1PyVYYx8CzJcHLdb1km_yCitQmqs40VCVbWZyctJST1qPHExBPUAX3Gh2eD1WoF3Y0d-gH2yWmULgN3nU328xEMbfqDy7_fR8gak29bXQreaCnp4PzKyGcc99EjUHpbGhQN3jhRZ6cb3VjGdtvY0yzCBZeywmhtnCA-mgqthEe-wmagxTEfHYR2bEXqXrY6JQR83LpAuGh96gHjVxTeKzgBGNv8Lr4qNSNPpULZEHHWwE2VZpe0cmCqIFpMmyA6cZQM0vnAPFKDJareoD4QHu1Wzc082WJAx61P-OAfDwtWTMUDbMfRz5_St9zUwAhJHZgkAPU5IGGyuhDlaHqRAOvssSaGVcD9JXzLXnsxwvxGq1ZE_1YOqORQY_d3i5QCcxuD1ZYCykd_P8eoxJBQlc3mJRZf6ENGGPCjRjw-Tj2f3IfrSgRTpcpoKMx-W0JftAyBdgW_STCsT0PXQdJ5zXPFhemAVA7Oqh1u9CCW2wEp7HtNaMFdDcTCLOq3xFoXFEF5_DQ1KKHuQ8lQGNOxlsSG1csUdN8Vf9T0lj3NcghLbHt05hGJdIBW7Co0AY-_n3JxspmrBu-ORTwCBcWUsdoctjZRNTLoVJOCup0e6Nfv77N_-6nLURmrnIj1Ka3Ktd6tp5WcPnc8T0n0Sil9I5OKWKBAia0QfTS9xGMjzOMriF_pUngZ8QoPFCnEoREbe_VwDcpur4INOSmbw8gmuTDNgwtvRdszmQDOprQliBgwhQqqaemjlE-asN9ke2MIKuFwDH9yQh3U1aSoEUY72lQ4Jr0G5_3Hy1FP1zXgH7i-owJ7f7qyw_DNsLIRb_Bg.mhntNMI3nvFcwCvevkSBaQ";
	return customAxios.get(getUrl(endpoint), {
		headers: { ...commonHeader, ...otherHeaders },
	});
};

export const postWithToken = async (endpoint, data, otherHeaders, apiConfig = {}) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "") || basic
	);
	return customAxios.post(getUrl(endpoint, apiConfig), { ...data }, {
		headers: { ...commonHeader(), ...otherHeaders },
	});
};

export const patchWithToken = async (endpoint, data, apiConfig = {}, otherHeaders = {}) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "")
	);
	return customAxios.patch(getUrl(endpoint, apiConfig), data, {
		headers: { ...commonHeader(), ...otherHeaders },
	});
};

export const putWithToken = async (endpoint, data) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "")
	);
	return customAxios.put(getUrl(endpoint), data, {
		headers: commonHeader(),
	});
};

export const deleteReq = async (endpoint, data, otherHeaders) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "")
	);
	return customAxios({
		url: getUrl(endpoint),
		method: "DELETE",
		data,
		headers: { ...commonHeader(), ...otherHeaders },
	});
};


export const deleteRequest = async (endpoint, { }, apiConfig = {}) => {
	customAxios.defaults.headers.common["authorization"] = await ParseToken(
		getCookie("token", "")
	);
	return customAxios.delete(getUrl(endpoint, apiConfig), {
		headers: { ...commonHeader() },
	});
};