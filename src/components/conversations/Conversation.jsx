import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import './conversation.css';
import {
  msgUrl,
  alertMsgUrl,
  pinChatUrl,
  markChatUrl,
  stickComment,
  fetchStickComment
} from '../../serviceUrls/Message-Services';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { io } from 'socket.io-client';
import moment from 'moment';
import PushPinIcon from '@mui/icons-material/PushPin';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import StickComments from "../dialogs/StickComments"
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(80, 80, 80, 0.92)",
    color: "#ffff",
    fontWeight: "500",
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid rgba(80, 80, 80, 0.92)",
    overflowX: "hidden",
    overflowY: "scroll",
    maxHeight: "300px"
  },
}));
// import useSound from 'use-sound';

// import notification from '../../assets/notification.mp3';

export default function Conversation({
  apiUrl,
  conversation,
  currentUser,
  currentChat,
  finalMessage,
  arrivalMessage,
  alertMsg,
  alert,
  setAlert,
  setPinned,
  setMarkChat,
  setAlertUpdate,
}) {
  const [msg, setMsg] = useState([]);
  const [alertText, setAlertText] = useState([]);
  const [alertMessage, setAlertMessage] = useState([]);
  // const [hide, setHide] = useState(false);
  const [msgCount, setMsgCount] = useState();

  const socket = useRef();
  const alertIcon = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const headerKey = {
    Accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTYyMWZkZi0wYjJjLTQxYzAtOWZmMS1iZDk5NWZmYTQ2ZTUiLCJ1bmlxdWVfbmFtZSI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwibmFtZWlkIjoib2ZmaWNlQHR1dG9ycG9pbnQuaW4iLCJlbWFpbCI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwiYXV0aF90aW1lIjoiMDgvMDQvMjAyMSAwODoxMTowMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.lSSh1EL29ksj23Y_rTSrLhYVwhOFyddK1c6bKU-_HB4',
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [stickComments,setStickComments] =useState();
  const [noteDetails, setNoteDetails] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(msg);
  // useEffect(() => {
  //   const friendId = conversation.id;

  //   const getUser = async () => {
  //     try {
  //       const res = await axios(getCustomersUrl + `/${friendId}`, {headers: {...headerKey}});
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [conversation]);

  // useEffect(() => {
  //   socket.current = io('ws://localhost:8900');
  //   socket.current.on('getAlert', (msg) => {
  //     // storeFiles(msg); //store incoming files data to excel
  //     setAlertMsg([msg]);
  //   });
  // }, []);

  // const [play] = useSound(notification);

  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       const res = await axios.get(
  //         msgUrl + `/${conversation?.wa_id}?page=0&limit=20`,
  //         {
  //           headers: { ...headerKey },
  //         }
  //       );
  //       console.log(res.data);
  //       // setMessages(() =>
  //       //   res?.data?.messages?.items
  //       //     .filter((f) => f.eventType === 'message')
  //       //     .reverse()
  //       // );
  //       setMsg([...res?.data]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMessages();
  // }, [newNotification, alertMsg]);

  // console.log(arrivalMessage.length);

  // // useEffect(() => {
  // //   play();
  // // }, [arrivalMessage?.length])

  // useEffect(() => {
  //   const getAlert = async () => {
  //     try {
  //       const res = await axios.get(alertMsgUrl + `/${conversation?.wa_id}`, {
  //         headers: {},
  //       });
  //       console.log(res.data);
  //       // setMessages(() =>
  //       //   res?.data?.messages?.items
  //       //     .filter((f) => f.eventType === 'message')
  //       //     .reverse()
  //       // );
  //       setMsg([...res?.data]);
  //       setMsgCount(() => res?.data?.filter((i) => i.status === 'newMsg' && i.wa_id == conversation?.wa_id).length);
  //       setHide(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getAlert();
  // }, [alertMsg, newNotification]);

  // console.log(alertMessage);

  // useEffect(() => {
  //   setMsgCount(
  //     () =>
  //       alertMessage?.filter(
  //         (i) => i.status === 'newMsg' && i.wa_id == conversation?.wa_id
  //       ).length
  //   );
  // }, [alertMessage, alertMsg, newNotification]);

  const updateAlert = async (wa_id) => {
    if (conversation.newMsgCount > 0) {
      try {
        const payload = {
          newMsgCount: 0,
          timestamp: Math.floor(new Date().getTime() / 1000.0),
        };
        const response = await axios.put(
          `${apiUrl || localStorage.getItem('api')}/api/conversations/${wa_id}`,
          payload,
          {
            headers: {},
          }
        );
        setAlertUpdate(Math.floor(new Date().getTime() / 1000.0));
      } catch (err) {
        console.log(err);
      }
    }
  };

  console.log(alertMessage);

  const diff_hours = (dt1) => {
    var diff = new Date().getTime() / 1000.0 - dt1;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  // const filteredArrivalMessage = alertMsg?.filter(
  //   (i) => i.wAid === conversation.wAid
  // );

  // const newNoti = (id) => {
  //   let filtered = alertText.filter((i) => i.waId === id);
  //   console.log(filtered);
  //   return { arr: filtered, len: filtered.length };
  // };

  // useEffect(() => {
  //   setAlertText([...alertText, ...alertMsg]);
  //   setAlert(alert + 1);
  //   // return () => {
  //   //   setAlertText([])
  //   // }
  // }, [alertMsg]);

  // let filteredAlert = alertText?.filter((i) => i.waId === conversation?.wAid);

  // console.log(alertMsg);
  // console.log(alertText);
  // console.log(alert);

  const handlePinChat = async (waId, pin) => {
    const payload = {
      pinContact: !pin,
    };
    const res = await axios.put(pinChatUrl + `/${waId}`, payload, {
      headers: '',
    });
    setPinned(res?.data?.updatedAt);
  };

  const handleMarkChat = async (waId, markChat) => {
    const payload = {
      markAsUnread: !markChat,
    };
    const res = await axios.put(markChatUrl + `/${waId}`, payload, {
      headers: '',
    });
    setMarkChat(res?.data?.updatedAt);
  };

  const handleStickComments = async (whatsId, stickComments) => {
    const payload = {
      comments: stickComments,
    };
    const res = await axios.put(stickComment + `/${whatsId}`, payload, {
      headers: '',
    });
    fetchStickComments(whatsId)
    // setStickComments(res?.data?.comments);
    handleClose()
  };

  const fetchStickComments = async (waId) => {
  
    const res = await axios.get(fetchStickComment + `/${waId}`);
    if(res.data){
      setStickComments(res.data)
    }
   
  };

  const getNoteDetails = async (waId) => {
    try{
      const response = await axios.get(`${localStorage.getItem("api")}/api/messages/getNotes/${waId}`);
      setNoteDetails(response.data);
    } catch (err) {
      console.log(err);
    }

  }

  const shortText = (text) => {
    if(text.length > 17) {
      return `${text.slice(0, 17)}..`;
    }
    else if(text.length <= 17) {
      return text;
    }
  }

  return (
    <div
      className={
        currentChat?.wa_id == conversation?.wa_id
          ? 'conversation highlighted'
          : 'conversation'
      }
      onClick={() => {
        updateAlert(conversation?.wa_id);
      }}
    >
      <div className='userTab'>
        <Avatar className='conversationImg'>
          {conversation?.name?.slice(0, 2)}
        </Avatar>
        <div style={{ paddingBottom: '5px' }}>
          <div className='conversationName'>{`${
            conversation?.name
          }${conversation?.wa_id.slice(0, 3)}`}
            <HtmlTooltip
                placement="right"
                title={
                  <>
                    <Typography
                      color="inherit"
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                    {noteDetails && noteDetails.length > 0 ? 'Notes: ' : 'No Notes'}
                    </Typography>
                    {noteDetails && noteDetails.length > 0 && (
                      <Typography
                        color="inherit"
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "600",
                          marginBottom: "5px",
                          maxHeight:"500px",
                          overflowY:"scroll"
                        }}
                      >
                        {noteDetails.map((i) => 
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', fontSize: "12px", fontWeight: "normal", padding: '8px 5px', borderBottom: '1px solid #ffff' }}
                        >
                          <div style={{display: 'flex', flex: '60%', fontSize: '13px', fontWeight: '600', color: i?.clientNotes?.priority === 'high' ? 'red' : i?.clientNotes?.priority === 'medium' ? 'royalblue' : '#565555'}}>{i?.clientNotes?.noteText}</div>
                          <div style={{display: 'flex', alignSelf: 'self-end', fontSize: '11px'}}>
                            {moment(new Date(i.timestamp * 1000)).format('lll')}
                          </div>
                        </div>)}
                      </Typography>
                    )}
                   
                  </>
                }
              >
                <InfoIcon
                  fontSize="small"
                  style={{
                    fontSize: "12px",
                    cursor: "pointer",
                    marginLeft: "1px",
                  }}
                  onMouseEnter={() => getNoteDetails(conversation?.wa_id)}
                />
            </HtmlTooltip>
          </div>
          <div style={{ fontSize: '12px' }}>
            {`ED${conversation?.uid}`}
            <span className='usertag_'>{shortText(conversation?.tags)}</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '35%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              display: 'flex',
              flex: '1',
              justifyContent: 'flex-end',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 'normal',
            }}
          >
            {conversation?.pinContact && (
              <span
                style={{
                  marginRight: '14px',
                  transform: 'rotate(45deg)',
                  cursor: 'pointer',
                }}
              >
                <PushPinIcon style={{ fontSize: '15px' }} />
              </span>
            )}
            {diff_hours(conversation?.timestamp) < 24
              ? moment(
                  new Date(conversation?.timestamp * 1000).toISOString()
                ).format('hh:mm a')
              : moment(
                  new Date(conversation?.timestamp * 1000).toISOString()
                ).format('L')}
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}
          >
            <span
              style={{
                padding: '0px 10px',
                marginRight: '5px',
              }}
            >
              {conversation.markAsUnread && (
                <Badge badgeContent={''} color='primary'></Badge>
              )}
            </span>
            {conversation.newMsgCount > 0 && (
              <span
                style={{
                  padding: '0px 10px',
                  marginRight: '5px',
                }}
              >
                <Badge
                  badgeContent={conversation.newMsgCount}
                  color='success'
                ></Badge>
              </span>
            )}
            <span style={{ paddingRight: '5px' }}>
              <KeyboardArrowDownIcon
                fontSize='small'
                color='action'
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleClick(e);
                }}
              />
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinChat(
                      conversation?.wa_id,
                      conversation?.pinContact
                    );
                    handleClose();
                  }}
                >
                  {conversation?.pinContact ? 'Unpin chat' : 'Pin chat'}
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkChat(
                      conversation?.wa_id,
                      conversation?.markAsUnread
                    );
                    handleClose();
                  }}
                >
                  {conversation?.markAsUnread
                    ? 'Mark as read'
                    : 'Mark as unread'}
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // setWhatsId(conversation?.wa_id)
                    // fetchStickComments(conversation?.wa_id)
                  }}
                >
                  <StickComments handleStickComments={handleStickComments} fetchStickComments={fetchStickComments} wa_id={conversation?.wa_id} setStickComments={setStickComments} stickComments={stickComments}/>
                  {/* {conversation?.pinContact ? 'Unpin chat' : 'Pin chat'} */}
                </MenuItem>
              </Menu>
            </span>
          </div>
          {/* {filteredAlert.length > 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '0px 10px 0px 0px',
              }}
              ref={alertIcon}
            >
              <NotificationsIcon style={{ color: '#03D755' }} />
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}
