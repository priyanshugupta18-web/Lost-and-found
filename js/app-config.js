const defaultConfig = {
  firebase: {
    apiKey: "AIzaSyDM4wbygf0DuoyaqpeGFeK3hka-PrQoLV4",
    authDomain: "webapp-667eb.firebaseapp.com",
    projectId: "webapp-667eb",
    storageBucket: "webapp-667eb.firebasestorage.app",
    messagingSenderId: "1074691050985",
    appId: "1:1074691050985:web:77b4253878d643e78fcf78",
  },
  algolia: {
    appId: "E8CKULBYXW",
    searchKey: "070aef38b35761aa7a43f414998223ea",
    index: "items",
  },
};

function mergeConfig(base, overrides) {
  if (!overrides || typeof overrides !== "object") return base;
  return {
    ...base,
    ...overrides,
    firebase: { ...base.firebase, ...(overrides.firebase || {}) },
    algolia: { ...base.algolia, ...(overrides.algolia || {}) },
  };
}

const runtimeConfig = mergeConfig(defaultConfig, window.LOST_FOUND_CONFIG);

export const appConfig = runtimeConfig;
