/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

const config = {
  initiateLoginEndpoint: import.meta.env.VITE_START_LOGIN_PAGE_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  apiEndpoint: import.meta.env.VITE_FUNC_ENDPOINT,
  apiName: import.meta.env.VITE_FUNC_NAME,
  acsUserToken: import.meta.env.VITE_ACS_USER_ACCESS_TOKEN,
  acsEndpoint: import.meta.env.VITE_ACS_ENDPOINT,
  cognitiveEndpoint: import.meta.env.VITE_COGNITIVE_ENDPOINT,
};

export default config;
