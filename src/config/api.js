


const baseUrl = 'http://139.59.19.234/api/v1';

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

