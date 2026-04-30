const defaultConfig = {
  firebase: {
    apiKey: "AIzaSyDM4wbygf0DuoyaqpeGFeK3hka-PrQoLV4",
    authDomain: "webapp-667eb.firebaseapp.com",
    projectId: "webapp-667eb",
    storageBucket: "webapp-667eb.firebasestorage.app",
    messagingSenderId: "1074691050985",
    appId: "1:1074691050985:web:77b4253878d643e78fcf78",
  },
};

function mergeConfig(base, overrides) {
  if (!overrides || typeof overrides !== "object") return base;
  return {
    ...base,
    ...overrides,
    firebase: { ...base.firebase, ...(overrides.firebase || {}) },
  };
}

const runtimeConfig = mergeConfig(defaultConfig, window.LOST_FOUND_CONFIG);

export const appConfig = runtimeConfig;