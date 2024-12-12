// src/utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatServerStatus = (isConnected) => {
  return isConnected ? "Connected" : "Disconnected";
};

export const formatCommandOutput = (output) => {
  if (!output) return "";
  return output
    .split("\n")
    .filter((line) => line.trim())
    .join("\n");
};

export const validatePrivateKey = (key) => {
  // Basic validation for SSH private key format
  return (
    key.includes("BEGIN") && key.includes("END") && key.includes("PRIVATE KEY")
  );
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
