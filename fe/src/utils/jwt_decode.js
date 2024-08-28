// Function to decode base64-encoded payload from JWT
const decodeBase64 = (str) => {
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`;
        })
        .join("")
    );
  } catch (e) {
    console.error("Error decoding base64:", e);
    return "";
  }
};

export const decodeJWT = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = parts[1];
    const decodedPayload = decodeBase64(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Function to delete a cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};

export const checkForInvalidOrExpiredToken = (message) => {
  if (message.includes("expire") || message.includes("invalid")) {
    console.log("Token is expired or invalid. Clearing token cookie...");
    deleteCookie("tokenFromServer");
    return true;
  } else {
    //TODO
    return false;
  }
};
