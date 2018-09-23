


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


export const registeHost = () => {
  return `${baseUrl}/register`;
};


export const getLogout = () => {
  return `${baseUrl}/logout`;
};

export const getParty = (partyId) => {
  return `${baseUrl}/party/${partyId}`;
};

export const updateVendor = (email) => {
  return `${baseUrl}/vendor/${email}`;
};

export const updateParty = (partyId, state) => {
  return `${baseUrl}/party/${partyId}?state=${state}`;
};

export const forgetPassword = () => {
  return `${baseUrl}/forgotpwd`;
};

export const updateHost = (email) => {
  return `${baseUrl}/user/${email}`;
};


export const planParty = () => {
  return `${baseUrl}/party`;
};


export const updatePartyIdHost = (id) => {
  return `${baseUrl}/party/${id}`;
};

export const sendRatingFeedback = (id) => {
  return `${baseUrl}/party/${id}/feedback`;
};


