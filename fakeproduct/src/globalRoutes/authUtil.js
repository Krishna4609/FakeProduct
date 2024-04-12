// authUtils.js

export const isAuthenticated = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    return sessionToken ;
  };
  