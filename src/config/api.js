


const baseUrl = 'http://api.wahparty.com/v1';

// API Endpoints
export const getCities = () => {
  return `${baseUrl}/cities`;
};

export const getServices = () => {
  return `${baseUrl}/services`;
};

export const getSnacks = () => {
  return `${baseUrl}/snacks`;
};

export const getMeals = () => {
  return `${baseUrl}/meals`;
};

export const getThemes = () => {
  return `${baseUrl}/themes`;
};


export const login = () => {
  return `${baseUrl}/login`;
};

export const getPartyDetails = (email) => {
  return `${baseUrl}/user/${email}/party`;
};

export const registerVendor = () => {
  return `${baseUrl}/vendors`;
};


