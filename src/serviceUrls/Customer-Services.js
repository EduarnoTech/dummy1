let api = localStorage.getItem("api");
const BASE_API_URL = api;

export const getCustomersUrl = BASE_API_URL + '/api/conversations/getContacts/search';