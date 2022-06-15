let api = localStorage.getItem("api");
const BASE_API_URL1 = api;
const BASE_API_URL2 = 'https://waba.360dialog.io';

export const msgUrl = BASE_API_URL1 + '/api/messages';
export const sendMsgUrl = BASE_API_URL1 + '/api/messages/sendSession';
export const alertMsgUrl = 'https://annular-arena-331607.el.r.appspot.com/api/alerts';
export const sendFileUrl = BASE_API_URL1 + '/api/messages/sendMedia';
export const addContactUrl = BASE_API_URL1 + '/api/conversations/addContact';
export const addLabelUrl = BASE_API_URL1 + '/api/conversations/chatLabel';
export const addAgentUrl = BASE_API_URL1 + '/api/conversations/chatAgent';
export const pinChatUrl = BASE_API_URL1 + '/api/conversations/pinChat';
export const markChatUrl = BASE_API_URL1 + '/api/conversations/markChat';
export const stickComment = BASE_API_URL1+'/api/conversations/stickComments';
export const fetchStickComment = BASE_API_URL1+'/api/conversations/fetchStickComments';
export const getFileUrl = BASE_API_URL2 + '/v1/media';
export const templateMsgUrl = BASE_API_URL2 + '/v1/configs/templates';
export const sendtemplateMsgUrl = BASE_API_URL1 + '/api/messages/sendTemplate';
export const bulkDeleteMsgUrl = BASE_API_URL2 + '/v2/message/batch';
export const quickReplyUrl = 'https://annular-arena-331607.el.r.appspot.com/api/quickreply';
export const contactUrl = BASE_API_URL1 + '/api/conversations';

export const createSessionUrl = BASE_API_URL1 + '/api/sessions/createSession';