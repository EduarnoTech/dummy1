import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "./tutorContacts.css";
import {
  msgUrl,
  alertMsgUrl,
  pinChatUrl,
  markChatUrl,
} from "../../serviceUrls/Message-Services";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { io } from "socket.io-client";
import moment from "moment";
import PushPinIcon from "@mui/icons-material/PushPin";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Reason from "../dialogs/Reason";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { NAME_SPACE } from "../../utils/variables";
// import { set } from "mongoose";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// import useSound from 'use-sound';

// import notification from '../../assets/notification.mp3';

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
    maxHeight: "300px",
  },
}));

const TutorContact = ({
  apiUrl,
  conversation,
  setTutorTagUpdated,
  setTutorRatingUpdated,
  updated,
  setUpdated,
}) => {
  const [msg, setMsg] = useState([]);
  // const [alertText, setAlertText] = useState([]);
  const [alertMessage, setAlertMessage] = useState([]);
  // const [hide, setHide] = useState(false);
  const [msgCount, setMsgCount] = useState();
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);
  const [tagValue, setTagValue] = useState();
  const [ratingVal, setRatingVal] = useState();
  const [visibleCircularbar, setVisibleCircularbar] = useState(false);
  const [checked, setChecked] = useState();
  const [writerStatus, setWriterStatus] = useState(conversation?.writer);
  const [reason, setReason] = useState(false);
  const [reasonVal, setReasonVal] = useState("");
  const [reasonDialog, setReasonDialog] = useState(false);
  const [editEmailVal,setEditEmailVal]=useState(false);
  const [editPhoneVal,setEditPhoneVal]=useState(false);
  const [emailVal,setEmailVal]=useState();
  const [phoneVal,setPhoneVal]=useState();


  const snackBarPos = {
    vertical: "top",
    horizontal: "center",
  };
  const { vertical, horizontal } = snackBarPos;

  const [alertText, setAlertText] = useState("");

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setReasonDialog(true);
  };

  const handleChangeStatus = async (tutorId, status_) => {
    // setChecked(event.target.checked);
    try {
      // const payload = {
      //   status: status_,
      // };
      // await axios.put(
      //   `https://annular-arena-331607.el.r.appspot.com/api/tutor/setTutorStatus/${tutorId}`,
      //   payload
      // );

      // sending template for tutor active or inactive
      if (conversation?.wa_id) {
        console.log({ reasonVal: reasonVal });
        const payloadActiveInactiveTutor = {
          name: conversation?.name,
          from: "",
          wa_id: conversation?.wa_id,
          templateName: "tutor_inactive_active_template",
          templateText: `Hi ${conversation.name}, Your account is ${
            status_ === "active" ? "unblocked" : "blocked"
          } ${
            reasonVal !== undefined && reasonVal?.target?.value?.length !== 0
              ? `Reason: ${reasonVal?.target?.value}`
              : " "
          }`,
          template: {
            namespace: NAME_SPACE,
            language: "en",
          },
          param1: status_ === "active" ? "ACTIVATED" : "BLOCKED",
          param2: conversation.name,
          param3: status_ === "active" ? "activated" : "blocked",
          param4:
            reasonVal !== undefined && reasonVal?.target?.value?.length !== 0
              ? `Reason: ${reasonVal?.target?.value} `
              : " ",
          button: "",
          timestamp: "",
          operatorName: "",
          isOwner: true,
          status: "",
          ticketId: "",
          eventType: "template",
        };

        await axios
          .post(
            `${localStorage.getItem(
              "api"
            )}/api/messages/tutorActiveInactiveTemplate`,
            payloadActiveInactiveTutor,
            {
              headers: "",
            }
          )
          .then(
            async (res) => {
              const payload = {
                status: status_,
              };
              await axios.put(
                `${localStorage.getItem('api')}/api/tutor/setTutorStatus/${tutorId}`,
                payload
              );
              console.log(res);
            },
            (error) => {
              console.log(error);
            }
          );
      } else {
        console.log("WhatsApp number is not valid");
        alert("Invalid WhatsApp Number!");
      }

      setChecked(status_);
      setUpdated(!updated);
      setVisibleCircularbar(false);
      setReason(false);
      setReasonDialog(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(async () => {
    // let val= templateMessage.filter(el=>el.name==="tutor_inactive_active_template")
    if (reason) {
      setVisibleCircularbar(true);
      let payload = {
        wa_id: `+${conversation?.wa_id}`,
      };

      const res = await axios.post(
        `${localStorage.getItem("api")}/api/conversations/contactValidation`,
        payload
      );
      if (res.data.contacts[0].status === "invalid") {
        setReasonDialog(false);
        setReason(false);
        setVisibleCircularbar(false);
        setOpenSnackBar(true);
        setAlertText(res.data.contacts[0].status + " contact");
      } else {
        console.log({ valtest: "done" });
        if (conversation?.tutor_status === "inactive") {
          handleChangeStatus(conversation?.tutor_id, "active");
        } else {
          handleChangeStatus(conversation?.tutor_id, "inactive");
        }
      }
    }
  }, [reason]);

  const handleChangeWriterStatus = async (tutorId, status_) => {
    // setChecked(event.target.checked);
    try {
      const payload = {
        status: status_,
      };
      await axios.put(
        `${localStorage.getItem('api')}/api/tutor/setTutorWriterStatus/${tutorId}`,
        payload
      );
      setWriterStatus(status_);
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const [openTag, setOpenTag] = useState(false);

  const handleClickOpen = () => {
    setOpenTag(true);
  };

  const _handleClose = () => {
    setOpenTag(false);
  };

  const _handleAddTag = async () => {
    const payload = {
      tag: tagValue,
    };
    try {
      const res = await axios.put(
        `${localStorage.getItem('api')}/api/tutor/addTag/${conversation?.tutor_id}`,
        payload
      );
      setOpenTag(false);
      setTutorTagUpdated(tagValue);
    } catch (err) {
      console.log(err.Error);
    }
  };

  const rateHandler = async (e) => {
    if (ratingVal) {
      const payload = {
        rating: ratingVal,
      };
      try {
        const res = await axios.put(
          `${localStorage.getItem('api')}/api/tutor/setTutorRating/${conversation?.tutor_id}`,
          payload
        );
        setRatingVal("");
        setTutorRatingUpdated(ratingVal);
      } catch (err) {
        console.log(err.Error);
      }
    }
  };

  // const socket = useRef();
  // const alertIcon = useRef();
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // const headerKey = {
  //   Accept: 'application/json',
  //   Authorization:
  //     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTYyMWZkZi0wYjJjLTQxYzAtOWZmMS1iZDk5NWZmYTQ2ZTUiLCJ1bmlxdWVfbmFtZSI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwibmFtZWlkIjoib2ZmaWNlQHR1dG9ycG9pbnQuaW4iLCJlbWFpbCI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwiYXV0aF90aW1lIjoiMDgvMDQvMjAyMSAwODoxMTowMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.lSSh1EL29ksj23Y_rTSrLhYVwhOFyddK1c6bKU-_HB4',
  // };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = () => {
    setShowMenu(!showMenu);
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

  const shortText = (text) => {
    if (text.length > 6) {
      return `${text.slice(0, 6)}..`;
    } else if (text.length <= 6) {
      return text;
    }
  };

  // const handleEmailChange=async(e,tutorId)=>{
  //   e.preventDefault()

  //   try {
  //     const response = await axios.put(
  //       // `${localStorage.getItem("api")}/api/sessions/assignedTutorUpdateAmount`,
  //       `http://localhost:8800/api/tutor/updateTutorEmail/${tutorId}`,{email:emailVal}
  //     );
  //     if(response?.data?.success==true){
  //     setEditEmailVal(false);
  //     setUpdated(!updated);
  //     }else{
  //       console.log("Email didn't updated!")
  //     }
  //   } catch (err) {
  //     console.log({err});
      
  //   }

  // }

  // const handlePhoneChange=async(e,tutorId)=>{
  //   e.preventDefault()

  //   try {
  //     const response = await axios.put(
  //       // `${localStorage.getItem("api")}/api/sessions/assignedTutorUpdateAmount`,
  //       `http://localhost:8800/api/tutor/updateTutorWaId/${tutorId}`,{wa_id:phoneVal}
  //     );
  //    if(response?.data?.success==true){
  //     setEditPhoneVal(false);
  //     setUpdated(!updated);
  //    }else{
  //      console.log("WhatsApp number didn't updated!")
  //    }
  //   } catch (err) {
  //     console.log({err});
  //   }

  // }

  // const handleEditEmail=(e,curEmailVal)=>{
  //     e.preventDefault()
  //     setEditEmailVal(!editEmailVal)
  //     setEmailVal(curEmailVal)

  // }

  // const handleEditPhone=(e,curPhoneVal)=>{
  //   e.preventDefault()
  //   setEditPhoneVal(!editPhoneVal)
  //   setPhoneVal(curPhoneVal)
  // }

  return (
    <>
      <div
        className={showMenu ? "tutorlist highlighted" : "tutorlist"}
        // onClick={() => {
        //   updateAlert(conversation?.wa_id);
        // }}
      >
        <div className="userTab">
          <Avatar className="conversationImg">
            {conversation?.name?.slice(0, 2)}
          </Avatar>
          <div style={{ paddingBottom: "5px" }}>
            <div className="conversationName">
              {`${conversation?.name}`}{" "}
              {conversation?.writer && (
                <span>
                  <BorderColorIcon
                    fontSize="small"
                    style={{ fontSize: "14px" }}
                  />
                </span>
              )}
              <span
                style={{ fontSize: "12px", color: "green", marginLeft: "5px" }}
              >
                {conversation?.highlights &&
                  conversation?.highlights.map((i) => (
                    <span>
                      {i?.path?.slice(0, 1)}
                      {": "}
                      {i?.texts?.map((j) => (
                        <span>{j.value}&nbsp;</span>
                      ))}
                    </span>
                  ))}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "12px",
              }}
            >
              {conversation?.tutor_id}{" "}
              <span
                style={{
                  color: "green",
                  fontWeight: "800",
                  marginLeft: "5px",
                  fontSize: "13px",
                  cursor: 'pointer',
                }}
              >
                 <HtmlTooltip
                    placement="top"
                    title={
                      <>
                        <span style={{ marginBottom: "10px" }}>
                          Sessions Done:
                        </span>
                        {conversation?.sessions_done?.map((el) => (
                            <Typography
                              color="inherit"
                              style={{
                                fontSize: "13.5px",
                                fontWeight: "600",
                                marginTop: "5px",
                              }}
                            >
                              &#8226;{" "}
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "normal",
                                }}
                              >
                                {el}
                              </span>
                            </Typography>
                          ))}
                      </>
                    }
                  >
                    <span>{conversation?.sessions_done &&
                    '[' +
                      conversation?.sessions_done?.filter((c, index, arr) => {
                        return arr.indexOf(c) === index;
                      }).length +
                      ']'}
                    </span>
                  </HtmlTooltip>
              </span>
              <Box
                sx={{
                  width: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Rating
                  name="read-only"
                  size="small"
                  value={conversation?.rating / 2}
                  precision={0.1}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                  readOnly
                />
                &nbsp;
                <span style={{ fontSize: "13px", fontWeight: "700" }}>
                  {("" + conversation?.rating / 2)?.slice(0, 4)}
                </span>
                <span>
                  <HtmlTooltip
                    placement="top"
                    title={
                      <>
                        <span style={{ marginBottom: "10px" }}>
                          Last 5 reviews
                        </span>
                        {conversation?.rating_and_reviews
                          ?.slice(
                            Math.max(
                              conversation?.rating_and_reviews?.length - 5,
                              0
                            )
                          )
                          ?.map((el) => (
                            <Typography
                              color="inherit"
                              style={{
                                fontSize: "13.5px",
                                fontWeight: "600",
                                marginTop: "5px",
                              }}
                            >
                              -{" "}
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "normal",
                                }}
                              >
                                {el.reviews}
                              </span>
                            </Typography>
                          ))}
                      </>
                    }
                  >
                    <InfoIcon
                      fontSize="small"
                      style={{ fontSize: "16px", cursor: "pointer" }}
                    />
                  </HtmlTooltip>
                </span>
              </Box>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: "10%",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-end",
                cursor: "pointer",
              }}
            >
              <span style={{ paddingRight: "5px" }}>
                {showMenu ? (
                  <KeyboardArrowUpIcon
                    fontSize="medium"
                    color="action"
                    onClick={handleClick}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    fontSize="medium"
                    color="action"
                    onClick={handleClick}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="conversationDetails">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "7px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              Highest Degree: <span>{conversation?.highest_degree}</span>
            </span>
            {(conversation?.tutor_status === "active" ) ? (
              <span
                style={{ marginTop: "-8px", cursor: "pointer" }}
                onClick={handleToggle}
              >
                {console.log({valTestConv:conversation?.tutor_status, checked})}
                {/* <Switch
                Active
                checked={checked}
                onChange={handleChangeStatus}
                inputProps={{ 'aria-label': 'controlled' }}
                size='small'
              /> */}
                <ToggleOnIcon fontSize="large" />
              </span>
            ) : (conversation?.tutor_status == "inactive") ? (
              <span
                style={{ marginTop: "-8px", cursor: "pointer" }}
                onClick={handleToggle}
              >
                <ToggleOffIcon fontSize="large" color="disabled" />
              </span>
            ) : null}
            <Snackbar
              open={openSnackBar}
              autoHideDuration={2000}
              onClose={handleCloseSnackBar}
              anchorOrigin={{ vertical, horizontal }}
              key={vertical + horizontal}
            >
              <Alert
                onClose={handleCloseSnackBar}
                severity="info"
                sx={{ width: "100%" }}
              >
                {alertText}
              </Alert>
            </Snackbar>
          </div>
          {reasonDialog && (
            <Reason
              setReason={setReason}
              setReasonVal={setReasonVal}
              setReasonDialog={setReasonDialog}
              reasonDialog={reasonDialog}
              visibleCircularbar={visibleCircularbar}
            />
          )}
          <div style={{ margin: "15px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              College:{" "}
              <span>
                {conversation?.academic_info &&
                  conversation?.academic_info[0]?.college}
              </span>
            </span>
          </div>
          <div style={{ margin: "23px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              WhatsApp: <span>{conversation?.wa_id}</span>
              {/* { !editPhoneVal ? 
              (<span>{conversation?.wa_id}</span>)
              :   (<span>
                    <input
                      type="number"
                      style={{
                        backgroundColor: "aliceblue",
                        width: "30%",
                        height: "20px",
                        marginTop: "5px",
                        outline: "none",
                        border: "none",
                        borderBottom: "1px solid gray",
                        borderRadius: "0px",
                      }}
                      value={phoneVal}
                      onChange={(val) => setPhoneVal(val.target.value)}
                      autoFocus
                    />{" "}
                    &nbsp;
                    <button
                      style={{
                        backgroundColor: "#1876D1",
                        color: "#ffff",
                        border: "none",
                        borderRadius: "2px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={(e)=>handlePhoneChange(e,conversation?.tutor_id)}
                    >
                      Update
                    </button>
                </span>)
              }
              <span style={{ marginLeft: "3px" }}>
                <EditIcon
                  fontSize="x-small"
                  style={{ fontSize: "15px" }}
                  onClick={(e) => handleEditPhone(e,conversation?.wa_id)}
                />
              </span> */}
            </span>
          </div>
          <div style={{ margin: "23px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              Email: <span>{conversation?.email}</span>
              {/* { !editEmailVal ? 
              (<span>{conversation?.email}</span>)
              :   (<span>
                    <input
                      type="email"
                      style={{
                        backgroundColor: "aliceblue",
                        width: "50%",
                        height: "20px",
                        marginTop: "5px",
                        outline: "none",
                        border: "none",
                        borderBottom: "1px solid gray",
                        borderRadius: "0px",
                      }}
                      value={emailVal}
                      onChange={(val) => setEmailVal(val.target.value)}
                      autoFocus
                    />{" "}
                    &nbsp;
                    <button
                      style={{
                        backgroundColor: "#1876D1",
                        color: "#ffff",
                        border: "none",
                        borderRadius: "2px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={(e)=>handleEmailChange(e,conversation?.tutor_id)}
                    >
                      Update
                    </button>
                </span>)
              }
              <span style={{ marginLeft: "3px" }}>
                <EditIcon
                  fontSize="x-small"
                  style={{ fontSize: "15px" }}
                  onClick={(e) => handleEditEmail(e,conversation.email)}
                />
              </span> */}
            </span>
          </div>
          <div style={{ margin: "15px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              Subjects known:
            </span>
            {conversation?.subjects &&
              conversation?.subjects.map((i) => (
                <Chip style={{ margin: "6px" }} label={i} />
              ))}
          </div>
          <div style={{ margin: "15px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              Add tag:
            </span>
            {conversation?.tags &&
              conversation?.tags.map((i) => (
                <Chip style={{ margin: "6px" }} label={i} color="primary" />
              ))}

            <Fab
              style={{ height: "36px", width: "36px" }}
              color="primary"
              aria-label="add"
            >
              <AddIcon onClick={handleClickOpen} />
              <Dialog open={openTag} onClose={_handleClose}>
                <DialogContent>
                  <DialogContentText>Add New Tag</DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Tag Name"
                    type="text"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={_handleClose}>Cancel</Button>
                  <Button onClick={_handleAddTag}>Add</Button>
                </DialogActions>
              </Dialog>
            </Fab>
          </div>
          <div style={{ display: "flex", margin: "15px 7px 7px 7px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginRight: "5px",
              }}
            >
              Writer:
            </span>
            {conversation?.writer  ? (
              <span
                style={{ marginTop: "-8px", cursor: "pointer" }}
                onClick={() =>
                  handleChangeWriterStatus(conversation?.tutor_id, false)
                }
              >
                <ToggleOnIcon fontSize="large" color="primary" />
              </span>
            ) : !conversation?.writer  ? (
              <span
                style={{ marginTop: "-8px", cursor: "pointer" }}
                onClick={() =>
                  handleChangeWriterStatus(conversation?.tutor_id, true)
                }
              >
                <ToggleOffIcon fontSize="large" color="disabled" />
              </span>
            ) : null}
          </div>
          {/* <div style={{ margin: '15px 7px 7px 7px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '5px',
              }}
            >
              Rate this tutor:{' '}
              <span>
                <input
                  type='number'
                  style={{ width: '15%', marginLeft: '5px', outline: 'none' }}
                  min='1'
                  max='10'
                  value={ratingVal}
                  // onKeyDown={(evt) => evt.preventDefault()}
                  onChange={(e) => setRatingVal(e.target.value)}
                />{' '}
                &nbsp;
                <button
                  style={{
                    backgroundColor: '#1876D1',
                    color: '#ffff',
                    border: 'none',
                    borderRadius: '2px',
                    height: '21px',
                    cursor: 'pointer',
                  }}
                  onClick={rateHandler}
                >
                  rate
                </button>
              </span>
            </span>
          </div> */}
        </div>
      )}
    </>
  );
};

export default TutorContact;
