import React from 'react';
import './messenger.css';
import ReactLoading from 'react-loading';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  msgUrl,
  sendMsgUrl,
  sendFileUrl,
  templateMsgUrl,
  sendtemplateMsgUrl,
  addContactUrl,
  addLabelUrl,
  quickReplyUrl,
  contactUrl,
  addAgentUrl,
} from '../../serviceUrls/Message-Services';
import { getCustomersUrl } from '../../serviceUrls/Customer-Services';
import ForwardMsg from '../../components/forwardConv/ForwardMsg';
import chatDemo from '../../assets/openChat2.png';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { storeFilesUrl } from '../../serviceUrls/StoreFiles-Service';
import { headerKey } from '../../serviceUrls/ApiHeaderKey';
import MoreMenu from '../../components/dropDown/MoreMenu';
import InfiniteScroll from 'react-infinite-scroll-component';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import ReplyIcon from '@material-ui/icons/Reply';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplayIcon from '@mui/icons-material/Replay';
import DropFile from '../../components/drag_dropFile/DropFile';
import SaveIcon from '@mui/icons-material/Save';
import TutorContact from '../../components/tutorContacts/TutorContact';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import RightSec from '../../components/rightComponent/RightSec';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FormCreation from '../../components/forms/FormCreation';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import NoteHistory from '../../components/notes/NoteHistory';
import IconButton from '@mui/material/IconButton';
import { NAME_SPACE } from '../../utils/variables';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Messenger = ({ apiUrl, apiKey }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [msgResponse, setMsgResponse] = useState();
  const [messages, setMessages] = useState([]);
  const [newMsgRec, setNewMsgRec] = useState([]);
  const [finalMessage, setFinalMessage] = useState([]);
  const [textMsg, setTextMsg] = useState([]);
  const [messageId, setMessageId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [forward, setForward] = useState({});
  const [forwarded, setForwarded] = useState(false);
  const socket = useRef();
  const [userId, setUserId] = useState(null);
  const [visible, setVisible] = useState();
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(false);
  const [sent, setSent] = useState(false);
  const [alert, setAlert] = useState(0);
  const [alertMsg, setAlertMsg] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [showFile, setShowFile] = useState();
  const [file, setFile] = useState();
  const [fileSent, setFileSent] = useState(0);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openTooltipForm, setOpenTooltipForm] = useState(false);
  const [templateMessage, setTemplateMessage] = useState();
  const [showTemplateMsg, setShowTemplateMsg] = useState(false);
  const [caption, setCaption] = useState('');
  const [saved, setSaved] = useState();
  const [updated, setUpdated] = useState();
  const [newNotification, setNewNotification] = useState();
  const [addNewContact, setAddNewContact] = useState(false);
  const [addName, setAddName] = useState();
  const [addNumber, setAddNumber] = useState();
  const [status, setStatus] = useState([]);
  const [msgId, setMsgId] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [taglabel, setTaglabel] = useState();
  const [tagUpdated, setTagUpdated] = useState();
  const [msgCountUpdated, setMsgCountUpdated] = useState(false);
  const [scrollView, setScrollView] = useState(true);
  const [scrollView_, setScrollView_] = useState(true);
  const [pinned, setPinned] = useState();
  const [markChat, setMarkChat] = useState();
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [mulForward, setMulForward] = useState([]);
  const [errMsg, setErrMsg] = useState();
  const [scrollPosition, setScrollPosition] = useState();
  const [forwardMsg, setForwardMsg] = useState();
  const [msgLoad, setMsgLoad] = useState(false);
  const [alertUpdate, setAlertUpdate] = useState();
  const [quickReplyText, setQuickReplyText] = useState([]);
  const [addingContact, setAddingContact] = useState(false);
  const [confirmationText, setConfirmationText] = useState();
  const [tutorList, setTutorList] = useState([]);
  const [tutorTagUpdated, setTutorTagUpdated] = useState();
  const [tutorRatingUpdated, setTutorRatingUpdated] = useState();
  const [searchTutor, setSearchTutor] = useState('');
  const [agentUpdated, setAgentUpdated] = useState();
  const [agentlabel, setAgentlabel] = useState(localStorage.getItem('agent'));
  const [agentStatus, setAgentStatus] = useState();
  const [tutorCount, setTutorCount] = useState(0);
  const [tutorPage, setTutorPage] = useState(1);
  const [tutorListLoading, setTutorListLoading] = useState(false);
  const [convCount, setConvCount] = useState(0);
  const [contactPage, setContactPage] = useState(1);
  const [contactListLoading, setContactListLoading] = useState(false);
  const [searchContacts, setSearchContacts] = useState();
  const [interestedTutors, setInterestedTutors] = useState();
  const [newSessions, setNewSessions] = useState();
  const [clientPayment, setClientPayment] = useState();
  const [tutorPayout, setTutorPayout] = useState();
  const scrollRef = useRef();
  const listInnerRef = useRef();
  const uniqueValuesSet = new Set();
  const [chatLabels, setChatLabels] = useState();

  const [loadingMsg, setLoadingMsg] = useState(false);

  const snackBarPos = {
    vertical: 'top',
    horizontal: 'center'
  }
  const { vertical, horizontal } = snackBarPos;

  const [alertText, setAlertText] = useState('')
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleLoadMoreMsgClick = async () => {
    setLoadingMsg(true);
    try {
      const res = await axios.get(
        msgUrl + `/${currentChat?.wa_id}`,
        {
          params: {
            page: page,
            limit: limit,
          },
        },
        {
          headers: '',
        }
      );
      if(res.data.length === 0) {
        setOpenSnackBar(true);
        setAlertText('No more messages');
      }
      else {
        setMsgResponse(res.data);
        // setMessages(() =>
        //   res?.data?.messages?.items
        //     .filter((f) => f.eventType === 'message')
        //     .reverse()
        // );
        setMessages([...res?.data, ...messages]);
        setLoadingMsg(false);
        setPage(page + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for label
  const handleLabelChange = async (e) => {
    setTaglabel(e.target.value);
    const payload = {
      tags: e.target.value,
    };
    await axios.put(addLabelUrl + `/${currentChat?.wa_id}`, payload, {
      headers: '',
    });
    setTagUpdated(payload.tags);
  };

  // agent assign
  const handleAgentChange = async (e) => {
    setAgentlabel(e.target.value);
    const payload = {
      agent: e.target.value,
    };
    await axios.put(addAgentUrl + `/${currentChat?.wa_id}`, payload, {
      headers: '',
    });
    setAgentUpdated(payload.agent);
  };

  //desktop notification alert
  const showNotification = () => {
    const notification_ = new Notification('hey', {
      body: 'A new message received',
      icon: 'https://cdn2.iconfinder.com/data/icons/ios7-inspired-mac-icon-set/1024/messages_5122x.png',
    });

    notification_.onClick = (e) => {
      window.location.href = 'http://google.com';
    };
  };

  // connection with socket
  useEffect(() => {
    socket.current = io('/');
    // socket.current.on('connection', () => {
    //   console.log("Socket connected");
    // });
    // socket.current.on('new_msg', (data) => {
    //   setMsg((draft) => {
    //     draft.res.push(data);
    //   });
    // });
    let api = localStorage.getItem('api');
    let device = localStorage.getItem('device');

    socket.current.emit('user', {
      api: api,
      device: device,
    });

    let agent = localStorage.getItem('agent');

    socket.current.emit('agent', agent);

    socket.current.on('getAlert', (msg) => {
      // storeFiles(msg); //store incoming files data to excel
      setAlertMsg([msg]);
      if (Notification.permission === 'granted' && msg?.contacts) {
        showNotification();
      }
    });

    // fetching msg from user through webhook

    // socket.current.emit("addUser", 'userId');
    socket.current.on('getUsers', (msgs) => {
      console.log(msgs, 'webhook');
      let startInd = msgs.length > 19 ? msgs.length - 19 : 0;
      setArrivalMessage(msgs.slice(startInd, msgs.length));
      // let upcomingMsg = msgs?.filter((i) => i.contacts);
      // let filteredMsg = msgs?.filter((i) => i.contacts && i?.contacts[0]?.wa_id == currentChat?.wa_id);
    });
    socket.current.on('save', (saved) => {
      console.log(saved);
      setSaved(saved);
    });
    socket.current.on('update', (update) => {
      console.log('count', update);
      setUpdated(update);
    });
    // socket.current.on('notification', (newNoti) => {
    //   console.log(newNoti);
    //   setNewNotification(newNoti);
    // });
    socket.current.on('statusChanged', (filtered) => {
      console.log(filtered);
      setStatus(() => filtered);
      // setMsgId(id);
    });

    // razorpay notification
    socket.current.on('rpayNoti', (payments) => {
      console.log(payments, 'rpayWebhook');
      setClientPayment(payments);
    });

    // razorpayX notification
    socket.current.on('rpayXNoti', (payX) => {
      console.log(payX, 'rpayXWebhook');
      setTutorPayout(payX);
    });

    // interested tutor notification
    socket.current.on('interestedTutors', (interestedTutor) => {
      console.log(interestedTutor, 'interestedTutors');
      setInterestedTutors(interestedTutor);
    });

    // new session notification
    socket.current.on('newSession', (newSession) => {
      console.log(newSession, 'newSessions');
      setNewSessions(newSession);
    });

    //agent status fetch
    const getAgentStatus = async () => {
      try {
        const res = await axios.get(`${localStorage.getItem('api')}/api/agent/getAgentStatus/${localStorage.getItem('agent')}`);
        setAgentStatus(res.data.status);
        setChatLabels(res.data.labels);
      } catch (err) {
        console.log(err);
      }
    };
    getAgentStatus();
    // socket.current.on('getAlert', (msg) => {
    //   console.log(msg);
    //   setAlertMsg([msg]);
    // });
  }, []);

  console.log(arrivalMessage);

  useEffect(() => {
    console.log(currentChat);
    arrivalMessage[arrivalMessage.length - 1]?.contacts &&
      setNewMsgRec(() =>
        arrivalMessage?.filter(
          (i) => i.contacts && i?.contacts[0]?.wa_id == currentChat?.wa_id
        )
      );
  }, [arrivalMessage, currentChat]);
  console.log(newMsgRec);

   //fetching all messages of a particular selected user
   useEffect(() => {
    // setMsgLoad(true);
    const getMessages = async () => {
      try {
        const res = await axios.get(
          msgUrl + `/${currentChat?.wa_id}`,
          {
            params: {
              page: 0,
              limit: limit,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setMsgResponse(res.data);
        // setMessages(() =>
        //   res?.data?.messages?.items
        //     .filter((f) => f.eventType === 'message')
        //     .reverse()
        // );
        setMessages([...res?.data]);
        setMsgLoad(false);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
    return () => {
      setNewMsgRec([]);
    };
  }, [currentChat, forwarded, sent]);

  //sending files
  const handleFiles = (e) => {
    let files = e;
    setFile(e);
    let fileData = [];
    let reader = new FileReader();
    let myfiles = files;
    reader.readAsDataURL(myfiles);
    reader.onload = (e) => {
      let formData = { fileList: e.target.result };
      console.log(formData);
      setMyFiles([formData]);
      // setFile(formData);
    };

    console.log(files);
  };
  console.log(myFiles);
  console.log(file);

  const closeFileModal = () => {
    // show.current.style.display = 'none'
    setMyFiles([]);
    setFile(null);
    setLoading(false);
    setErrMsg('');
    // setShowFile(false);
  };

  // // fetching msg from user through webhook
  // useEffect(() => {
  //   // socket.current.emit("addUser", 'userId');
  //   socket.current.on('getUsers', (msgs) => {
  //     console.log(msgs);
  //     setArrivalMessage(msgs);
  //     // let upcomingMsg = msgs?.filter((i) => i.contacts);
  //     let filteredMsg = msgs?.filter((i) => i.contacts && i?.contacts[0]?.wa_id == currentChat?.wa_id);
  //     setNewMsgRec(filteredMsg.reverse());
  //     console.log(currentChat);
  //   });
  //   // socket.current.on('getAlert', (msg) => {
  //   //   console.log(msg);
  //   //   setAlertMsg([msg]);
  //   // });
  // }, []);
  console.log(newMsgRec);
  console.log(currentChat);

  // fetching contacts list
  useEffect(() => {
    let agent = localStorage.getItem('agent');
    const getConversations = async () => {
      try {
        const res = await axios.get(
          getCustomersUrl + `/${agent}`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.status);
        // const filteredData = res?.data?.filter((i) => i.agent == agent);
        // let pinnedChat = res?.data?.filter((el) => el.pinContact === true);
        // let unPinnedChat = res?.data
        //   ?.filter((el) => el.pinContact === false)
        //   ?.sort((a, b) => {
        //     return b.timestamp - a.timestamp;
        //   });
        setConversations(res?.data?.result);
        setConvCount(res?.data?.length);
        setSaved(null);
        setUpdated(null);
      } catch (err) {
        console.log(err.Error);
      }
    };
    getConversations();
  }, [
    // arrivalMessage,
    saved,
    updated,
    tagUpdated,
    agentUpdated,
    pinned,
    markChat,
    alertUpdate,
    sent,
  ]);

  console.log(conversations);

  // //fetching tutors list
  // useEffect(() => {
  //   const getTutors = async () => {
  //     try {
  //       const res = await axios.get('${localStorage.getItem('api')}/api/tutor/getTutors',
  //       {
  //         params: {
  //           page: 1,
  //           limit: 10,
  //         },
  //       },
  //       {
  //         headers: '',
  //       });
  //       setTutorList(res.data.result);
  //       setTutorCount(res.data.length);
  //     } catch (err) {
  //       console.log(err.Error);
  //     }
  //   }
  //   getTutors();
  // }, [tutorTagUpdated, tutorRatingUpdated])

  useEffect(() => {
    setFinalMessage([]);
    setMsgLoad(true);
    setPage(1);
  }, [currentChat]);

  console.log(forwarded);

  console.log(messages);
  console.log([...messages, ...newMsgRec]);
  console.log(newMsgRec);

  // var ur = [{n: [{id: '123'}]}, {n: [{id: '123'}]}, {id: '123'}, {n: [{id: '13'}]}];
  function filteredArr(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }
  // filtering duplicate messages
  useEffect(() => {
    // let newArr = [...messages, ...newMsgRec];
    let newArr = [...messages, ...newMsgRec];
    // .filter(
    //   (f) => f.eventType === 'message' || f.eventType === 'broadcastMessage'
    // );
    console.log('newArr', newArr);
    setFinalMessage(() =>
      filteredArr(newArr, (it) => (it.messages ? it.messages[0].id : it.id))
    );
  }, [messages, newMsgRec]);

  //quick reply
  const typeMsg = async (e) => {
    if (e.target.value === '/') {
      try {
        const response = await axios.get(quickReplyUrl);
        setQuickReplyText(response?.data);
        // setQuickReplyText(quickReplies);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filteredQuickReplyText =
    newMessage.length > 0 && quickReplyText.length > 0
      ? quickReplyText?.filter((f) => {
          return (
            f.shortcut.toLowerCase().indexOf(newMessage.toLowerCase()) !== -1
          );
        })
      : null;

  console.log(quickReplyText);

  // sending messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      recipient_type: 'individual',
      to: currentChat.wa_id,
      conversationId: '',
      name: currentChat.name,
      from: currentChat.wa_id,
      wa_id: currentChat.wa_id,
      text: {
        body: newMessage,
      },
      type: 'text',
      data: '',
      isOwner: true,
    };
    const timeStamp = {
      timestamp: Math.floor(new Date().getTime() / 1000.0),
    };
    if (newMessage) {
      try {
        setNewMessage('');
        const res = await axios.post(sendMsgUrl, payload, {
          headers: { ...headerKey },
        });
        //setMessages([...messages, res.data.message]);
        // setFinalMessage([...finalMessage, res?.data]);
        console.log('sendm', res);
        await axios.put(`${contactUrl}/${currentChat?.wa_id}`, timeStamp, {
          headers: { 'Content-Type': 'application/json' },
        });
        setTimeout(() => {
          console.log('This will run after 1 second!');
          setSent(!sent);
        }, 0);
      } catch (err) {
        console.log(err);
      }
    }
  };

  console.log('fmsg', finalMessage);

  // sending files
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);
    console.log(file.name);
    try {
      const res_ = await axios.post(
        'https://waba.360dialog.io/v1/media',
        file,
        {
          headers: {
            'Content-Type':
              file.type == 'application/x-zip-compressed'
                ? 'application/zip'
                : file.type,
            'D360-API-KEY': apiKey || localStorage.getItem('api_key'),
          },
        }
      );
      const payload = {
        recipient_type: 'individual',
        to: currentChat.wa_id,
        type: file.type.includes('image/')
          ? 'image'
          : file.type.includes('video/')
          ? 'video'
          : file.type.includes('audio/')
          ? 'audio'
          : 'document',
        data: {
          id: res_.data.media[0].id,
          caption: caption,
          filename: file.name,
        },
        name: '',
        from: '',
        wa_id: currentChat.wa_id,
        timestamp: '',
        operatorName: '',
        isOwner: true,
        status: '',
        ticketId: '',
        eventType: '',
      };
      const res = await axios.post(sendFileUrl, payload, {
        headers: { ...headerKey },
      });
      //setMessages([...messages, res.data.message]);
      // setFinalMessage([...finalMessage, res.data.message]);
      console.log(res);
      // setUserId(currentChat?.wAid);
      // setMessageId(res.data.message.whatsappMessageId);
      setNewMessage('');
      // setInterval(() => {
      //   console.log('This will run every second!');
      // }, 2000);
      setTimeout(() => {
        console.log('This will run after 0.5 second!');
        setSent(!sent);
        setFileSent(+fileSent + 1);
      }, 500);
      setMyFiles([]);
      setLoading(false);
      setCaption('');
    } catch (err) {
      setLoading(false);
      setErrMsg('Something went wrong!');
      console.log(err);
    }
  };

  // fetching template messages
  // const getTemplateMsg = async () => {
  //   try {
  //     const res = await axios.get(templateMsgUrl, {
  //       headers: { ...headerKey },
  //     });
  //     console.log({templateMsg:res.data.waba_templates});
  //     setTemplateMessage(res.data.waba_templates);
  //     setShowTemplateMsg(true);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  console.log(showTemplateMsg);

  const closeTemplateTab = () => {
    setShowTemplateMsg(false);
  };

  // // send template message
  // const handleSendTemplate = async (val) => {
  //   const payload = {
  //     name: currentChat.name,
  //     from: '',
  //     wa_id: currentChat.wa_id,
  //     templateName: val?.name,
  //     templateText: val?.components?.filter((j) => j?.type === 'BODY')[0]?.text,
  //     template: {
  //       namespace: val.namespace,
  //       language: val.language,
  //     },
  //     button: '',
  //     timestamp: '',
  //     operatorName: '',
  //     isOwner: true,
  //     status: '',
  //     ticketId: '',
  //     eventType: 'template',
  //   };
  //   try {
  //     const res = await axios.post(sendtemplateMsgUrl, payload, {
  //       headers: { ...headerKey },
  //     });
  //     console.log(res);
  //     setTimeout(() => {
  //       console.log('This will run after 1 second!');
  //       setSent(!sent);
  //     }, 100);
  //     setShowTemplateMsg(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

   // send template message
   const handleSendTemplate = async () => {
    const payload = {
      name: currentChat.name,
      from: '',
      wa_id: currentChat.wa_id,
      templateName: "conversation_initiate",
      templateText: `Hi ${currentChat.name}, This is Tutorpoint.We want to start a conversation with you. Please reply as soon as you see this message.`,
      template: {
        namespace: NAME_SPACE,
        language: "en",
      },
      button: '',
      timestamp: '',
      operatorName: '',
      isOwner: true,
      status: '',
      ticketId: '',
      eventType: 'template',
    };
    try {
      const res = await axios.post(sendtemplateMsgUrl, payload, {
        headers: { ...headerKey },
      });
      console.log(res);
      setTimeout(() => {
        console.log('This will run after 1 second!');
        setSent(!sent);
      }, 100);
      setShowTemplateMsg(false);
    } catch (err) {
      console.log(err);
    }
  };

  // adding note b/w messages
  const handleSendNote = async (val) => {
    const payload = {
      name: currentChat.name,
      from: '',
      wa_id: currentChat.wa_id,
      clientNotes: {
        noteText: newMessage,
        priority: val
      },
      button: '',
      timestamp: '',
      operatorName: '',
      isOwner: true,
      status: '',
      ticketId: '',
      eventType: 'note',
    };
    try {
      const res = await axios.post(`${localStorage.getItem('api')}/api/messages/addChatNote`, payload, {
        headers: { ...headerKey },
      });
      console.log(res);
      setNewMessage('');
      setTimeout(() => {
        console.log('This will run after 1 second!');
        setSent(!sent);
      }, 100);
      // setShowTemplateMsg(false);
    } catch (err) {
      console.log(err);
    }
  };

  //Add contact
  const addContact = async () => {
    setAddingContact(true);
    const payload = {
      name: addName,
      wa_id: `+${addNumber}`,
    };
    try {
      const res = await axios.post(addContactUrl, payload, {
        headers: {},
      });
      setConversations([...conversations, res.data]);
      setAddNewContact(false);
      setAddName('');
      setAddNumber('');
      setAddingContact(false);
    } catch (err) {
      setConfirmationText('Failed to add this contact!');
      setAddingContact(false);
    }
  };

  useEffect(() => {
    if (scrollView_ && scrollView || finalMessage.length <= 20) {
      scrollRef.current?.scrollIntoView();
    }
  }, [finalMessage, fileSent, currentChat]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoversation = conversations;

  // filtered tutor list
  // const filteredTutorList = tutorList?.filter((f) => {
  //   let subject = f?.subjects?.find(element => element?.toLowerCase() == searchTutor?.toLowerCase());
  //   let tag = f?.tags?.find(element => element?.toLowerCase() == searchTutor?.toLowerCase());
  //   return (
  //     f.name.toLowerCase().indexOf(searchTutor.toLowerCase()) !== -1 ||
  //     f.wa_id.toLowerCase().indexOf(searchTutor.toLowerCase()) !== -1 ||
  //     f?.subjects?.toString().toLowerCase().indexOf(searchTutor.toLowerCase()) !== -1 ||
  //     f?.tags?.toString().toLowerCase().indexOf(searchTutor.toLowerCase()) !== -1
  //   );
  // });

  console.log(currentChat);
  const handleCloseTooltip = () => {
    setOpenTooltip(false);
  };

  const handleOpenTooltip = () => {
    setOpenTooltip(true);
  };

  const handleCloseTooltipForm = () => {
    setOpenTooltipForm(false);
  };

  const handleOpenTooltipForm = () => {
    setOpenTooltipForm(true);
  };

  const handleKeyPress = (e) => {
    if (e.key == 'Enter' && e.shiftKey) {
      handleSubmit(e);
    }
  };

  const fetchMoreData = async (e) => {
    // console.log(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight)
    setScrollPosition(e.target.scrollTop);
    const bottom = e.target.scrollTop;
    if (bottom === 0) {
      // TO SOMETHING HERE
      console.log('Reached bottom');
      // setPage(page + 1);
      // try {
      //   const res = await axios.get(
      //     msgUrl + `/${currentChat?.wa_id}`,
      //     {
      //       params: {
      //         page: page,
      //         limit: limit,
      //       },
      //     },
      //     {
      //       headers: '',
      //     }
      //   );
      //   console.log(res.data);
      //   setMsgResponse(res.data);
      //   // setMessages(() =>
      //   //   res?.data?.messages?.items
      //   //     .filter((f) => f.eventType === 'message')
      //   //     .reverse()
      //   // );
      //   setMessages([...res?.data, ...messages]);
      // } catch (err) {
      //   console.log(err);
      //  }
    } else if (
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <
      260
    ) {
      setScrollView(true);
    } else if (
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight >=
      260
    ) {
      setScrollView(false);
    }
  };

  // const handleTutorList = async (event, value) => {
  //   setTutorListLoading(true);
  //   setTutorPage(value);
  //   try {
  //     const res = await axios.get('${localStorage.getItem('api')}/api/tutor/getTutors',
  //       {
  //         params: {
  //           page: value,
  //           limit: 10,
  //         },
  //       },
  //       {
  //         headers: '',
  //       }
  //     );
  //     console.log(res.data);
  //     setTutorList(res.data.result);
  //     setTutorListLoading(false);
  //     // setLoadingMsg(false);
  //     // setPage(page + 1);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleSearchTutors = async (e) => {
  //   // setSearchTutor(e.target.value);
  //   if (e.key == 'Enter') {
  //     try {
  //       const res = await axios.get(`${localStorage.getItem('api')}/api/tutor/getTutors/${e.target.value}`,
  //         {
  //           params: {
  //             page: 1,
  //             limit: 10,
  //           },
  //         },
  //         {
  //           headers: '',
  //         }
  //       );
  //       console.log(res.data);
  //       setTutorList(res.data.result);
  //       setTutorCount(res.data.length);
  //       // setTutorListLoading(false);
  //       // setLoadingMsg(false);
  //       // setPage(page + 1);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  const handleContactList = async (event, value) => {
    let agent = localStorage.getItem('agent');
    if (searchContacts) {
      setContactListLoading(true);
      setContactPage(value);
      try {
        const res = await axios.get(
          getCustomersUrl + `/${agent}/${searchContacts}`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setConversations(res?.data?.result);
        setContactListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);

        setSaved(null);
        setUpdated(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      setContactListLoading(true);
      setContactPage(value);
      try {
        const res = await axios.get(
          getCustomersUrl + `/${agent}`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setConversations(res?.data?.result);
        setContactListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);

        setSaved(null);
        setUpdated(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearchContacts = async (e) => {
    let agent = localStorage.getItem('agent');
    setSearchContacts(e.target.value);
    if (e.key == 'Enter') {
      setContactListLoading(true);
      try {
        const res = await axios.get(
          getCustomersUrl + `/${agent}/${e.target.value}`,
          {
            params: {
              page: 1,
              limit: 20,
            },
          },
          {
            headers: '',
          }
        );
        console.log(res.data);
        setContactListLoading(false);
        setConversations(res?.data?.result);
        setConvCount(res?.data?.length);
        setContactPage(1);
        // setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleContactValidate = async () => {
    let payload = {
      wa_id: `+${currentChat?.wa_id}`,
    }
    try {
      const res = await axios.post(`${localStorage.getItem('api')}/api/conversations/contactValidation`, payload);
      setOpenSnackBar(true);
      setAlertText(res.data.contacts[0].status + ' contact');
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleAgentStatus = async (status) => {
    let payload = {
      status: status
    }
    try {
      const res = await axios.put(`${localStorage.getItem('api')}/api/agent/updateAgentStatus/${localStorage.getItem('agent')}`, payload);
      window.location.reload();
    }
    catch (err) {
      console.log(err);
    }
  }

  const logOutFunc = () => {
    localStorage.clear();
    window.location.reload();
  };

  const actions = [
    { icon: <PriorityHighIcon color='success' onClick={() => handleSendNote('low')} />, name: 'Low priority' },
    { icon: <PriorityHighIcon color='primary' onClick={() => handleSendNote('medium')} />, name: 'Medium priority' },
    { icon: <PriorityHighIcon color='error' onClick={() => handleSendNote('high')} />, name: 'High priority' },
  ];

  let deviceNo = localStorage.getItem('device');
  let agentName = localStorage.getItem('agent');

  // agent field update in all contacts
  // const [convag, setConvag] = useState([]);
  // useEffect(() => {
  //   const getAgg = async () => {
  //     try {
  //       const res = await axios.get(
  //         '${localStorage.getItem('api')}/api/conversations3/getContacts',
  //         {
  //           headers: '',
  //         }
  //       );
  //       setConvag(res?.data)
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getAgg();

  // }, [])

  // const agentUpdate = async () => {
  //   let count = '200100';
  //   for(let i = 0; i<convag.length; i++){
  //     let pay = {
  //       uid: count
  //     }
  //     await axios.put(`${localStorage.getItem('api')}/api/conversations3/customer/${convag[i].wa_id}`, pay);
  //     count = +count + 1;
  // }
  // }

  return (
    <>
      <div className='messenger'>
        <div className='chatMenu'>
          <header className='chat_header'>
            <img
              className='profilePic'
              src='/assets/person/noAvatar.png'
              alt=''
            />
            <div
              style={{
                flex: '1',
                fontSize: '16px',
                fontWeight: '600',
                height: '22px',
                lineHeight: '4px',
              }}
              // onClick={agentUpdate}
            >
              Device-{deviceNo}{' '}
              {deviceNo == 1
                ? '(7761093194)'
                : deviceNo == 2
                ? '(7091489698)'
                : deviceNo == 3
                ? '(7761814102)'
                : deviceNo == 4
                ? '(8777592248)'
                : deviceNo == 5
                ? '(9065650479)'
                : null}
              <p style={{ color: '#585858' }}>{agentName}</p>
            </div>
            {localStorage.getItem('agent') != 'Admin' && agentStatus == 'inactive' ? <ToggleOffIcon
              style={{
                fontSize: '32px',
                color: '#50585C',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={() => handleAgentStatus('active')}
            /> : localStorage.getItem('agent') != 'Admin' && agentStatus == 'active' ?
            <ToggleOnIcon
              style={{
                fontSize: '32px',
                color: '#00EC64',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={() => handleAgentStatus('inactive')}
            /> : null}
            <div
              style={{
              marginRight: '10px',
            }}
            >
              <NoteHistory setCurrentChat = {setCurrentChat} setFinalMessage = {setMessages} scrollRef={scrollRef} setScrollView_={setScrollView_} setPage = {setPage} />
            </div>
            <PersonAddAltOutlinedIcon
              style={{
                fontSize: '32px',
                color: addNewContact ? '#337DDD' : '#50585C',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={() => setAddNewContact(true)}
            />
            {/* <MoreVertIcon
              style={{
                fontSize: '25px',
                color: '#50585C',
                cursor: 'pointer',
                marginRight: '-10px',
              }}
            /> */}
            <LogoutIcon
              style={{ cursor: 'pointer', marginLeft: '5px' }}
              onClick={logOutFunc}
            />
          </header>
          <div
            style={{
              height: '2.3rem',
              padding: '6px 0px 6px 17px',
              backgroundColor: '#9DE1FE',
            }}
          >
            <input
              placeholder='Search for users'
              className='chatMenuInput'
              onChange={(e) => handleSearch(e)}
              onKeyPress={handleSearchContacts}
            />
          </div>
          {addNewContact && (
            <div
              style={{
                height: '8.4rem',
                padding: '20px 0px 20px 17px',
                backgroundColor: '#fff',
                border: '1px solid #b3b0b0',
                borderRadius: '3px',
              }}
            >
              <input
                type='text'
                className='addContactInput'
                placeholder='Name'
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                required
              />
              <input
                type='number'
                className='addContactInput'
                placeholder='WhatsApp Number (with country code)*'
                value={addNumber}
                onChange={(e) => setAddNumber(e.target.value)}
                required
              />
              <Stack direction='row' spacing={2}>
                {addName && addNumber && !addingContact ? (
                  <Button
                    size='small'
                    variant='contained'
                    color='error'
                    onClick={() => addContact()}
                  >
                    save
                  </Button>
                ) : addingContact ? (
                  <LoadingButton
                    size='small'
                    loading
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    variant='contained'
                  >
                    Save
                  </LoadingButton>
                ) : (
                  <Button
                    size='small'
                    variant='contained'
                    color='error'
                    disabled
                  >
                    save
                  </Button>
                )}

                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  onClick={() => {
                    setAddNewContact(false);
                    setAddingContact(false);
                    setConfirmationText('');
                  }}
                >
                  close
                </Button>
                <div
                  style={{
                    alignSelf: 'center',
                    color: 'red',
                    fontSize: '13px',
                  }}
                >
                  {confirmationText}
                </div>
              </Stack>
            </div>
          )}
          {contactListLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '100px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <div className='chatMenuWrapper'>
              {filteredCoversation?.map((c) => (
                <div
                  onClick={() => {
                    setCurrentChat(c);
                    setHighlighted(true);
                    setShowTemplateMsg(false);
                    setTaglabel('');
                    setTagUpdated('');
                  }}
                >
                  <Conversation
                    conversation={c}
                    currentChat={currentChat}
                    finalMessage={finalMessage}
                    alertMsg={alertMsg}
                    arrivalMessage={arrivalMessage}
                    alert={alert}
                    // newNotification={newNotification}
                    setAlert={setAlert}
                    msgCountUpdated={msgCountUpdated}
                    setMsgCountUpdated={setMsgCountUpdated}
                    setPinned={setPinned}
                    setMarkChat={setMarkChat}
                    setAlertUpdate={setAlertUpdate}
                    apiUrl={apiUrl}
                  />
                </div>
              ))}
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '15px',
                }}
                count={Math.ceil(convCount / 20)}
                page={contactPage}
                onChange={handleContactList}
              />
            </div>
          )}
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <header className='currentChatHeader'>
                  <img
                    className='profilePic'
                    src='/assets/person/noAvatar.png'
                    alt=''
                  />
                  <div>
                    {`${currentChat?.name}${currentChat?.wa_id.slice(
                    0,
                    3
                  )}`}
                  </div>
                  <div style={{marginLeft: "5px", cursor: 'pointer'}}>
                    <AutorenewRoundedIcon fontSize='small' onClick={handleContactValidate} />
                    <Snackbar open={openSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                      <Alert onClose={handleCloseSnackBar} severity="info" sx={{ width: '100%' }}>
                        {alertText}
                      </Alert>
                    </Snackbar>
                  </div>
                  <div className='select-list'>
                    <select
                      name='taglabel'
                      id='taglabel'
                      value={taglabel}
                      onChange={handleLabelChange}
                    >
                      <option selected value=''>
                        Labels
                      </option>
                      {chatLabels?.map((l) => <option value={l}>{l}</option>)}
                      {/* <option value='Old Client'>Old Client</option>
                      <option value='New Client'>New Client</option>
                      <option value='High Price Client'>High Price Client</option>
                      <option value='Low Price Client'>Low Price Client</option>
                      <option value='Call'>Call</option>
                      <option value='Tutor'>Tutor</option>
                      <option value='Full Course'>Full Course</option> */}
                       {/*<option value='Tutor pay pending'>
                        Tutor pay pending
                      </option>
                      <option value='Client payment pending'>
                        Client payment pending
                      </option>
                      <option value='Session today'>Session today</option>
                      <option value='Session tomorrow'>Session tomorrow</option>
                      <option value='Assignment pending'>
                        Assignment pending
                      </option>
                      <option value='Tutors notified'>Tutors notified</option>
                      <option value='Tutor is working'>Tutor is working</option>
                      <option value='Take payment'>Take payment</option>
                      <option value='Pay tutor'>Pay tutor</option>
                      <option value='More work available'>
                        More work available
                      </option>
                      <option value='Not available tomorrow'>
                        Not available tomorrow
                      </option> */}
                    </select>
                    {/* {taglabel === 'other' ? (
                  <input
                    type='text'
                    name='other_degree'
                    style={{marginLeft: '20px', width: '70px'}}
                    placeholder='tag name'
                    // value={other_degree}
                    // onChange={handleOther}
                    // autoComplete='none'
                    // required
                  />
                ) : null} */}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Label: {currentChat.tags || taglabel || '--'}
                  </div>
                  {/* <div style={{ display: 'flex', marginLeft: '460px' }}>
                    <MoreVertIcon style={{ alignSelf: 'center' }} />
                  </div> */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: '10%',
                      justifyContent: 'flex-end',
                      marginRight: '15px',
                    }}
                  >
                    <div>Assign to:</div>
                    <div className='select-list'>
                      <select
                        name='agentlabel'
                        id='agentlabel'
                        value={agentlabel}
                        className='select-list2'
                        onChange={handleAgentChange}
                      >
                        <option value='Admin'>Admin</option>
                        <option value='Chaitanya'>Chaitanya</option>
                        <option value='Nityananda'>Nityananda</option>
                        <option value='Advaita'>Advaita</option>
                        <option value='Abhay'>Abhay</option>
                      </select>
                    </div>
                  </div>
                </header>
                {finalMessage?.length == 0 || msgLoad ? (
                  <div className='chatBoxTop'>
                    <ReactLoading
                      type='spinningBubbles'
                      color='#2ca6d6'
                      className='loadingIcon'
                    />
                    <div className='no_message'>
                      {finalMessage?.length == 0 && (
                        <p className='no_messageText'>
                          You have not started conversation with this person!
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className='chatBoxTop'
                      // style={{display: 'flex', flexDirection: 'column-reverse'}}
                      onScroll={fetchMoreData}
                      ref={listInnerRef}
                    >
                      {finalMessage.length > 0 && (
                        <div
                          style={{
                            textAlign: 'center',
                            textAlign: '-webkit-center',
                          }}
                        >
                          {/* <LoadingButton
                            onClick={handleLoadMoreMsgClick}
                            endIcon={<ReplayIcon />}
                            loading={loadingMsg}
                            loadingPosition='end'
                            variant='outlined'
                          >
                            Load more
                          </LoadingButton> */}
                          <IconButton><ReplayIcon onClick={handleLoadMoreMsgClick} /></IconButton>
                        </div>
                      )}
                      {finalMessage.map((m, i, j) => (
                        <div ref={scrollRef} key={i}>
                          <Message
                            message={m}
                            msgArr={j}
                            own={m.owner}
                            ownAlt={m.isOwner}
                            setForward={setForward}
                            mulForward={mulForward}
                            setMulForward={setMulForward}
                            setVisible={setVisible}
                            setShowSelector={setShowSelector}
                            showSelector={showSelector}
                            apiUrl={apiUrl}
                            status={status}
                            msgId={msgId}
                          />
                        </div>
                      ))}

                      {visible && (
                        <div>
                          <ForwardMsg
                            conversations={conversations}
                            visible={visible}
                            setVisible={setVisible}
                            forward={forward}
                            forwarded={forwarded}
                            setForwarded={setForwarded}
                            mulForward={mulForward}
                            setMulForward={setMulForward}
                            setForwardMsg={setForwardMsg}
                            apiKey={apiKey}
                            convCount={convCount}
                            contactPage={contactPage}
                            handleContactList={handleContactList}
                            contactListLoading={contactListLoading}
                            getCustomersUrl={getCustomersUrl}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {myFiles.length > 0 && file ? (
                  <div id='id01' className='modal_'>
                    <form className='modal-content_'>
                      <header
                        style={{
                          height: '148px',
                          backgroundColor: '#0B1929',
                          position: 'absolute',
                          width: '450px',
                          borderRadius: '5px',
                          padding: '12px 12px 0px 12px',
                        }}
                      >
                        <CloseIcon
                          fontSize='medium'
                          style={{
                            color: '#f2efef',
                            margin: '12px 10px -5px 10px',
                            cursor: 'pointer',
                          }}
                          onClick={closeFileModal}
                        />
                        <span
                          style={{
                            fontSize: '18px',
                            margin: '0px 0px 0px 10px',
                            fontWeight: '400',
                            color: '#ffff',
                          }}
                        >
                          Send the file
                        </span>
                        {/* <iframe src={myFiles[0].fileList} height="200" width="300" title="description"></iframe> */}
                        <div
                          style={{ padding: '15px', color: 'rgb(219 218 218)' }}
                        >
                          {file?.name}
                        </div>
                        <input
                          className='chatMessageInput'
                          placeholder='Add a caption...'
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                        />
                        <SendIcon
                          style={{
                            color: '#ffff',
                            cursor: 'pointer',
                            float: 'right',
                            padding: '5px 10px',
                            fontSize: '30px',
                          }}
                          onClick={handleFileSubmit}
                        />
                        {loading && (
                          <div style={{ paddingTop: '10px' }}>
                            <LinearProgress />
                          </div>
                        )}
                        {errMsg && <div className='errMsgText'>{errMsg}</div>}
                      </header>
                    </form>
                  </div>
                ) : null}
                <footer className='chatBoxBottom'>

                  {/* show templates */}
                  {/* <div
                    style={{
                      width: '-webkit-fill-available',
                      // overflowY: 'scroll',
                      // overflowX: 'hidden',
                      maxHeight: '199px',
                    }}
                  >
                    {showTemplateMsg ? (
                      <div>
                        <header
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: '#ffff',
                            height: '3rem',
                            borderBottom: '1px solid #f0f0f0',
                          }}
                        >
                          <CloseIcon
                            fontSize='medium'
                            style={{
                              color: 'gray',
                              margin: '12px 16px 0px',
                              cursor: 'pointer',
                            }}
                            onClick={closeTemplateTab}
                          />
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            Choose Template
                          </div>
                        </header>
                        <div
                          style={{
                            height: '150px',
                            zIndex: '1',
                            // marginBottom: '-46px',
                            backgroundColor: '#ffff',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                          }}
                        >
                          {templateMessage &&
                            templateMessage?.map((i) => {
                              return (
                                <>
                                  {i.status === 'approved' ? (
                                    <div
                                      className='templateCard'
                                      onClick={() => handleSendTemplate(i)}
                                    >
                                      <p
                                        style={{
                                          fontWeight: 'bold',
                                          fontStyle: 'italic',
                                        }}
                                      >
                                        {i.name}
                                      </p>
                                      <p>
                                        {
                                          i.components.filter(
                                            (j) => j.type === 'BODY'
                                          )[0].text
                                        }
                                      </p>
                                    </div>
                                  ) : null}
                                </>
                              );
                            })}
                        </div>
                      </div>
                    ) : null}
                  </div> */}
                  <div
                    style={{
                      width: '-webkit-fill-available',
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      maxHeight: '199px',
                    }}
                  >
                    {filteredQuickReplyText &&
                      filteredQuickReplyText?.map((i) => {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              backgroundColor: 'rgb(223 223 223)',
                              padding: '15px 20px',
                              borderBottom: '1px solid rgb(209 209 209)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setNewMessage(i.message)}
                          >
                            <span
                              style={{ fontWeight: '600', marginRight: '5px' }}
                            >
                              {i.shortcut}
                            </span>
                            {i.message}
                          </div>
                        );
                      })}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '-webkit-fill-available',
                      height: '4.3rem',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    {showSelector ? (
                      <div style={{ display: 'flex', flex: '100%' }}>
                        <CloseIcon
                          style={{
                            flex: '5%',
                            cursor: 'pointer',
                            fontSize: '30px',
                            marginLeft: '5px',
                          }}
                          onClick={() => {
                            setShowSelector(false);
                            setMulForward([]);
                          }}
                        />
                        <div style={{ flex: '90%' }}></div>
                        <ReplyIcon
                          style={{ flex: '5%' }}
                          className='forward_final'
                          onClick={() => {
                            setVisible(true);
                            setShowSelector(false);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className='attachFile'>
                          <AttachFileIcon
                            fontSize='medium'
                            className='attachButton'
                          />
                          <input
                            id='myFile'
                            name='myFile'
                            type='file'
                            className='attachInput'
                            onChange={(e) => handleFiles(e.target.files[0])}
                          />
                        </div>
                        <Tooltip
                          open={openTooltipForm}
                          onClose={handleCloseTooltipForm}
                          onOpen={handleOpenTooltipForm}
                          title='CREATE FORM'
                        >
                          <FormCreation clientId={currentChat.uid} clientWaId = {currentChat.wa_id} clientName = {currentChat.name} agent = {currentChat.agent} />
                        </Tooltip>
                        <Tooltip
                          open={openTooltip}
                          onClose={handleCloseTooltip}
                          onOpen={handleOpenTooltip}
                          // title='SEND TEMPLATE'
                          title='INITIATE CONVERSATION'
                        >
                          <SpeakerNotesIcon
                            className='templateMsg'
                            // onClick={getTemplateMsg}
                            onClick={handleSendTemplate}
                          />
                        </Tooltip>
                        <textarea
                          className='chatMessageInput'
                          placeholder='Type a message...'
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            typeMsg(e);
                          }}
                          onKeyPress={handleKeyPress}
                        />
                        {newMessage.length > 0 ? (
                         <>
                         &nbsp;
                          <SendIcon
                            fontSize='medium'
                            style={{fontSize: '29px'}}
                            className='chatSubmitButton'
                            onClick={handleSubmit}
                          />
                          {/* <NoteAddIcon
                            fontSize='medium'
                            style={{fontSize: '25px'}}
                            className='chatSubmitButton'
                            onClick={handleSendNote}
                          /> */}
                          <span className='chatSubmitButton'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          <SpeedDial
                            ariaLabel="SpeedDial openIcon example"
                            style={{left: '97%', height: '29px'}}
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<NoteAddIcon fontSize='medium' style={{fontSize: '26px', color:'#9B9B9B'}} openIcon={<SendIcon fontSize='medium' style={{fontSize: '26px', color:'#1977f2'}} />} />}
                          >
                            {actions.map((action) => (
                              <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                              />
                            ))}
                          </SpeedDial>
                         </>
                        ) : (
                          <MicIcon fontSize='large' className='micButton' />
                        )}
                      </>
                    )}
                  </div>
                </footer>
              </>
            ) : (
              <img
                src={chatDemo}
                // height='600'
                // width='600'
                style={{
                  alignSelf: 'center',
                  marginTop: '130px',
                  height: '60vh',
                }}
              />
            )}
          </div>
        </div>
        <RightSec newSessions={newSessions} interestedTutors={interestedTutors} clientPayment={clientPayment} tutorPayout={tutorPayout} />
      </div>
    </>
  );
};

export default Messenger;
