import { env } from "@/../env";

type FetchInterceptor = {
  request: (url: string, config: RequestInit) => Promise<[string, RequestInit]>;
  response: (response: Response) => Promise<Response>;
};

export const fetchInterceptor = (() => {
  const interceptors: FetchInterceptor = {
    request: async (url, config) => [url, config], // Default pass-through
    response: async (response) => response, // Default pass-through
  };

  let baseUrl = ""; // Default base URL
  let defaultHeaders: Record<string, string> = {}; // Default headers

  const setBaseUrl = (url: string) => {
    baseUrl = url.replace(/\/+$/, ""); // Remove trailing slashes
  };

  const setDefaultHeaders = (headers: Record<string, string>) => {
    defaultHeaders = headers;
  };

  const setRequestInterceptor = (
    interceptor: (
      url: string,
      config: RequestInit
    ) => Promise<[string, RequestInit]>
  ) => {
    interceptors.request = interceptor;
  };

  const setResponseInterceptor = (
    interceptor: (response: Response) => Promise<Response>
  ) => {
    interceptors.response = interceptor;
  };

  const fetchWithInterceptor = async <T = any>(
    url: string,
    config: RequestInit = {}
  ): Promise<T> => {
    try {
      const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
      const headers: Record<any, any> = { ...defaultHeaders, ...config.headers };
      const [newUrl, newConfig] = await interceptors.request(fullUrl, {
        ...config,
        headers,
      });

      const response = await fetch(newUrl, newConfig);

      const modifiedResponse = await interceptors.response(response);

      if (
        modifiedResponse.headers
          .get("Content-Type")
          ?.includes("application/json")
      ) {
        if (modifiedResponse.ok) return await modifiedResponse.json() as Promise<T>;
        throw await modifiedResponse.json() as Promise<T>;
      }

      if (!modifiedResponse.ok) {
        throw modifiedResponse as unknown as T;
      }
      return modifiedResponse as unknown as T;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return {
    fetch: fetchWithInterceptor,
    setBaseUrl,
    setDefaultHeaders,
    setRequestInterceptor,
    setResponseInterceptor,
  };
})();

fetchInterceptor.setBaseUrl(env.API_BASE_URL as string);
fetchInterceptor.setDefaultHeaders({
  "Content-Type": "application/json",
});

fetchInterceptor.setRequestInterceptor(async (url, config) => {


  return [url, config];
});

export const customFetch = fetchInterceptor.fetch
export default customFetch