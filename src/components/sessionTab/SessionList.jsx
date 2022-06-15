import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./session.css";
import moment from "moment";
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
import base64 from "base-64";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { sendtemplateMsgUrl } from "../../serviceUrls/Message-Services";

import DialogTitle from "@mui/material/DialogTitle";

import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import Checkbox from "@mui/material/Checkbox";

import FormControlLabel from "@mui/material/FormControlLabel";
import NotifiedTutors from "./NotifiedTutors";
import PendingIcon from "@mui/icons-material/Pending";
import NativeSelect from "@mui/material/NativeSelect";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import NumberFormat from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinearProgress from "@mui/material/LinearProgress";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import WhatsappOutlinedIcon from "@mui/icons-material/WhatsappOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { NAME_SPACE, WAID } from "../../utils/variables";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  },
}));

const SessionList = ({
  conversation,
  tutorList,
  setTutorList,
  searchTutor,
  tutorCount,
  setAssignedTutor,
  interestedTutors,
  clientPayment,
  tutorPayout,
  updated,
  setUpdated,
  reload,
  setReload,
  handleSearchTutors,
}) => {
  const [msg, setMsg] = useState([]);
  const [alertText, setAlertText] = useState([]);
  const [alertMessage, setAlertMessage] = useState([]);
  // const [hide, setHide] = useState(false);
  const [msgCount, setMsgCount] = useState();
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);
  const [tagValue, setTagValue] = useState();
  const [ratingVal, setRatingVal] = useState();

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);

  const [tutorPage, setTutorPage] = useState(1);
  const [tutorListLoading, setTutorListLoading] = useState(false);
  const [sendingText, setSendingText] = useState(false);

  const [color, setColor] = useState(false);
  const [removedNum, setRemovedNum] = useState();
  const [check, setCheck] = useState([]);
  const [checked, setChecked] = useState(false);

  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editTutorAmt, setEditTutorAmt] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");

  const [selectClientAmount, setSelectClientAmount] = useState();
  const [selectCurrency, setSelectCurrency] = useState("USD");
  const [agentComment, setAgentComment] = useState();
  const [tutorDealtAmount, setTutorDealtAmount] = useState();
  const [openRefundWin, setOpenRefundWin] = useState(false);
  const [virtualAccPayments, setVirtualAccPayments] = useState();
  const [clientInfo, setClientInfo] = useState();
  const [checkPaypal, setCheckPaypal] = useState(conversation?.show_paypal_url);
  const [paypalOption, setPaypalOption] = useState(false);
  const [isEditClientAmt, setIsEditClientAmt] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [disableUpdateTutor, setDisableUpdateTutor] = useState(false);
  const [showSendTemplate, setShowSendTemplate] = useState(true);
  const [sessionPayment, setSessionPayment] = useState(
    conversation?.payment_status == "paid" ? true : false
  );
  const [refundAmount, setRefundAmount] = useState();
  const [tutorDeadline, setTutorDeadline] = useState(
    conversation?.tutor_deadline ? conversation?.tutor_deadline : ""
  );
  const [tutorDuration, setTutorDuration] = useState(
    conversation?.tutor_duration ? conversation?.tutor_duration : ""
  );

  const [lastIndex, setLastIndex] = useState(1);
  const [paymentStatusCheck,setPaymentStatusCheck] = useState("");
  let deviceNo = localStorage.getItem("device");

  const linkBaseURL = `https://client-response.tutorpoint.in/d${deviceNo}/live-session-form`;

  // razorpay header
  const payHeaders = {
    username: "rzp_live_Jk4vwq7tyL9Aeg",
    password: "qUjOJWotN6x47WSDExJ4NURs",
  };

  // paypal header
  const paypalHeaders = {
    username:
      "AfPpkQlf6R1TvJWkD-5_vq7DC0wnAk-xIVbDVAZb_Kw5y3mDvr1ujmggArTagrn8WALUZU4Y4esITtYS",
    password:
      "EMFMuTLku9sIqiY26uLHfhcYKsAoV77xaqanpDAZNsIiBJ0p6RrFk-1TdBaxknoGxbkDucu6UQZBhBro",
  };

  // const socket = useRef();
  // const alertIcon = useRef();
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // const headerKey = {
  //   Accept: 'application/json',
  //   Authorization:
  //     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTYyMWZkZi0wYjJjLTQxYzAtOWZmMS1iZDk5NWZmYTQ2ZTUiLCJ1bmlxdWVfbmFtZSI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwibmFtZWlkIjoib2ZmaWNlQHR1dG9ycG9pbnQuaW4iLCJlbWFpbCI6Im9mZmljZUB0dXRvcnBvaW50LmluIiwiYXV0aF90aW1lIjoiMDgvMDQvMjAyMSAwODoxMTowMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.lSSh1EL29ksj23Y_rTSrLhYVwhOFyddK1c6bKU-_HB4',
  // };

  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const open = Boolean(anchorEl);
  //   const handleClick = () => {
  //     setShowMenu(!showMenu);
  //   };
  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };
  //   console.log(msg);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
    setTutorDeadline(conversation?.tutor_deadline);
    setTutorDuration(conversation?.tutor_duration);
  };

  const handleClose = () => {
    setOpen(false);
    setCheck([]);
    setChecked(false);
  };

  const handleOpenRefundWindow = () => {
    setOpenRefundWin(true);
  };

  const handleCloseRefundWindow = () => {
    setOpenRefundWin(false);
  };

  const handlePlinkupdate = async () => {
    try{
    const resPlink = await axios.get(
      `${localStorage.getItem('api')}/api/payments/getPaymentLink/${conversation.plink_id}`,
      {
        headers: {
          ...payHeaders,
        },
      }
    );
    if(resPlink){
      setPaymentStatusCheck("")
    }else{
      setPaymentStatusCheck("Error getting plink");
    }
    

    const resValink = await axios.get(
      `${localStorage.getItem('api')}/api/payments/virtual_accounts/${conversation.va_id}/payments`,
      {
        headers: {
          ...payHeaders,
        },
      }
    );

      if(resValink){
        setPaymentStatusCheck("")
      }else{
        setPaymentStatusCheck("Error in getting Va");
      }

    let paymLinkAr = [];
    resPlink?.data?.payments?.map(async (el) => {
      paymLinkAr.push({payment_id: el?.payment_id, type:"plink"});
    });
    
    resValink?.data?.items?.map(async (el) => {
      paymLinkAr.push({payment_id: el?.id, type:"vpa"});
    });
    

    const savePaymentInfo = await axios.post(
      `${localStorage.getItem("api")}/api/sessions/refreshPaymentInfo`,
      {
        session_id: conversation.session_id,
        plink_id: conversation.plink_id,
        paymentIdAr: paymLinkAr,
        payment_status: resPlink?.data?.status,
      },
      {
        headers: {
          ...payHeaders,
        },
      }
    );
    console.log({ resPlink });
    if(savePaymentInfo){
      setPaymentStatusCheck("success");
      setUpdated(!updated);
      toast.success(`Updated payment informations successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }else{
      setPaymentStatusCheck("Error in updating");
    }
  }catch(err){
    toast.error(`Something went wrong while updating payment informations!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  };
console.log({paymentStatusCheck})
  // const handleVaUpdate = async () => {
  //   const resVa = await axios.get(
  //     `https://annular-arena-331607.el.r.appspot.com/api/payments/virtual_accounts/${conversation.va_id}`,
  //     {
  //       headers: {
  //         ...payHeaders,
  //       },
  //     }
  //   );
  //  console.log({resVa:resVa.data})
  //   // let paymLinkAr = [];
  //   // resPlink?.data?.payments?.map(async (el) => {
  //   //   paymLinkAr.push(el?.payment_id);
  //   // });

  //   // const savePaymentInfo = await axios.post(
  //   //   "http://localhost:8800/api/sessions/refreshPaymentInfo",
  //   //   {
  //   //     session_id: conversation.session_id,
  //   //     plink_id: conversation.plink_id,
  //   //     paymentIdAr: paymLinkAr,
  //   //     payment_status: resPlink?.data?.status,
  //   //   },
  //   //   {
  //   //     headers: {
  //   //       ...payHeaders,
  //   //     },
  //   //   }
  //   // );
  //   // console.log({ resPlink });
  // };

  // const handleVaUpdate =()=>{
  //   createVirtualAcc()

  // }

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  //fetch virtual account's all payment details
  useEffect(() => {
    // const getVirtualAccount = async () => {
    //   const res = await axios.get(
    //     `https://annular-arena-331607.el.r.appspot.com/api/payments/virtual_accounts/${conversation?.va_id}/payments`,
    //     {
    //       headers: { ...payHeaders },
    //     }
    //   );
    //   setVirtualAccPayments(res?.data?.items);
    // };
    const getClient = async () => {
      const res = await axios.get(
        `${localStorage.getItem("api")}/api/sessions/getclientinfo/${
          conversation?.client_id
        }`
      );
      setClientInfo(res?.data);
    };

    //saving tutorpayment status
    const updateTutorPaymentStatus = async (status) => {
      const payload = {
        tutor_payment_status: status,
      };
      try {
        const res = await axios.put(
          `${localStorage.getItem(
            "api"
          )}/api/sessions/updateTutorPaymentStatus/${conversation?.session_id}`,
          payload
        );
        console.log(res);
        // setUpdated(!updated);
      } catch (err) {
        console.log(err);
      }
    };
    // if(conversation?.va_id) {
    //   getVirtualAccount();
    // }
    getClient();
    if (
      conversation?.tutor_payment_status != "paid" &&
      conversation?.assigned_tutors &&
      conversation?.assigned_tutors?.filter(
        (e) => e?.tutor_unassigned == "assigned"
      )?.length > 0 &&
      conversation?.assigned_tutors?.filter(
        (e) => e?.tutor_unassigned == "assigned"
      )?.length ==
        conversation?.assigned_tutors
          ?.filter((e) => e?.tutor_unassigned == "assigned")
          ?.filter(
            (f) =>
              f?.pout_info?.filter((f) => f.status == "processed").length > 0
          ).length
    ) {
      updateTutorPaymentStatus("paid");
    }
  }, []);

  // payment methods generation for client
  // razorpay link
  const getnewPaymentLink = async () => {
    try {
      const payload = {
        reference_id: "ssn_ref" + Math.floor(new Date().getTime() / 1000.0),
        session_id: conversation?.session_id,
        amount: selectClientAmount * 100,
        currency: selectCurrency,
        show_default_blocks: paypalOption,
      };
      const res = await axios.post(
        `${localStorage.getItem('api')}/api/sessions/new-payment-link`,
        payload,
        {
          headers: {
            ...payHeaders,
          },
        }
      );
      const paymentPayload = {
        name: "",
        from: "",
        wa_id: conversation?.client_waId,
        templateName: `clientprice_setting_${WAID}`,
        templateText:
          "Hi *{{1}}*, This is Tutorpoint\n\nWe have set the price for the session with Session ID - {{2}}\nThe price is {{3}} {{4}}.\nPlease click on the button below to get back to the details and pay the required amount",
        template: {
          namespace: NAME_SPACE,
          language: "en",
        },
        param1: "Price Quoted for Session " + conversation?.session_id,
        param2: conversation?.client_name,
        param3: conversation?.session_id,
        param4: selectClientAmount,
        param5: selectCurrency,
        param6: `d${deviceNo}/live-session-form/${conversation?.session_id}/${conversation?.client_id}`,
        button: "",
        timestamp: "",
        operatorName: "",
        isOwner: true,
        status: "",
        ticketId: "",
        eventType: "template",
      };
      const sendNewPaymentMsg = await axios.post(
        `${localStorage.getItem("api")}/api/messages/new-payment-notification`,
        paymentPayload,
        {
          headers: "",
        }
      );
      // setPaymentLink(res?.data?.result);
    } catch (err) {
      console.log(err);
    }
  };
  // vpa details
  const createVirtualAcc = async () => {
    try {
      const payload = {
        session_id: conversation?.session_id,
        receivers: {
          types: ["bank_account", "vpa"],
        },
        description: "Virtual Account created for tutorpoint",
        close_by: 1681615838,
        notes: {
          project_name: "Banking Software",
        },
      };
      const res = await axios.post(
        `${localStorage.getItem('api')}/api/payments/virtual_accounts`,
        payload,
        {
          headers: {
            ...payHeaders,
          },
        }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  // paypal link
  // const createPaypalLink = async () => {
  //   try {
  //     const payload = {
  //       session_id: conversation?.session_id,
  //       invoice_number: `#${conversation?.session_id}`,
  //       reference: `ED${conversation?.client_id}`,
  //       invoice_date: new Date().toISOString().slice(0, 10),
  //       // payment_due_date: new Date(moment(new Date()).add(10, 'days').calendar()).toISOString().slice(0, 10),
  //       client_name: clientInfo?.client_name,
  //       client_email: clientInfo?.email,
  //       item_name: `${conversation?.subject.toUpperCase()} ${conversation?.type}`,
  //       amount: (conversation?.client_amount/100).toString(),
  //       currency: conversation?.currency
  //     };
  //     const res = await axios.post(`${localStorage.getItem('api')}/api/payments/paypal/invoicing`, payload, {
  //       headers: {
  //         ...paypalHeaders,
  //       },
  //     });
  //     console.log(res);
  //     const payload_ = {
  //       session_id: conversation?.session_id,
  //       href: res?.data?.href
  //     };
  //     const paypal_link = await axios.post(`${localStorage.getItem('api')}/api/payments/paypal/send-invoice`, payload_, {
  //       headers: {
  //         ...paypalHeaders,
  //       },
  //     });
  //     console.log(paypal_link);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // paypal link activation/inactivation
  // const handleChangePaypalStatus = async (event) => {
  //   setCheckPaypal(event.target.checked);
  //   if(!conversation?.paypal_url) {
  //     await createPaypalLink();
  //   }
  //   const payload = {
  //     show_paypal_url: !checkPaypal,
  //   };
  //   await axios.put(
  //     `${localStorage.getItem('api')}/api/sessions/active-inactive-paypal_link/${conversation?.session_id}`,
  //     payload
  //   );
  // };

  const clientAmtHandler = async () => {
    if (selectClientAmount) {
      setDisableUpdate(true);
      await getnewPaymentLink();
      await createVirtualAcc();
      setIsEditClientAmt(false);
      setDisableUpdate(false);
      setUpdated(!updated);
    }
  };

  const handleCheckPayPal = (event) => {
    setPaypalOption(event.target.checked);
  };
  const tutorAmtHandler = async () => {
    setDisableUpdateTutor(true);
    const payload = {
      session_id: conversation?.session_id,
      tutor_dealt_amount: tutorDealtAmount * 100,
    };
    try {
      const response = await axios.put(
        `${localStorage.getItem("api")}/api/sessions/update-tutor-amount`,
        payload
      );
      setDisableUpdateTutor(false);
      setEditTutorAmt(false);
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
      setDisableUpdateTutor(false);
    }
  };

  const handleTutorList = async (event, value) => {
    if (searchTutor) {
      setTutorListLoading(true);
      setTutorPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors/${searchTutor}`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: "",
          }
        );
        console.log(res.data);
        setTutorList(res.data.result);
        setTutorListLoading(false);
        setChecked(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      setTutorListLoading(true);
      setTutorPage(value);
      try {
        const res = await axios.get(
          `${localStorage.getItem('api')}/api/tutor/getTutors`,
          {
            params: {
              page: value,
              limit: 20,
            },
          },
          {
            headers: "",
          }
        );
        console.log(res.data);
        setTutorList(res.data.result);
        setTutorListLoading(false);
        setChecked(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCheck = (tutor) => {
    if (check?.find((element) => element.wa_id == tutor.wa_id)) {
      let index = check?.findIndex((element) => {
        if (element.wa_id === tutor.wa_id) {
          return true;
        }
      });
      console.log(index);
      // let index = check.indexOf(val);
      let removedNo = check.splice(index, 1);
      console.log(check);
      setCheck(check);
      console.log(removedNo);
      setRemovedNum(removedNo[0].wa_id);
      setColor(false);
    } else {
      setCheck([...check, tutor]);
      setColor(true);
    }
  };
  console.log(check);

  const shortText = (text) => {
    if (text.length > 16) {
      return `${text.slice(0, 16)}..`;
    } else if (text.length <= 16) {
      return text;
    }
  };

  const notify = (msg) =>
    toast.error(`Failed to send WhatsApp notification to ${msg}`, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  // send template message
  const sendTemplateAlert = async () => {
    setShowSendTemplate(false);
    // setTutorListLoading(true);
    setSendingText(true);
    try {
      const payload1 = {
        sessionId: conversation?.session_id,
        tutor_deadline: tutorDeadline,
        tutor_duration: tutorDuration,
      };
      const res = await axios.put(
        `${localStorage.getItem("api")}/api/sessions/set-tutor-deadline`,
        payload1
      );
      for (let i = 0; i < check.length; i++) {
        const payload = {
          name: check[i].name,
          from: "",
          wa_id: check[i].wa_id,
          templateName:
            conversation.type == "Live Session"
              ? `live_session_tutor_notify_${WAID}`
              : conversation.type == "Assignment" || conversation.type == 'Project'
              ? `assign_session_tutor_notify_${WAID}`
              : "",
          templateText: `Hey ! We have a session for you. \n\nSession ID : ${conversation?.session_id}\nSubject/Topic name is *{{2}}* \nDate and Time is *{{3}}* \nDuration is *{{4}}*  \nWe will pay you *{{5}}* \n\nPlease check the study materials by pressing the button below. Are you confident in this subject? Can you perform very well in this session? If yes, then press on the below button to show your interest. \n\nPlease wait after you show your interest. We will get back to you shortly to get your confirmation for this session. \nDisclaimer:  \n*1.Never take these sessions casually. They impact your ratings.*  \n*2. Showing interest doesn't mean that we have assigned the session to you.*  \n\nTo stop receiving Whatsapp notifications from us, send an official email to us.`,
          template: {
            namespace: NAME_SPACE,
            language: "en",
          },
          param1: "New " + conversation?.type + " Available",
          param2:
            conversation?.type.slice(0, 4).toUpperCase() +
            conversation?.session_id,
          param3: conversation?.subject.toUpperCase(),
          param4: new Date(
            tutorDeadline ? tutorDeadline : conversation?.deadline
          ).toLocaleString(),
          param5:
            (tutorDuration ? tutorDuration : conversation?.duration) +
            " (hh : mm)",
          param6: `${conversation?.tutor_dealt_amount / 100} INR`,
          param7: `d${deviceNo}/tutorForm/${conversation?.session_id}/${check[i].tutor_id}`,
          button: "",
          timestamp: "",
          operatorName: "",
          isOwner: true,
          status: "",
          ticketId: "",
          eventType: "template",
        };
        try {
        await axios
          .post(
            `${localStorage.getItem("api")}/api/messages/tutorTemplate`,
            payload,
            {
              headers: "",
            }
          )
          .then(
            async (res) => {
              console.log(res);
              // email notification
              if (check[i].email) {
                /* whatsapp and email both */
                const payload2 = {
                  name: check[i].name,
                  email: check[i].email,
                  tutorId: check[i].tutor_id,
                  sessionId: conversation?.session_id,
                  wa_id: check[i].wa_id,
                  templateName:
                    conversation.type == "Live Session"
                      ? `live_session_tutor_notify_${WAID}`
                      : conversation.type == "Assignment"  || conversation.type == 'Project'
                      ? `assign_session_tutor_notify_${WAID}`
                      : "",
                  param1: "New " + conversation?.type + " Available",
                  param2:
                    conversation?.type.slice(0, 4).toUpperCase() +
                    conversation?.session_id,
                  param3: conversation?.subject.toUpperCase(),
                  param4: new Date(
                    tutorDeadline ? tutorDeadline : conversation?.deadline
                  ).toLocaleString(),
                  param5:
                    (tutorDuration ? tutorDuration : conversation?.duration) +
                    " (hh : mm)",
                  param6: `${conversation?.tutor_dealt_amount / 100} INR`,
                  param7: `d${deviceNo}/tutorForm/${conversation?.session_id}/${check[i].tutor_id}`,
                };
                await axios.post(
                  `${localStorage.getItem(
                    "api"
                  )}/api/sessions/tutorEmailNotification`,
                  payload2,
                  {
                    headers: "",
                  }
                );

                const paydata = {
                  session_id: conversation.session_id,
                  notified_tutors: { name: check[i]?.name, wa_id: check[i]?.wa_id, tutor_id: check[i]?.tutor_id, timestamp: Math.floor(Date.now() / 1000), medium: 'wa-mail'}
                };
                const res2 = await axios.post(
                  `${localStorage.getItem(
                    "api"
                  )}/api/sessions/updateNotifiedTutors`,
                  paydata,
                  {
                    headers: "",
                  }
                );
                console.log(res2);
              } else {
                /* only whatsapp */
                const paydata = {
                  session_id: conversation.session_id,
                  notified_tutors: { name: check[i]?.name, wa_id: check[i]?.wa_id, tutor_id: check[i]?.tutor_id, timestamp: Math.floor(Date.now() / 1000), medium: 'wa'}
                };
                const res2 = await axios.post(
                  `${localStorage.getItem(
                    "api"
                  )}/api/sessions/updateNotifiedTutors`,
                  paydata,
                  {
                    headers: "",
                  }
                );
                console.log(res2);
              }
            },
            async (error) => {
              console.log(error);
              notify(check[i].name);
              /* only email */
              const payload2 = {
                name: check[i].name,
                email: check[i].email,
                tutorId: check[i].tutor_id,
                sessionId: conversation?.session_id,
                wa_id: check[i].wa_id,
                templateName:
                  conversation.type == "Live Session"
                    ? `live_session_tutor_notify_${WAID}`
                    : conversation.type == "Assignment"  || conversation.type == 'Project'
                    ? `assign_session_tutor_notify_${WAID}`
                    : "",
                param1: "New " + conversation?.type + " Available",
                param2:
                  conversation?.type.slice(0, 4).toUpperCase() +
                  conversation?.session_id,
                param3: conversation?.subject.toUpperCase(),
                param4: new Date(
                  tutorDeadline ? tutorDeadline : conversation?.deadline
                ).toLocaleString(),
                param5:
                  (tutorDuration ? tutorDuration : conversation?.duration) +
                  " (hh : mm)",
                param6: `${conversation?.tutor_dealt_amount / 100} INR`,
                param7: `d${deviceNo}/tutorForm/${conversation?.session_id}/${check[i].tutor_id}`,
                medium: "mail",
                notified_tutors: { name: check[i]?.name, wa_id: check[i]?.wa_id, tutor_id: check[i]?.tutor_id, timestamp: Math.floor(Date.now() / 1000), medium: 'mail'}
              };
              await axios.post(
                `${localStorage.getItem(
                  "api"
                )}/api/sessions/tutorEmailNotification`,
                payload2,
                {
                  headers: "",
                }
              );

              // setShowSendTemplate(true);
              // setTutorListLoading(false);
            }
          );

        //send push notification to app
        let payloadTutor = {
          tutor_id: check[i].tutor_id,
        }
        if(check[i]?.device_type === 'tp') { 
          await axios.post(`https://device6chatapi.el.r.appspot.com/api/tutor/increaseNotificationCount`, payloadTutor, {
          headers: '',
          });
        }

        // setTimeout(() => {
        //   console.log('This will run after 0.1 second!');
        //   setSent(!sent);
        // }, 100);
        // setShowTemplateMsg(false);

        } catch (err) {
          console.log(err);
          setShowSendTemplate(true);
          // alert('Failed to send template message!');
        }
      }
      const workStatusPayload = {
        status: "Tutors Notified",
      };
      const res3 = await axios.put(
        `${localStorage.getItem("api")}/api/sessions/updateSessionStatus/${
          conversation?.session_id
        }`,
        workStatusPayload,
        {
          headers: "",
        }
      );
      setOpen(false);
      setCheck([]);
      setChecked(false);
      setShowSendTemplate(true);
      setUpdated(!updated);
      // setTutorListLoading(false);
      setSendingText(false);
    } catch (err) {
      console.log(err);
      setShowSendTemplate(true);
      // setTutorListLoading(false);
      setSendingText(false);
      alert("Failed to send notification!");
    }
  };

  const handleSelectAll = () => {
    if (check.length >= 0 && checked === false) {
      let arr = [];
      tutorList?.filter((f) => f?.tutor_status == "active").forEach((e) => {
        // let obj = {
        //   wa_id: e.wa_id,
        //   tutor_id: e.tutor_id,
        //   name: e.name,
        //   rating: e.rating,
        // };
        if (!check.find((f) => f.wa_id == e.wa_id)) {
          arr.push(e);
        }
      });
      setCheck([...check, ...arr]);
      setChecked(true);
    } else if (checked) {
      setCheck([]);
      setChecked(false);
    }
  };

  const handleCloseSessionDetails = () => {
    setShowSessionDetails(false);
    setEdit(false);
    setReload(!reload);
  };
  const handleOpenSessionDetails = () => {
    setReload(!reload);
    setShowSessionDetails(true);
  };

  const handleChangeStatus = async (event) => {
    setTaskStatus(event.target.value);
    console.log(event.target.value);
    if (event.target.value) {
      const payload = {
        status: event.target.value,
      };
      let payload1;
      if (event.target.value === "Completed") {
        payload1 = {
          clientId: conversation?.client_id,
          sessionId: conversation?.session_id,
          sessionStatus: "completed",
        };
      } else {
        payload1 = {
          clientId: conversation?.client_id,
          sessionId: conversation?.session_id,
          sessionStatus: event.target.value,
        };
      }
      try {
        const res = await axios.put(
          `${localStorage.getItem("api")}/api/sessions/updateSessionStatus/${
            conversation.session_id
          }`,
          payload
        );
        const resSolnFolderAccess = await axios.post(
          `${localStorage.getItem("api")}/api/sessions/solutionFolderAccess`,
          payload1
        );
        if (resSolnFolderAccess) {
          console.log({
            resultSolutionAccess: resSolnFolderAccess.data.driveType,
          });
        } else {
          console.log("drive permission doesnot change");
        }
        // cancel tutors after session is completed
        if (
          event.target.value === "Solution Sent" &&
          conversation?.notified_tutors.length > 0
        ) {
          try {
            //   for(let i = 0; i < conversation?.notified_tutors.length; i++) {
            //   const _payload_ = {
            //     status: true,
            //   }
            //   const res = await axios.put(`https://annular-arena-331607.el.r.appspot.com/api/sessions/cancelNotifiedTutor/${conversation?.session_id}/${conversation?.notified_tutors[i].tutor_id}`, _payload_, {
            //     headers: ''
            //   });
            // }
            let payload2 = {
              name: conversation?.client_name,
              from: "",
              wa_id: conversation?.client_waId,
              templateName: "session_done",
              templateText: `Hi ${conversation?.client_name}, The session with Session ID- ${conversation?.session_id} is completed now. You can view the solution by clicking the Solution button below.`,
              template: {
                namespace: NAME_SPACE,
                language: "en",
              },
              param1: conversation?.session_id,
              param2: conversation?.client_name,
              param3: conversation?.session_id,
              param4: conversation?.folderlink.replace(
                "https://drive.google.com/",
                ""
              ),
              button: "",
              timestamp: "",
              operatorName: "",
              isOwner: true,
              status: "",
              ticketId: "",
              eventType: "template",
            };
            await axios.post(
              `${localStorage.getItem(
                "api"
              )}/api/messages/sessionCompleteTemplate`,
              payload2,
              {
                headers: "",
              }
            );
            setUpdated(!updated);
          } catch (err) {
            console.log(err);
          }
        }
        setTaskStatus(event.target.value);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const descriptionElementRef_ = useRef(null);

  useEffect(() => {
    if (showSessionDetails) {
      const { current: descriptionElement } = descriptionElementRef_;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [showSessionDetails]);

  const agentCommentHandler = async (event) => {
    event.preventDefault();
    if (agentComment) {
      const payload = {
        session_id: conversation.session_id,
        agent_comments: {
          agent_comment: agentComment,
          timestamp: new Date().toISOString(),
        },
      };
      try {
        const res = await axios.put(
          `${localStorage.getItem("api")}/api/sessions/saveAgentComment`,
          payload
        );
        console.log(res);
        setAgentComment("");
        setUpdated(!updated);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleInitiateRefund = async (payId) => {
    try {
      const payload = {
        amount: +refundAmount * 100,
      };

      const resp1 = await axios.post(
        `${localStorage.getItem("api")}/api/payments/initiate-refund/${payId}`,
        payload,
        {
          headers: {
            ...payHeaders,
          },
        }
      );

      const payload2 = {
        refundInfo: resp1.data,
      };
      const resp = await axios.post(
        `${localStorage.getItem("api")}/api/payments/refund/${
          conversation?.session_id
        }/${payId}`,
        payload2,
        {
          headers: "",
        }
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(clientPayment);

  // change session payment status manually
  const handleSessionPaymentStatus = async (event) => {
    // console.log(event.target.checked);
    // setSessionPayment(event.target.checked);
    try {
      const payload = {
        sessionId: conversation?.session_id,
        payment_status: event.target.checked ? "paid" : "not_paid",
      };
      const res = await axios.put(
        `${localStorage.getItem(
          "api"
        )}/api/sessions/update-session-payment-status`,
        payload
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const snackBarPos = {
    vertical: "top",
    horizontal: "center",
  };
  const { vertical, horizontal } = snackBarPos;

  const [alertText_, setAlertText_] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  // validate contact
  const handleContactValidate = async (waId) => {
    let payload = {
      wa_id: `+${waId}`,
    };
    try {
      const res = await axios.post(
        `${localStorage.getItem("api")}/api/conversations/contactValidation`,
        payload
      );
      setOpenSnackBar(true);
      setAlertText_(res.data.contacts[0].status + " contact");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTutorDeadline = (e) => {
    if (new Date(e.target.value) < new Date(conversation?.deadline)) {
      setTutorDeadline(e.target.value);
    } else {
      alert("Tutor deadline must be before the session deadline!");
    }
  };

  const today = new Date();
  let after2days = new Date();
  after2days.setDate(today.getDate() + 2);

  // console.log(conversation?.assigned_tutors?.map(i => i?.pout_info?.amount).filter((e) => { return e !== undefined }).reduce((a, b) => a + b, 0))

  return (
    <>
      <div
        className={
          conversation.type == "Live Session"
            ? "sessionlist live"
            : conversation.type == "Assignment"
            ? "sessionlist"
            : conversation.type == "Project"
            ? "sessionlist project"
            : "sessionlist notFilled"
        }
        // onClick={() => {
        //   updateAlert(conversation?.wa_id);
        // }}
      >
        <div style={{ marginBottom: "-4px" }} className="userTab_">
          <div style={{ display: "flex", flexDirection: "row", flex: "38%" }}>
            <div style={{ height: "22px", fontSize: "13px" }}>SI:</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
                fontWeight: "bolder",
              }}
            >
              &nbsp;{conversation?.session_id}
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
                      Subject:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        {conversation?.subject}
                      </span>
                    </Typography>
                    {conversation?.client_comments && (
                      <Typography
                        color="inherit"
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "600",
                          marginBottom: "5px",
                        }}
                      >
                        Work Details:{" "}
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          {conversation?.client_comments}
                        </span>
                      </Typography>
                    )}
                    <Typography
                      color="inherit"
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Created At:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        {new Date(conversation?.createdAt).toLocaleDateString(
                          "en-IN"
                        ) + moment(conversation?.createdAt).format(", h:mm a")}
                      </span>
                    </Typography>
                    <Typography
                      color="inherit"
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Updated At:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        {new Date(conversation?.updatedAt).toLocaleDateString(
                          "en-IN"
                        ) + moment(conversation?.updatedAt).format(", h:mm a")}
                      </span>
                    </Typography>
                    <Typography
                      color="inherit"
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Tutor Deadline:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        {new Date(
                          conversation?.tutor_deadline
                        ).toLocaleDateString("en-IN") +
                          moment(conversation?.tutor_deadline).format(
                            ", h:mm a"
                          )}
                      </span>
                    </Typography>
                    <Typography
                      color="inherit"
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Form Creator:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        {conversation?.opExecutive ? conversation?.opExecutive : 'N/A'}
                      </span>
                    </Typography>
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
                />
              </HtmlTooltip>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flex: "24%" }}>
            <div style={{ height: "22px", fontSize: "13px" }}>CI:</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
                fontWeight: "bolder",
              }}
            >
              &nbsp;{conversation.client_id}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: "38%",
              flexDirection: "row",
              justifyContent: "end",
              fontSize: "14px",
              fontWeight: "800",
              maxWidth: "100px",
              textAlign: "center",
              // marginTop: '15px',
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                cursor: "pointer",
                marginRight: "4px",
              }}
            >
              {interestedTutors &&
                interestedTutors?.find(
                  (i) => i.session_id == conversation.session_id
                ) && <div className="circle red"></div>}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                cursor: "pointer",
              }}
              onClick={handleClickOpen("paper")}
            >
              {/* {interestedTutors && interestedTutors.find(i => i.session_id == conversation.session_id) ? <NotificationsActiveIcon /> : <NotificationsIcon />} */}
              {conversation.notified_tutors &&
              conversation.tutor_interested &&
              conversation.notified_tutors.length > 0 &&
              conversation.tutor_interested.length > 0 ? (
                <CircleNotificationsIcon fontSize="small" />
              ) : conversation.notified_tutors &&
                conversation.notified_tutors.length > 0 ? (
                <NotificationsActiveIcon fontSize="small" />
              ) : (
                <NotificationsIcon fontSize="small" />
              )}
              {conversation?.assigned_tutors &&
              conversation.assigned_tutors.length > 0 &&
              conversation?.assigned_tutors[0].acceptance_status ==
                "accepted" ? (
                <AssignmentTurnedInIcon
                  fontSize="small"
                  color="success"
                  style={{ marginLeft: "1px" }}
                />
              ) : (
                conversation.assigned_tutors &&
                conversation.assigned_tutors.length > 0 && (
                  <AssignmentTurnedInIcon
                    fontSize="small"
                    style={{ marginLeft: "1px" }}
                  />
                )
              )}
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              scroll={scroll}
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              <DialogTitle
                style={{
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 10px 10px 24px",
                }}
                id="scroll-dialog-title"
              >
                TUTOR LIST
                {/* <Checkbox size='medium' color='success' /> */}
                <input
                  type="datetime-local"
                  style={{
                    width: "130px",
                    outline: "none",
                    borderRadius: "3px",
                    border: "1px solid gray",
                    fontFamily: "inherit",
                  }}
                  value={tutorDeadline}
                  onChange={handleTutorDeadline}
                />
                {conversation?.type == "Live Session" && (
                  <NumberFormat
                    style={{
                      width: "60px",
                      outline: "none",
                      borderRadius: "3px",
                      border: "1px solid gray",
                    }}
                    format="## : ##"
                    placeholder="Duration"
                    value={tutorDuration}
                    onChange={(e) => setTutorDuration(e.target.value)}
                    autoComplete="off"
                  />
                )}
                <FormControlLabel
                  label="SELECT ALL"
                  control={
                    <Checkbox
                      size="medium"
                      color="success"
                      checked={checked}
                      // indeterminate={checked[0] !== checked[1]}
                      onChange={handleSelectAll}
                    />
                  }
                />
              </DialogTitle>
              <DialogTitle
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 7px 15px 24px",
                }}
              >
                <input
                  placeholder="Search for tutors"
                  className="chatMenuInput"
                  // onChange={(e) => handleSearchTutors(e)}
                  onKeyPress={handleSearchTutors}
                />
              </DialogTitle>
              <DialogContent
                dividers={scroll === "paper"}
                style={{ padding: "16px 0px" }}
              >
                {tutorListLoading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "255px 210px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                  >
                    <>
                      {tutorList
                        ?.filter((f) => f?.tutor_status == "active")
                        ?.map((tutor, index) => {
                          return (
                            <div
                              className={
                                check?.find(
                                  (element) => element.wa_id == tutor.wa_id
                                )
                                  ? "selected_card"
                                  : removedNum == tutor.wa_id
                                  ? "card"
                                  : conversation?.notified_tutors &&
                                    conversation?.notified_tutors.find(
                                      (el) => el.tutor_id == tutor.tutor_id
                                    )
                                  ? "success_card"
                                  : "card"
                              }
                              onClick={() => handleCheck(tutor)}
                            >
                              <div style={{ display: "flex" }}>
                                {check?.find(
                                  (element) => element.wa_id == tutor.wa_id
                                ) && (
                                  <CheckCircleIcon
                                    fontSize="small"
                                    style={{ color: "rgb(11 145 102)" }}
                                  />
                                )}
                                <label
                                  for={tutor.tutor_id}
                                  style={{
                                    display: "flex",
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                  }}
                                >
                                  {conversation?.notified_tutors &&
                                    conversation?.notified_tutors.find(
                                      (el) => el.tutor_id == tutor.tutor_id
                                    ) && (
                                      <DoneOutlineRoundedIcon
                                        fontSize="small"
                                        color="success"
                                        style={{ marginRight: "5px" }}
                                      />
                                    )}
                                  {conversation?.notified_tutors &&
                                    conversation?.notified_tutors.find(
                                      (el) =>
                                        el.tutor_id == tutor.tutor_id &&
                                        el.medium == "mail"
                                    ) && (
                                      <MarkEmailReadOutlinedIcon
                                        fontSize="small"
                                        color="success"
                                        style={{ marginRight: "5px" }}
                                      />
                                    )}
                                  {conversation?.notified_tutors &&
                                    conversation?.notified_tutors.find(
                                      (el) =>
                                        el.tutor_id == tutor.tutor_id &&
                                        el.medium == "wa"
                                    ) && (
                                      <WhatsappOutlinedIcon
                                        fontSize="small"
                                        color="success"
                                        style={{ marginRight: "5px" }}
                                      />
                                    )}
                                  {conversation?.notified_tutors &&
                                    conversation?.notified_tutors.find(
                                      (el) =>
                                        el.tutor_id == tutor.tutor_id &&
                                        el.medium == "wa-mail"
                                    ) && (
                                      <>
                                        <WhatsappOutlinedIcon
                                          fontSize="small"
                                          color="success"
                                          style={{ marginRight: "5px" }}
                                        />{" "}
                                        <MarkEmailReadOutlinedIcon
                                          fontSize="small"
                                          color="success"
                                          style={{ marginRight: "5px" }}
                                        />
                                      </>
                                    )}
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {shortText(tutor.name)}
                                  </span>{" "}
                                  {tutor.tutor_id}
                                  &nbsp;
                                  <span>
                                    <HtmlTooltip
                                      placement="top"
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
                                            Highest Degree:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.highest_degree}
                                            </span>
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Department:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.dept}
                                            </span>
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            College/s:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.academic_info &&
                                                tutor?.academic_info[0]?.college.toString()}
                                            </span>
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            WhatsApp:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.wa_id}
                                            </span>
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Subjects known:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.subjects &&
                                                tutor?.subjects.toString()}
                                            </span>
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Tags:{" "}
                                            <span
                                              style={{
                                                fontSize: "12px",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              {tutor?.tags &&
                                                tutor?.tags.toString()}
                                            </span>
                                          </Typography>
                                        </>
                                      }
                                    >
                                      <InfoIcon
                                        fontSize="small"
                                        style={{ fontSize: "16px" }}
                                      />
                                    </HtmlTooltip>
                                  </span>
                                  {tutor?.writer && (
                                    <span style={{ marginLeft: "5px" }}>
                                      <BorderColorIcon
                                        fontSize="small"
                                        style={{ fontSize: "14px" }}
                                      />
                                    </span>
                                  )}
                                  <span>
                                    <AutorenewRoundedIcon
                                      fontSize="small"
                                      style={{ fontSize: "18px" }}
                                      onClick={() =>
                                        handleContactValidate(tutor?.wa_id)
                                      }
                                    />
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "green",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {tutor?.highlights &&
                                      tutor?.highlights.map((i) => (
                                        <span>
                                          {i?.path?.slice(0, 1)}
                                          {": "}
                                          {i?.texts?.map((j) => (
                                            <span>{j.value}&nbsp;</span>
                                          ))}
                                        </span>
                                      ))}
                                  </span>
                                </label>
                              </div>
                              <div style={{ display: "flex" }}>
                                {tutor?.sessions_assigned &&
                                  tutor?.sessions_assigned?.filter(
                                    (f) =>
                                      new Date(f.deadline) >= today &&
                                      new Date(f.deadline) <= after2days
                                  ) &&
                                  tutor?.sessions_assigned?.filter(
                                    (f) =>
                                      new Date(f.deadline) >= today &&
                                      new Date(f.deadline) <= after2days
                                  ).length >= 2 && (
                                    <HtmlTooltip
                                      placement="top"
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
                                            WARNING!!!
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            This tutor is already assigned for 2
                                            or more than 2 sessions in next 2
                                            days..
                                          </Typography>
                                          <Typography
                                            color="inherit"
                                            style={{
                                              fontSize: "13.5px",
                                              fontWeight: "600",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            Sessions Assigned:
                                          </Typography>
                                          {tutor?.sessions_assigned
                                            ?.filter(
                                              (f) =>
                                                new Date(f.deadline) > today &&
                                                new Date(f.deadline) <
                                                  after2days
                                            )
                                            .map((i) => (
                                              <Typography
                                                color="inherit"
                                                style={{
                                                  fontSize: "13.5px",
                                                  fontWeight: "600",
                                                  marginBottom: "5px",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                    fontWeight: "normal",
                                                  }}
                                                >
                                                  ID: {i?.session_id}
                                                </span>
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                    fontWeight: "normal",
                                                  }}
                                                >
                                                  &nbsp; | &nbsp;Type: {i?.type}
                                                </span>
                                              </Typography>
                                            ))}
                                        </>
                                      }
                                    >
                                      <PriorityHighOutlinedIcon
                                        fontSize="small"
                                        style={{ fontSize: "21px" }}
                                        color="error"
                                      />
                                    </HtmlTooltip>
                                  )}
                              </div>
                              <Box
                                sx={{
                                  width: 150,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Chip
                                  size="small"
                                  // onClick={handleClick}
                                  // onDelete={handleDelete}
                                  icon={
                                    <StarPurple500SharpIcon
                                      style={{
                                        color: "#ffff",
                                        fontSize: "14px",
                                      }}
                                    />
                                  }
                                  label={("" + tutor?.rating / 2)?.slice(0, 4)}
                                  color="success"
                                />
                                {/* <span style={{ paddingLeft: '5px' }}>
                              {showMenu ? (
                                <KeyboardArrowUpIcon
                                  fontSize='medium'
                                  color='action'
                                  onClick={handleClick}
                                />
                              ) : (
                                <KeyboardArrowDownIcon
                                  fontSize='medium'
                                  color='action'
                                  onClick={handleClick}
                                />
                              )}
                            </span> */}
                              </Box>
                              {/* {showMenu && (
        <div className='conversationDetails'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '7px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '5px',
              }}
            >
              Highest Degree: <span>{tutor?.highest_degree}</span>
            </span>
          </div>
          <div style={{ margin: '15px 7px 7px 7px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '5px',
              }}
            >
              College:{' '}
              <span>
                {tutor?.academic_info &&
                  tutor?.academic_info[0]?.college}
              </span>
            </span>
          </div>
          <div style={{ margin: '23px 7px 7px 7px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '5px',
              }}
            >
              Email: <span>{tutor?.email}</span>
            </span>
          </div>
          <div style={{ margin: '15px 7px 7px 7px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '5px',
              }}
            >
              Subjects known:
            </span>
            {tutor?.subjects &&
              tutor?.subjects.map((i) => (
                <Chip style={{ margin: '6px' }} label={i} />
              ))}
          </div>
   
        </div>
      )} */}
                            </div>
                          );
                        })}
                      <Pagination
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "20px 45px 20px 30px",
                        }}
                        count={Math.ceil(tutorCount / 20)}
                        page={tutorPage}
                        onChange={handleTutorList}
                      />
                    </>
                  </DialogContentText>
                )}
              </DialogContent>
              {sendingText && <LinearProgress />}
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {(conversation?.type == 'Live Session' && showSendTemplate && check.length > 0 && tutorDeadline && tutorDuration) || (conversation?.type == 'Assignment' || conversation?.type == 'Project' && showSendTemplate && check.length > 0 && tutorDeadline) ? <Button onClick={sendTemplateAlert}>Send</Button>
                : <Button disabled>Send</Button>}
              </DialogActions>
            </Dialog>
            <div>
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
                  {alertText_}
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "-4px" }} className="userTab_">
          <div style={{ display: "flex", flexDirection: "row", flex: "38%" }}>
            <div style={{ height: "22px", fontSize: "13px" }}>CA:&nbsp;</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
              }}
            >
              {conversation.client_amount
                ? conversation.client_amount / 100 + " " + conversation.currency
                : "---"}
              {(clientPayment &&
                clientPayment?.find(
                  (f) =>
                    f.payload.payment_link &&
                    f.payload.payment_link.entity.id == conversation.plink_id &&
                    f.payload.payment_link.entity.status == "paid"
                )) ||
              conversation.payment_status == "paid" ? (
                <span>
                  <HtmlTooltip
                    placement="top"
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
                          Amount Paid:{" "}
                        </Typography>
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            {conversation?.payment_info?.length > 0
                              ? conversation?.payment_info
                                  ?.filter((f) => f.type == "plink")
                                  ?.map((i) => i.amount)
                                  .reduce((pv, cv) => {
                                    return pv + cv;
                                  }, 0) /
                                  100 +
                                " " +
                                conversation?.currency +
                                " (via payment link)"
                              : "---"}
                          </span>
                        </Typography>
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            {conversation?.payment_info?.filter(
                              (i) => i.type == "vpa" && i.status == "captured"
                            ) &&
                              conversation?.payment_info?.filter(
                                (i) => i.type == "vpa" && i.status == "captured"
                              ).length > 0 &&
                              conversation?.payment_info
                                ?.filter(
                                  (i) =>
                                    i.type == "vpa" && i.status == "captured"
                                )
                                ?.map((k) => k?.amount)
                                .reduce((x, z) => {
                                  return x + z;
                                }, 0) /
                                100 +
                                " INR (to vpa)"}
                          </span>
                        </Typography>
                      </>
                    }
                  >
                    <CheckCircleIcon
                      fontSize="x-small"
                      style={{
                        marginLeft: "3px",
                        marginTop: "1px",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    />
                  </HtmlTooltip>
                </span>
              ) : (clientPayment &&
                  clientPayment?.find(
                    (f) =>
                      f.payload.payment_link &&
                      f.payload.payment_link.entity.id ==
                        conversation.plink_id &&
                      f.payload.payment_link.entity.status == "partially_paid"
                  )) ||
                conversation.payment_status == "partially_paid" ? (
                <span>
                  <HtmlTooltip
                    placement="top"
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
                          Amount Paid:{" "}
                        </Typography>
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            {conversation?.payment_info?.length > 0
                              ? conversation?.payment_info
                                  ?.filter((f) => f.type == "plink")
                                  ?.map((i) => i.amount)
                                  .reduce((pv, cv) => {
                                    return pv + cv;
                                  }, 0) /
                                  100 +
                                " " +
                                conversation?.currency +
                                " (via payment link)"
                              : "---"}
                          </span>
                        </Typography>
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            {conversation?.payment_info?.filter(
                              (i) => i.type == "vpa" && i.status == "captured"
                            ) &&
                              conversation?.payment_info?.filter(
                                (i) => i.type == "vpa" && i.status == "captured"
                              ).length > 0 &&
                              conversation?.payment_info
                                ?.filter(
                                  (i) =>
                                    i.type == "vpa" && i.status == "captured"
                                )
                                ?.map((k) => k?.amount)
                                .reduce((x, z) => {
                                  return x + z;
                                }, 0) /
                                100 +
                                " INR (to vpa)"}
                          </span>
                        </Typography>
                      </>
                    }
                  >
                    <PendingIcon
                      fontSize="x-small"
                      style={{
                        marginLeft: "3px",
                        marginTop: "1px",
                        cursor: "pointer",
                        fontSize: "15px",
                      }}
                    />
                  </HtmlTooltip>
                </span>
              ) : null}
              {conversation?.refund_status == "refunded" && (
                <span>
                  <HtmlTooltip
                    placement="top"
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
                          Amount Refunded:{" "}
                        </Typography>
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            {conversation?.payment_info?.map(
                              (payment) =>
                                payment?.refund_info &&
                                payment?.refund_info
                                  ?.filter((f) => f.status == "processed")
                                  .map((i) => (
                                    <div style={{ display: "flex" }}>
                                      {i?.amount / 100} {i?.currency}
                                      {" [ID: "}
                                      {i?.id}
                                      {"]"}
                                    </div>
                                  ))
                            )}
                          </span>
                        </Typography>
                      </>
                    }
                  >
                    <SettingsBackupRestoreIcon
                      fontSize="small"
                      color="error"
                      style={{
                        marginLeft: "3px",
                        cursor: "pointer",
                        fontSize: "17px",
                      }}
                    />
                  </HtmlTooltip>
                </span>
              )}
            </div>
            <div style={{ fontSize: "13px", marginLeft: "3px" }}></div>
            {/* <div style={{fontSize: '13px', marginLeft:'3px'}}>{virtualAccPayments && virtualAccPayments?.length > 0 && virtualAccPayments?.map((i) => i?.amount).reduce((a, b) => { return (a + b)}, 0)/100 + ' ' + virtualAccPayments[0]?.currency + ' (vpa)'}</div> */}
          </div>
          <div style={{ display: "flex", flexDirection: "row", flex: "24%" }}>
            <div style={{ height: "22px", fontSize: "13px" }}>TA:&nbsp;</div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
              }}
            >
              {conversation?.assigned_tutors &&
              conversation?.assigned_tutors?.length > 0
                ? conversation?.assigned_tutors
                    ?.filter((e) => e?.pout_info?.length > 0)
                    ?.map(
                      (i) =>
                        i?.pout_info
                          ?.filter((f) => f.status == "processed")
                          .map((k) => k?.amount)
                          .reduce((x, z) => {
                            return x + z;
                          }, 0) / 100
                    )
                    .reduce((x, z) => {
                      return x + z;
                    }, 0) + " INR"
                : "---"}
              {conversation?.assigned_tutors &&
                conversation?.assigned_tutors?.filter(
                  (e) => e?.tutor_unassigned == "assigned"
                )?.length > 0 &&
                conversation?.assigned_tutors?.filter(
                  (e) => e?.tutor_unassigned == "assigned"
                )?.length ==
                  conversation?.assigned_tutors
                    ?.filter((e) => e?.tutor_unassigned == "assigned")
                    ?.filter(
                      (f) =>
                        f?.pout_info?.filter((f) => f.status == "processed")
                          .length > 0
                    ).length && (
                  <span>
                    <CheckCircleIcon
                      fontSize="x-small"
                      style={{
                        marginLeft: "3px",
                        marginTop: "1px",
                        fontSize: "15px",
                      }}
                    />
                  </span>
                )}

              <span>
                <HtmlTooltip
                  placement="top"
                  title={
                    <>
                      {/* <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Interested Tutors: </Typography>
                      {conversation?.tutor_interested && conversation?.tutor_interested.length > 0 ? conversation?.tutor_interested?.map((i) => <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}><span style={{fontSize: '12px', fontWeight: 'normal'}}>{i.name}&nbsp;{i.tutor_id}</span></Typography>) : <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}><span style={{fontSize: '12px', fontWeight: 'normal'}}>No one has shown interest for this session</span></Typography>} */}
                      <Typography
                        color="inherit"
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "600",
                          marginBottom: "5px",
                        }}
                      >
                        Assigned Tutors:{" "}
                      </Typography>
                      {conversation?.assigned_tutors &&
                      conversation?.assigned_tutors.length > 0 ? (
                        conversation?.assigned_tutors?.map((i) => (
                          <Typography
                            color="inherit"
                            style={{
                              fontSize: "13.5px",
                              fontWeight: "600",
                              marginBottom: "5px",
                            }}
                          >
                            <span
                              style={{ fontSize: "12px", fontWeight: "normal" }}
                            >
                              {i.name}&nbsp;|&nbsp;{i.tutor_id}&nbsp;|&nbsp;
                              <span>
                                {i?.pout_info
                                  ? i?.pout_info
                                      ?.filter((f) => f.status == "processed")
                                      ?.map((k) => k?.amount)
                                      ?.reduce((x, z) => {
                                        return x + z;
                                      }, 0) /
                                      100 +
                                    " INR"
                                  : "---"}
                              </span>
                            </span>
                          </Typography>
                        ))
                      ) : (
                        <Typography
                          color="inherit"
                          style={{
                            fontSize: "13.5px",
                            fontWeight: "600",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{ fontSize: "12px", fontWeight: "normal" }}
                          >
                            No Tutors Assigned
                          </span>
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
                  />
                </HtmlTooltip>
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: "38%",
              flexDirection: "row",
              justifyContent: "end",
              fontSize: "11px",
              fontWeight: "800",
              maxWidth: "100px",
              textAlign: "center",
            }}
          >
            {/* <div style={{height: '22px', fontSize: '13px'}} >Work status:</div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                textTransform: "capitalize",
              }}
            >
              {conversation.work_status &&
              conversation.work_status !== "New Task" ? (
                <span
                  className={
                    conversation?.work_status == "Client Cancelled" ||
                    conversation?.work_status == "Agent Cancelled"
                      ? "color_red"
                      : conversation?.work_status == "Tutors Notified"
                      ? "color_blue"
                      : conversation?.work_status == "Tutors Assigned"
                      ? "color_pink"
                      : conversation?.work_status == "Completed"
                      ? "color_green"
                      : "black"
                  }
                >
                  {conversation.work_status}
                </span>
              ) : (
                <span style={{ fontSize: "12px", color: "#fd3dca" }}>
                  New Task
                </span>
              )}
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
        <div className="userTab_">
          <div style={{ display: "flex", flexDirection: "row", flex: "38%" }}>
            {/* <div
              style={{ height: '22px', fontSize: '13px' }}
              
            >
              Deadline:
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
                fontWeight: "bolder",
                width: "145px",
              }}
            >
              {conversation?.deadline
                ? new Date(conversation?.deadline).toLocaleDateString("en-IN") +
                  moment(conversation?.deadline).format(", h:mm a")
                : "---"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flex: "24%" }}>
            {/* <div
              style={{ height: '22px', fontSize: '13px' }}
              
            >
              Duration:
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "13px",
                fontWeight: "bolder",
              }}
            >
              {conversation?.duration
                ? `${conversation?.duration?.slice(
                    0,
                    2
                  )}h ${conversation?.duration?.slice(4, 7)}m`
                : "---"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flex: "38%",
              flexDirection: "row",
              justifyContent: "end",
              fontSize: "12px",
              fontWeight: "800",
              maxWidth: "100px",
              textAlign: "end",
              // lineHeight: '2.1',
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              {/* {conversation.type ? conversation.type : '---'} */}
              {conversation?.session_agent && conversation?.session_agent}
            </div>
            <div style={{ marginBottom: "-7px", cursor: "pointer" }}>
              <ArrowRightAltIcon
                fontSize="small"
                onClick={handleOpenSessionDetails}
              />
              <Dialog
                open={showSessionDetails}
                onClose={handleCloseSessionDetails}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogTitle
                  id="scroll-dialog-title"
                  style={{ width: "525px" }}
                >
                  {conversation?.type} Details
                  {/* <span style={{float: 'right', cursor: 'pointer'}}>
                  <DoNotDisturbIcon />
                  </span> */}
                </DialogTitle>
                <DialogContent
                  dividers={false}
                  style={{ padding: "0px 32px 20px 32px" }}
                >
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Session ID:</div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.session_id}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Client ID:</div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.client_id}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Work Details:</div>
                      <div
                        style={{
                          fontWeight: "800",
                          paddingRight: "45px",
                          maxWidth: "300px",
                        }}
                      >
                        {conversation?.client_comments
                          ? conversation?.client_comments
                          : "---"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Deadline:</div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.deadline
                          ? moment(conversation?.deadline).format(
                              "MMM Do YY, h:mm a"
                            )
                          : "---"}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Duration:</div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.duration
                          ? conversation?.duration
                          : "---"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Client Amount:</div>
                      {conversation?.client_amount && !isEditClientAmt ? (
                        <div style={{ fontWeight: "800" }}>
                          {conversation?.client_amount ? (
                            <span style={{ display: "flex" }}>
                              {conversation?.client_amount / 100 +
                                " " +
                                conversation.currency}
                              {!conversation?.payment_info ||
                                (conversation.payment_info.length == 0 && (
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <EditIcon
                                      fontSize="x-small"
                                      style={{ fontSize: "15px" }}
                                      onClick={() => {
                                        window.confirm(
                                          "Warning!!! If you update the client amount field you will lost the old payment informations for this session. Would you like to continue?"
                                        ) && setIsEditClientAmt(true);
                                      }}
                                    />
                                  </span>
                                ))}
                              {/* <div style={{display: 'flex', marginRight: '60px'}}>
                              <img
                                src='/assets/paypal.png'
                                style={{width: '30px'}}
                                alt='paypal'
                              />
                              <Checkbox
                                size="small"
                                checked={checked}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                              </div> */}
                            </span>
                          ) : (
                            "---"
                          )}
                        </div>
                      ) : !conversation?.client_amount || isEditClientAmt ? (
                        <span style={{ fontWeight: "800" }}>
                          <select
                            name="type"
                            id="type"
                            className="arrow"
                            style={{
                              width: "22%",
                              height: "23px",
                              padding: "0px",
                              borderBottom: "1px solid gray",
                              borderRadius: "0px",
                            }}
                            value={selectCurrency}
                            onChange={(event) =>
                              setSelectCurrency(event.target.value)
                            }
                            required
                          >
                            <option selected value="USD">
                              USD
                            </option>
                            <option value="EUR">EUR</option>
                            <option value="BHD">BHD</option>
                            <option value="INR">INR</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                            <option value="GBP">GBP</option>
                            <option value="AED">AED</option>
                          </select>
                          <input
                            type="number"
                            style={{
                              width: "30%",
                              height: "20px",
                              marginLeft: "5px",
                              outline: "none",
                              border: "none",
                              borderBottom: "1px solid gray",
                              borderRadius: "0px",
                            }}
                            min="1"
                            max="10"
                            value={selectClientAmount}
                            onChange={(e) =>
                              setSelectClientAmount(e.target.value)
                            }
                          />
                          <Checkbox
                            size="small"
                            checked={paypalOption}
                            onChange={handleCheckPayPal}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          <span style={{ cursor: "pointer" }}>PayPal</span>{" "}
                          &nbsp;
                          {!disableUpdate ? (
                            <button
                              style={{
                                backgroundColor: "#1876D1",
                                color: "#ffff",
                                border: "none",
                                borderRadius: "2px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={clientAmtHandler}
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              style={{
                                border: "1px solid #e3e0e0",
                                borderRadius: "2px",
                                height: "25px",
                              }}
                              disabled
                            >
                              <CircularProgress
                                fontSize="small"
                                style={{ width: "15px", height: "15px" }}
                              />{" "}
                              Update
                            </button>
                          )}
                        </span>
                      ) : null}
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Client Amount Paid:
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          style={{
                            fontSize: "10px",
                            lineHeight: "1.6",
                            minWidth: "57px",
                            marginLeft: "15px",
                          }}
                          onClick={handleOpenRefundWindow}
                        >
                          Refund
                        </Button>
                        <Dialog
                          open={openRefundWin}
                          onClose={handleCloseRefundWindow}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Initiate Refunds to Client"}
                          </DialogTitle>
                          <DialogContent
                            style={{
                              paddingLeft: "0px",
                              paddingRight: "0px",
                              width: "500px",
                            }}
                          >
                            <DialogContentText id="alert-dialog-description">
                              {conversation?.payment_info?.map(
                                (payment, index) => (
                                  <>
                                    <div
                                      key={index}
                                      style={{
                                        padding: "18px 26px 18px 26px",
                                        borderBottom: "1px solid lightgray",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          fontWeight: "800",
                                        }}
                                      >
                                        {payment.currency}{" "}
                                        {payment.amount / 100}{" "}
                                        <span
                                          style={{
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          on{" "}
                                          {moment(
                                            new Date(
                                              payment?.created_at * 1000
                                            ).toISOString()
                                          ).format("MMM Do YYYY, h:mm a")}
                                        </span>
                                        <span
                                          style={{
                                            display: "flex",
                                            flex: "10%",
                                            justifyContent: "flex-end",
                                          }}
                                        >
                                          {payment?.refund_info &&
                                          payment?.refund_info
                                            ?.filter(
                                              (f) => f.status == "processed"
                                            )
                                            .map((k) => k?.amount)
                                            .reduce((x, z) => {
                                              return x + z;
                                            }, 0) == payment.amount ? (
                                            <Button
                                              variant="contained"
                                              size="small"
                                              color="error"
                                              style={{
                                                fontSize: "9px",
                                                lineHeight: "1.6",
                                                minWidth: "57px",
                                                marginLeft: "15px",
                                              }}
                                              disabled
                                            >
                                              Refund
                                            </Button>
                                          ) : (
                                            <>
                                              <input
                                                style={{
                                                  width: "75px",
                                                  height: "18px",
                                                  borderRadius: "4px",
                                                  border: "1px solid lightgray",
                                                  outline: "none",
                                                }}
                                                type="number"
                                                placeholder="Amount"
                                                onChange={(e) =>
                                                  setRefundAmount(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <Button
                                                variant="contained"
                                                size="small"
                                                color="error"
                                                style={{
                                                  fontSize: "9px",
                                                  lineHeight: "1.6",
                                                  minWidth: "57px",
                                                  marginLeft: "15px",
                                                }}
                                                onClick={() =>
                                                  handleInitiateRefund(
                                                    payment.id
                                                  )
                                                }
                                              >
                                                Refund
                                              </Button>
                                            </>
                                          )}
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "11px",
                                          marginTop: "8px",
                                        }}
                                      >
                                        Payment ID:{" "}
                                        {payment?.id?.replace("pay_", "")}
                                        {" (" + payment.method + ")"}
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                          }}
                                        >
                                          {payment?.refund_info && (
                                            <span
                                              style={{
                                                fontStyle: "italic",
                                                textDecoration: "underline",
                                              }}
                                            >
                                              Refund ID/s:
                                            </span>
                                          )}
                                          {payment?.refund_info &&
                                            payment?.refund_info
                                              ?.filter(
                                                (f) => f.status == "processed"
                                              )
                                              .map((i) => (
                                                <div
                                                  style={{ display: "flex" }}
                                                >
                                                  {i?.id?.replace("rfnd_", "")}
                                                  {" ("}
                                                  {i?.amount / 100}{" "}
                                                  {i?.currency}
                                                  {")"}
                                                </div>
                                              ))}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )
                              )}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseRefundWindow}>
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                      <div style={{ fontWeight: "800", display: 'flex', flexDirection: 'column' }}>
                        {conversation?.payment_info?.length > 0 ? (
                          <div style={{display: 'flex'}}>
                            {conversation?.payment_info
                              ?.filter((f) => f.type == "plink")
                              ?.map((i) => i.amount)
                              .reduce((pv, cv) => {
                                return pv + cv;
                              }, 0) /
                              100 +
                              " " +
                              conversation?.currency}

                            <span
                              style={{
                                display: 'flex',
                                alignSelf: 'center',
                                marginLeft: '5px',
                                cursor: "pointer",
                                color: paymentStatusCheck=="" ? "orange" : paymentStatusCheck==="success"? "green" :"red",
                              }}
                              onClick={handlePlinkupdate}
                            >
                              <RefreshIcon fontSize="small" />
                            </span>
                          </div>
                        ) : (
                       
                          <div>
                          ---
                          <span
                              style={{
                                cursor: "pointer",
                                color: paymentStatusCheck=="" ? "orange" : paymentStatusCheck==="success"? "green" :"red",
                              }}
                              onClick={handlePlinkupdate}
                            >
                              <RefreshIcon fontSize="small" />
                          </span>
                          </div>
                        )}

                        {/* end shivanshu */}

                        {/* <div>{virtualAccPayments && virtualAccPayments?.length > 0 && virtualAccPayments?.map((i) => i?.amount).reduce((a, b) => { return (a + b)}, 0)/100 + ' ' + virtualAccPayments[0]?.currency + ' (paid to vpa)'}</div> */}
                        <div>
                          {conversation?.payment_info?.filter(
                            (i) => i.type == "vpa" && i.status == "captured"
                          ) &&
                            conversation?.payment_info?.filter(
                              (i) => i.type == "vpa" && i.status == "captured"
                            ).length > 0 && (
                              <>
                                {conversation?.payment_info
                                  ?.filter(
                                    (i) =>
                                      i.type == "vpa" && i.status == "captured"
                                  )
                                  ?.map((k) => k?.amount)
                                  .reduce((x, z) => {
                                    return x + z;
                                  }, 0) /
                                  100 +
                                  " INR (paid to vpa)"}
                                
                                {/* <div
                                  style={{
                                    cursor: "pointer",
                                    float: "left",
                                    color: "orange",
                                  }}
                                  onClick={handleVaUpdate}
                                >
                                  <RefreshIcon fontSize="medium" />
                                </div> */}
                              </>
                            )}
                        </div>
                      </div>
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                conversation?.payment_status == "paid"
                                  ? true
                                  : false
                              }
                              onChange={handleSessionPaymentStatus}
                              size="small"
                              name="payment"
                            />
                          }
                          label="Fully Paid"
                        />
                        <div style={{ fontSize: "12px", marginTop: "-7px" }}>
                          (Use it only in case of bank transfer)
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Total Amount Paid to Tutors:
                      </div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.assigned_tutors &&
                        conversation?.assigned_tutors?.length > 0
                          ? conversation?.assigned_tutors
                              ?.filter((e) => e?.pout_info?.length > 0)
                              ?.map(
                                (i) =>
                                  i?.pout_info
                                    ?.filter((f) => f.status == "processed")
                                    .map((k) => k?.amount)
                                    .reduce((x, z) => {
                                      return x + z;
                                    }, 0) / 100
                              )
                              .reduce((x, z) => {
                                return x + z;
                              }, 0) + " INR"
                          : "---"}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Subject:</div>
                      <div
                        style={{
                          fontWeight: "800",
                          maxWidth: "300px",
                          paddingRight: "45px",
                        }}
                      >
                        {conversation?.subject
                          ? conversation?.subject.toUpperCase()
                          : "---"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Tutor Dealt Amount:
                      </div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.tutor_dealt_amount && !editTutorAmt ? (
                          <div style={{ fontWeight: "800" }}>
                            <>
                              <span>
                                {conversation?.tutor_dealt_amount / 100 +
                                  " INR"}
                              </span>
                              &nbsp;
                              <span style={{ cursor: "pointer" }}>
                                <EditIcon
                                  fontSize="x-small"
                                  style={{ fontSize: "15px" }}
                                  onClick={() => setEditTutorAmt(true)}
                                />
                              </span>
                            </>
                          </div>
                        ) : (
                          <span style={{ fontWeight: "800" }}>
                            <input
                              type="number"
                              style={{
                                width: "30%",
                                height: "20px",
                                marginLeft: "5px",
                                marginTop: "5px",
                                outline: "none",
                                border: "none",
                                borderBottom: "1px solid gray",
                                borderRadius: "0px",
                              }}
                              value={tutorDealtAmount}
                              onChange={(e) =>
                                setTutorDealtAmount(e.target.value)
                              }
                              autoFocus
                            />{" "}
                            &nbsp;
                            {!disableUpdateTutor ? (
                              <button
                                style={{
                                  backgroundColor: "#1876D1",
                                  color: "#ffff",
                                  border: "none",
                                  borderRadius: "2px",
                                  height: "25px",
                                  cursor: "pointer",
                                }}
                                onClick={tutorAmtHandler}
                              >
                                Update
                              </button>
                            ) : (
                              <button
                                style={{
                                  border: "1px solid #e3e0e0",
                                  borderRadius: "2px",
                                  height: "25px",
                                }}
                                disabled
                              >
                                <CircularProgress
                                  fontSize="small"
                                  style={{ width: "15px", height: "15px" }}
                                />{" "}
                                Update
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Type:</div>
                      <div style={{ fontWeight: "800" }}>
                        {conversation?.type ? conversation.type : "---"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Work Status:</div>
                      <div style={{ fontWeight: "800" }}>
                        {!edit ? (
                          <>
                            <span>
                              {conversation?.work_status
                                ? conversation?.work_status
                                : "New Task"}
                            </span>
                            &nbsp;
                            <span style={{ cursor: "pointer" }}>
                              <EditIcon
                                fontSize="x-small"
                                style={{ fontSize: "15px" }}
                                onClick={() => setEdit(true)}
                              />
                            </span>
                          </>
                        ) : (
                          <NativeSelect
                            defaultValue={conversation?.work_status}
                            inputProps={{
                              name: "age",
                              id: "uncontrolled-native",
                            }}
                            style={{ padding: "5px" }}
                            onChange={handleChangeStatus}
                          >
                            <option value="">-select-</option>
                            <option value="New Task">New Task</option>
                            <option value="Not Confirmed">Not Confirmed</option>
                            <option value="Tutors Notified">
                              Tutors Notified
                            </option>
                            <option value="Tutors Assigned">
                              Tutors Assigned
                            </option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Client Cancelled">
                              Client Cancelled
                            </option>
                            <option value="Agent Cancelled">
                              Agent Cancelled
                            </option>
                            <option value="Completed">Completed</option>
                            <option value="Solution Sent">Send Solution</option>
                          </NativeSelect>
                        )}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Agent Name & Comment:
                      </div>
                      <div style={{ fontWeight: "800", marginTop: "5px" }}>
                        <textarea
                          id="agentComment"
                          name="agentComment"
                          value={agentComment}
                          onChange={(e) => setAgentComment(e.target.value)}
                          style={{
                            width: "80%",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            border: "1px solid #d1d1d1",
                            resize: "none",
                            outline: "none",
                            fontFamily: "sans-serif",
                          }}
                          rows="4"
                          cols="50"
                          placeholder="e.g. Sachin: *Your comments*"
                        />
                        <button
                          style={{
                            backgroundColor: "#1876D1",
                            color: "#ffff",
                            border: "none",
                            borderRadius: "5px",
                            height: "25px",
                            cursor: "pointer",
                          }}
                          onClick={agentCommentHandler}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "45%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Agent Comments:
                        {conversation?.agent_comments &&
                          conversation?.agent_comments?.length > 0 && (
                            <span>
                              <HtmlTooltip
                                placement="top"
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
                                      Old Comments:{" "}
                                    </Typography>
                                    <Typography
                                      color="inherit"
                                      style={{
                                        fontSize: "13.5px",
                                        fontWeight: "600",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      {conversation?.agent_comments?.map(
                                        (i) => (
                                          <div
                                            style={{
                                              fontSize: "12px",
                                              fontWeight: "normal",
                                            }}
                                          >
                                            {i}
                                          </div>
                                        )
                                      )}
                                    </Typography>
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
                                />
                              </HtmlTooltip>
                            </span>
                          )}
                      </div>
                      <div
                        style={{
                          fontWeight: "800",
                          fontSize: "14px",
                          maxWidth: "270px",
                        }}
                      >
                        {conversation?.agent_comments_new &&
                        conversation?.agent_comments_new.length > 0
                          ? conversation?.agent_comments_new
                              ?.slice(0, lastIndex)
                              .map((i) => (
                                <div>
                                  [
                                  {moment(i.timestamp).format(
                                    "MMM Do YY, h:mm a"
                                  )}
                                  ] {i.agent_comment}
                                </div>
                              ))
                          : "---"}
                        {conversation?.agent_comments_new &&
                        conversation?.agent_comments_new.length > 1 &&
                        lastIndex == 1 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              color: "#5555ff",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() =>
                              setLastIndex(
                                conversation?.agent_comments_new.length
                              )
                            }
                          >
                            Show More <ExpandMoreIcon fontSize="small" />
                          </div>
                        ) : conversation?.agent_comments_new &&
                          conversation?.agent_comments_new.length > 1 &&
                          lastIndex > 1 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              color: "#5555ff",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            onClick={() => setLastIndex(1)}
                          >
                            Show Less <KeyboardArrowUpIcon fontSize="small" />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </DialogContentText>
                  <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef_}
                    tabIndex={-1}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "10px 0px 20px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Folder G-Drive Link:
                      </div>
                      {/* {conversation?.filelink
                        ? conversation?.filelink.map((i, j) => (
                            <a
                              style={{ width: 'max-content' }}
                              href={i}
                              target='_blank'
                            >
                              File {j + 1}
                            </a>
                          ))
                        : '---'} */}
                      {conversation?.folderlink ? (
                        <a
                          style={{ width: "max-content" }}
                          href={conversation?.folderlink}
                          target="_blank"
                        >
                          Click here
                        </a>
                      ) : (
                        "---"
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>Form Link:</div>
                      <a
                        style={{ width: "max-content" }}
                        href={`${linkBaseURL}/${conversation.session_id}/${conversation.client_id}?agent=success&key=poc_y6d_ui9`}
                        target="_blank"
                      >
                        Form Link
                      </a>
                    </div>
                    {/* <div
                      style={{
                        display: 'flex',
                        flex: '55%',
                        flexDirection: 'column',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ fontSize: '14px' }}>Tutor Deadline:</div>
                      <input type='datetime-local' style={{width: '130px', outline: 'none', borderRadius: '3px', border: '1px solid gray', fontFamily: 'inherit'}} onChange={(e) => setTutorDeadline(e.target.value)} />
                    </div> */}
                    {/* <div
                      style={{
                        display: 'flex',
                        flex: '55%',
                        flexDirection: 'column',
                        marginBottom: '20px',
                      }}
                    >
                    {conversation?.type == 'Live Session' &&
                    <>
                    <div style={{ fontSize: '14px' }}>Tutor Deadline:</div>
                    <NumberFormat
                      style={{width: "60px", outline: "none", borderRadius: "3px", border: "1px solid gray"}}
                      format="## : ##"
                      placeholder="00 : 00"
                      onChange={(e) => setTutorDuration(e.target.value)}
                      autoComplete="off"
                    />
                    </>}
                    </div> */}
                    <div
                      style={{
                        display: "flex",
                        flex: "55%",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        Tutors for this {conversation?.type}:
                      </div>
                      {conversation?.notified_tutors &&
                      conversation?.notified_tutors?.length > 0 ? (
                        <NotifiedTutors
                          notified_tutors={conversation?.notified_tutors}
                          assigned_tutors={conversation?.assigned_tutors}
                          tutor_interested={conversation?.tutor_interested}
                          sessionId={conversation?.session_id}
                          setAssignedTutor={setAssignedTutor}
                          tutorPayout={tutorPayout}
                          subject={conversation?.subject}
                          deadline={conversation?.deadline}
                          duration={conversation?.duration}
                          updated={updated}
                          setUpdated={setUpdated}
                          sessionType={conversation.type}
                          // tutor_dealt_amount={conversation?.tutor_dealt_amount}
                        />
                      ) : (
                        "---"
                      )}
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseSessionDetails}>Close</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default SessionList;
