import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import EditIcon from "@mui/icons-material/Edit";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import moment from 'moment';
import TabPanel from "@mui/lab/TabPanel";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Chip from "@mui/material/Chip";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import Button from "@mui/material/Button";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import NativeSelect from "@mui/material/NativeSelect";
import CircularProgress from "@mui/material/CircularProgress";
import RecommendIcon from "@mui/icons-material/Recommend";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import NumberFormat from "react-number-format";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import WhatsappOutlinedIcon from "@mui/icons-material/WhatsappOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import cancelPic1 from "../../assets/cancelledPic3.png";
import TutorRatingAndReviews from "../dialogs/TutorRating&Reviews";
import RefreshIcon from '@mui/icons-material/Refresh';
import { NAME_SPACE, WAID } from "../../utils/variables";

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

const NotifiedTutors = ({
  notified_tutors,
  assigned_tutors,
  tutor_interested,
  tutor_dealt_amount,
  sessionId,
  setAssignedTutor,
  tutorPayout,
  subject,
  deadline,
  duration,
  updated,
  setUpdated,
  sessionType,
}) => {
  const [value, setValue] = useState("1");
  const [openPayment, setOpenPayment] = useState(false);
  const [tutorAmt, setTutorAmt] = useState();
  let [tutorName, setTutorName] = useState();
  let [accNo, setAccNo] = useState();
  let [ifsc, setIfsc] = useState();
  let [upiId, setUpiId] = useState();
  const [tutorData, setTutorData] = useState();
  const [payOption, setPayOption] = useState();
  const [payMode, setPayMode] = useState("IMPS");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [rpayPout, setRpayPout] = useState();
  const [assgnTutorRating, setAssgnTutorRating] = useState(0);
  const [disableRateBtn, setDisableRateBtn] = useState(false);
  const [checked, setChecked] = useState(false);
  let deviceNo = localStorage.getItem("device");
  const [tutorDuration, setTutorDuration] = useState("");
  const [showTutorRatingBox, setShowTutorRatingBox] = useState(false);
  const [storeTutorRating, setStoreTutorRating] = useState();
  const [assgnTutorId, setAssgnTutorId] = useState();
  const [editTutorAmt, setEditTutorAmt] = useState(false);
  const [tutorDealtAmount, setTutorDealtAmount] = useState();
  const [tutorDetails, setTutorDetails] = useState();

  console.log(tutorPayout);

  const editTutorAmtFunc=(e,tutorId,ind)=>{
    e.preventDefault()
    console.log({tutorId,ind})
    setAssgnTutorId(tutorId)
    setEditTutorAmt(true)
    assigned_tutors.map(el=>{
      if(el.tutor_id===tutorId){
      setTutorDealtAmount((+el.tutor_dealt_amount/100)+"")
    }
  })
  
  };

// set tutor dealt amount
  const tutorAmtHandler = async (tutorId) => {
    // setDisableUpdateTutor(true);
    const payload = {
      session_id: sessionId,
      tutor_id:tutorId,
      tutor_dealt_amount: tutorDealtAmount * 100,
    };
    try {
      const response = await axios.put(
        `${localStorage.getItem("api")}/api/sessions/assignedTutorUpdateAmount`,
        payload
      );
     
      setEditTutorAmt(false);
      setUpdated(!updated);
    } catch (err) {
      console.log({err});
      
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePayMode = (event) => {
    setPayMode(event.target.value);
    console.log(event.target.value);
  };

  // handleTutorRating
  const handleTutorRating = async (ratingAndReview, _id) => {
    // e.preventDefault()
    await getTutorDetails(_id);
    tutorDetails?.rating_and_reviews &&
    tutorDetails?.rating_and_reviews.map((el) => {
        if (el.sessionId === sessionId) setAssgnTutorRating(el);
      });
    setAssgnTutorId(_id);
    setShowTutorRatingBox(true);
  };

  // assign tutors fro interested tutor list
  const handleAssignTutor = async (tutor) => {
    if (!assigned_tutors.find((el) => el.tutor_id == tutor.tutor_id)) {
      let tutor_dur = {
        tutor_duration: tutorDuration ? tutorDuration : duration,
      };
      // const payload = {
      //   session_id: sessionId,
      //   assigned_tutor: {...tutor, ...tutor_dur}
      // };
      let payloadTutor = {
        tutorId: tutor.tutor_id,
        sessions_assigned: {
          session_id: sessionId,
          deadline: deadline,
          duration: duration,
          type: sessionType,
        },
      };
      try {
        // const response = await axios.post(
        //   `${localStorage.getItem('api')}/api/sessions/asignTutor`,
        //   payload,
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   }
        //);
        // tutor notification
        if (tutor.wa_id && tutor.email) {
          // mail and whatsapp
          const payload = {
            session_id: sessionId,
            assigned_tutor: { ...tutor, ...tutor_dur, medium: "wa-mail" },
          };
          const response = await axios.post(
            `${localStorage.getItem("api")}/api/sessions/asignTutor`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          await handleSendTemplateToAssignTutor(
            tutor.wa_id,
            tutor.name,
            tutor.tutor_id
          );
          await handleSendMailToAssignTutor(
            tutor.email,
            tutor.name,
            tutor.tutor_id
          );
          await axios.post(
            `${localStorage.getItem("api")}/api/tutor/setTutorAssignedSession`,
            payloadTutor,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setAssignedTutor(response?.data?.result?.assigned_tutors.length);
        } else if (tutor.wa_id && !tutor.email) {
          // only whatsapp
          const payload = {
            session_id: sessionId,
            assigned_tutor: { ...tutor, ...tutor_dur, medium: "wa" },
          };
          const response = await axios.post(
            `${localStorage.getItem("api")}/api/sessions/asignTutor`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          await handleSendTemplateToAssignTutor(
            tutor.wa_id,
            tutor.name,
            tutor.tutor_id
          );
          await axios.post(
            `${localStorage.getItem("api")}/api/tutor/setTutorAssignedSession`,
            payloadTutor,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setAssignedTutor(response?.data?.result?.assigned_tutors.length);
        } else if (!tutor.wa_id && tutor.email) {
          //only email
          const payload = {
            session_id: sessionId,
            assigned_tutor: { ...tutor, ...tutor_dur, medium: "mail" },
          };
          const response = await axios.post(
            `${localStorage.getItem("api")}/api/sessions/asignTutor`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          await handleSendMailToAssignTutor(
            tutor.email,
            tutor.name,
            tutor.tutor_id
          );
          await axios.post(
            `${localStorage.getItem("api")}/api/tutor/setTutorAssignedSession`,
            payloadTutor,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setAssignedTutor(response?.data?.result?.assigned_tutors.length);
        }

        // await axios.post('http://localhost:8600/api/tutor/setTutorAssignedSession',
        //   payloadTutor,
        //   {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        //   }
        // );
        // setAssignedTutor(response?.data?.result?.assigned_tutors.length);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // cancel assigned tutor
  const handleCancelAssignedTutor = async (tutorName, tutorWaId, tutorId) => {
    // setChecked(event.target.checked);
    try {
      // const payload = {
      //   status: "cancelled",
      // };
      // await axios.put(
      //   `${localStorage.getItem('api')}/api/sessions/cancel-tutor/${sessionId}/${tutorId}`,
      //   payload
      // );
      // sending template for tutor active or inactive
      // if(conversation?.wa_id){
      const payloadCancelAssignedTutor = {
        name: tutorName,
        from: "",
        wa_id: tutorWaId,
        templateName: "cancelassigned_tutors",
        templateText: `Hi ${tutorName}, You are cancelled for the ${
          sessionType === "Live Session" ? "Live session" : "General session"
        } with session id ${sessionId} `,
        template: {
          namespace: NAME_SPACE,
          language: "en",
        },
        param1: `${
          sessionType === "Live Session" ? "LIVE SESSION" : "GENERAL SESSION"
        } UNASSIGNED`,
        param2: tutorName,
        param3:
          sessionType === "Live Session" ? "Live session" : "General session",
        param4: sessionId,
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
          payloadCancelAssignedTutor,
          {
            headers: "",
          }
        )
        .then(
          async (res) => {
            const payload = {
              status: "cancelled",
            };
            await axios.put(
              `${localStorage.getItem(
                "api"
              )}/api/sessions/cancel-tutor/${sessionId}/${tutorId}`,
              payload
            );
            console.log(res);
          },
          (error) => {
            console.log(error);
          }
        );

      // setChecked(status_);
      // setUpdated(!updated);
      // setCancelAssigned(true)
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenTutorPayment = async(index, tutor) => {
    console.log(index);
    // if(assigned_tutors[index].tutor_id == tutorId)
    setTutorName(assigned_tutors[index]?.name);

    try {
      const tutorDet = await axios.get(`${localStorage.getItem('api')}/api/tutor/getTutorDetail/${assigned_tutors[index]?.tutor_id}`);
      setAccNo(tutorDet?.data?.Bank?.acc_no);
      setIfsc(tutorDet?.data?.Bank?.ifsc_code);
      setUpiId(tutorDet?.data?.Bank?.upi_id);
      setTutorData(tutorDet?.data);
    } catch(err) {
      console.log(err)
    }
    setOpenPayment(true);
  };

  const handleCloseTutorPayment = () => {
    setOpenPayment(false);
    setTutorData(null);
    setPayOption(null);
  };

  const handleChangeTutorAmt = (event) => {
    console.log(event.target.value);
    setTutorAmt(event.target.value);
  };

  const handlePayMode = (event) => {
    setPayOption(event.target.value);
  };

  useEffect(async () => {
    if (
      tutorPayout?.payload?.payout?.entity?.id == rpayPout &&
      tutorPayout?.payload?.payout?.entity?.status == "processed"
    ) {
      // tutor payment status update
      const statusPayload = tutorPayout?.payload?.payout?.entity;
      const statusUpdate = await axios.put(
        `${localStorage.getItem(
          'api'
        )}/api/sessions/update-tutor-payment-status/${sessionId}/${tutorData.wa_id}/${rpayPout}`,
        statusPayload
      );
      setPaymentSuccess(true);

      //sent template for payment confirmation
      const payload = {
        name: tutorData.name,
        from: "",
        wa_id: tutorData.wa_id,
        templateName: "paytutor_send_notify",
        templateText:
          "Hi *{{1}}*. This is Tutorpoint. An amount of *Rs {{2}}* has been sent to your bank account registered with us. Following are the details :   \n\n1. Session ID : *{{3}}*\n2. Tutor ID : *{{4}}*\n2. Session Subject and Topic : *{{5}}*\n3. Date and Time : *{{6}}*\n4. UTR No. : *{{7}}*\n5. TDS Deducted : *{{8}}*",
        template: {
          namespace: NAME_SPACE,
          language: "en",
        },
        param1: `Payout Received (Your rating for this session ${
          tutorData?.session_rating && tutorData?.session_rating.slice(0, 4)
        })`,
        param2: tutorData.name,
        param3: `${
          // tutorData?.pan ? tutorAmt - tutorAmt * 0.1 : tutorAmt - tutorAmt * 0.2
          tutorPayout?.payload?.payout?.entity?.amount / 100
        } INR`,
        param4: sessionId,
        param5: `${tutorData?.tutor_id} (Profile rating: ${
          tutorData?.session_rating && tutorData?.rating
            ? (
                "" +
                (+tutorData?.rating + +tutorData?.session_rating) / 4
              )?.slice(0, 4)
            : tutorData?.session_rating && !tutorData?.rating
            ? ("" + tutorData?.session_rating / 2)?.slice(0, 4)
            : "0"
        })`,
        param6: subject,
        param7: new Date(deadline).toLocaleString(),
        param8: tutorPayout?.payload?.payout?.entity?.utr,
        param9:
          !checked && tutorData?.pan
            ? (tutorAmt * 0.1).toString()
            : !checked && !tutorData?.pan
            ? (tutorAmt * 0.2).toString()
            : (tutorAmt * 0).toString(),
        button: "",
        timestamp: "",
        operatorName: "",
        isOwner: true,
        status: "",
        ticketId: "",
        eventType: "template",
      };
      const paymentAlert = await axios.post(
        `${localStorage.getItem("api")}/api/messages/tutorPaymentTemplate`,
        payload,
        {
          headers: "",
        }
      );
    } else if (
      tutorPayout?.payload?.payout?.entity?.id == rpayPout &&
      tutorPayout?.payload?.payout?.entity?.status == "reversed"
    ) {
      // setPaymentLoading(false);
      const statusPayload_ = tutorPayout?.payload?.payout?.entity;
      const statusUpdate = await axios.put(
        `${localStorage.getItem(
          "api"
        )}/api/sessions/update-tutor-payment-status/${sessionId}/${
          tutorData.wa_id
        }/${rpayPout}`,
        statusPayload_
      );
      setPaymentSuccess(true);
    } else if (
      tutorPayout?.payload?.payout?.entity?.id == rpayPout &&
      tutorPayout?.payload?.payout?.entity?.status == 'cancelled'
    ) {
      // setPaymentLoading(false);
      const statusPayload_ = tutorPayout?.payload?.payout?.entity;
      const statusUpdate = await axios.put(
        `${localStorage.getItem(
          'api'
        )}/api/sessions/update-tutor-payment-status/${sessionId}/${
          tutorData.wa_id
        }/${rpayPout}`,
        statusPayload_
      );
      setPaymentSuccess(true);
    }
  }, [tutorPayout]);

  const payHeaders = {
    username: "rzp_live_Jk4vwq7tyL9Aeg",
    password: "qUjOJWotN6x47WSDExJ4NURs",
  };

  const payTutor = async () => {
    if (payOption == "upi") {
      setPaymentLoading(true);
      const payload = {
        name: tutorData.name,
        email: tutorData.email,
        contact: tutorData.wa_id,
        type: "vendor",
        reference_id: tutorData.tutor_id,
        // notes: {
        //   random_key_1: 'tutor\'s new contact id creation',
        //   random_key_2: 'vendon contact id',
        // },
      };
      try {
        if (!tutorData.contact_id) {
          // create contact id
          const response = await axios.post(
            `${localStorage.getItem("api")}/api/payments/contacts`,
            payload,
            {
              headers: {
                ...payHeaders,
              },
            }
          );
          console.log(response?.data?.result);

          // create fund account - bank
          if (payOption == "bank") {
            const payloadBank = {
              contact_id: response?.data?.contact_id,
              account_type: "bank_account",
              bank_account: {
                name: tutorData.name,
                ifsc: tutorData?.Bank?.ifsc_code,
                account_number: tutorData?.Bank?.acc_no,
              },
            };
            const response2 = await axios.post(
              `${localStorage.getItem("api")}/api/payments/fund_accounts_bank/${
                tutorData.wa_id
              }`,
              payloadBank,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            // create payout
            const payloadPayout_ = {
              account_number: "3434949239801329",
              fund_account_id: response2?.data?.fund_bank_id,
              amount:
                !checked && tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 10
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 20
                  : tutorAmt * 100,
              currency: "INR",
              mode: payMode,
              purpose: "vendor bill",
              // queue_if_low_balance: true,
              reference_id: response2?.data?.tutor_id,
              narration: "Tutor Fund Transfer",
              notes: {
                TDS:
                  !checked && tutorData.pan
                    ? tutorAmt * 0.1
                    : !checked && !tutorData?.pan
                    ? tutorAmt * 0.2
                    : tutorAmt * 0,
                PAN: tutorData.pan ? tutorData?.pan : "",
                EMAIL: tutorData.email,
                SESSION: sessionId,
              },
            };
            const payoutRes_ = await axios.post(
              `${localStorage.getItem("api")}/api/payments/payouts/${
                tutorData.wa_id
              }/${sessionId}`,
              payloadPayout_,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(payoutRes_?.data);
            setRpayPout(payoutRes_?.data?.rpay?.id);
            // setOpenPayment(false);
            console.log(response2?.data?.result);
          }
          // create fund account - upi
          else if (payOption == "upi") {
            const payloadUpi = {
              contact_id: response?.data?.contact_id,
              account_type: "vpa",
              vpa: {
                address: tutorData?.Bank?.upi_id,
              },
            };
            const response2 = await axios.post(
              `${localStorage.getItem("api")}/api/payments/fund_accounts_upi/${
                tutorData.wa_id
              }`,
              payloadUpi,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(response2?.data);

            // create payout
            const payloadPayout_ = {
              account_number: "3434949239801329",
              fund_account_id: response2?.data?.fund_upi_id,
              amount:
                !checked && tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 10
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 20
                  : tutorAmt * 100,
              currency: "INR",
              mode: "UPI",
              purpose: "vendor bill",
              // queue_if_low_balance: true,
              reference_id: response2?.data?.tutor_id,
              narration: "Tutor Fund Transfer",
              notes: {
                TDS:
                  !checked && tutorData.pan
                    ? tutorAmt * 0.1
                    : !checked && !tutorData?.pan
                    ? tutorAmt * 0.2
                    : tutorAmt * 0,
                PAN: tutorData.pan ? tutorData?.pan : "",
                EMAIL: tutorData.email,
                SESSION: sessionId,
              },
            };
            const payoutRes_ = await axios.post(
              `${localStorage.getItem("api")}/api/payments/payouts/${
                tutorData.wa_id
              }/${sessionId}`,
              payloadPayout_,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(payoutRes_?.data);
            setRpayPout(payoutRes_?.data?.rpay?.id);
            // setOpenPayment(false);
          }
        } else if (
          tutorData.contact_id &&
          tutorData.fund_upi_id &&
          tutorData.fund_bank_id
        ) {
          console.log("already created");
          const payloadPayout = {
            account_number: "3434949239801329",
            fund_account_id:
              payOption == "bank"
                ? tutorData.fund_bank_id
                : payOption == "upi"
                ? tutorData.fund_upi_id
                : "",
            amount:
              !checked && tutorData?.pan
                ? tutorAmt * 100 - tutorAmt * 10
                : !checked && !tutorData?.pan
                ? tutorAmt * 100 - tutorAmt * 20
                : tutorAmt * 100,
            currency: "INR",
            mode:
              payOption == "bank" ? payMode : payOption == "upi" ? "UPI" : "",
            purpose: "vendor bill",
            // queue_if_low_balance: true,
            reference_id: tutorData.tutor_id,
            narration: "Tutor Fund Transfer",
            notes: {
              TDS:
                !checked && tutorData.pan
                  ? tutorAmt * 0.1
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 0.2
                  : tutorAmt * 0,
              PAN: tutorData.pan ? tutorData?.pan : "",
              EMAIL: tutorData.email,
              SESSION: sessionId,
            },
          };
          const payoutRes = await axios.post(
            `${localStorage.getItem("api")}/api/payments/payouts/${
              tutorData.wa_id
            }/${sessionId}`,
            payloadPayout,
            {
              headers: {
                ...payHeaders,
              },
            }
          );
          setRpayPout(payoutRes?.data?.rpay?.id);
          setUpdated(!updated);
          console.log(payoutRes?.data);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (payOption == "bank") {
      setPaymentLoading(true);
      const payload = {
        name: tutorData.name,
        email: tutorData.email,
        contact: tutorData.wa_id,
        type: "vendor",
        reference_id: tutorData.tutor_id,
        // notes: {
        //   random_key_1: 'tutor\'s new contact id creation',
        //   random_key_2: 'vendon contact id',
        // },
      };
      try {
        if (!tutorData.contact_id) {
          // create contact id
          const response = await axios.post(
            `${localStorage.getItem("api")}/api/payments/contacts`,
            payload,
            {
              headers: {
                ...payHeaders,
              },
            }
          );
          console.log(response?.data?.result);

          // create fund account - bank
          if (payOption == "bank") {
            const payloadBank = {
              contact_id: response?.data?.contact_id,
              account_type: "bank_account",
              bank_account: {
                name: tutorData.name,
                ifsc: tutorData?.Bank?.ifsc_code,
                account_number: tutorData?.Bank?.acc_no,
              },
            };
            const response2 = await axios.post(
              `${localStorage.getItem("api")}/api/payments/fund_accounts_bank/${
                tutorData.wa_id
              }`,
              payloadBank,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            // create payout
            const payloadPayout_ = {
              account_number: "3434949239801329",
              fund_account_id: response2?.data?.fund_bank_id,
              amount:
                !checked && tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 10
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 20
                  : tutorAmt * 100,
              currency: "INR",
              mode: payMode,
              purpose: "vendor bill",
              // queue_if_low_balance: true,
              reference_id: response2?.data?.tutor_id,
              narration: "Tutor Fund Transfer",
              notes: {
                TDS:
                  !checked && tutorData.pan
                    ? tutorAmt * 0.1
                    : !checked && !tutorData?.pan
                    ? tutorAmt * 0.2
                    : tutorAmt * 0,
                PAN: tutorData.pan ? tutorData?.pan : "",
                EMAIL: tutorData.email,
                SESSION: sessionId,
              },
            };
            const payoutRes_ = await axios.post(
              `${localStorage.getItem("api")}/api/payments/payouts/${
                tutorData.wa_id
              }/${sessionId}`,
              payloadPayout_,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(payoutRes_?.data);
            setRpayPout(payoutRes_?.data?.rpay?.id);
            // setOpenPayment(false);
            console.log(response2?.data?.result);
          }
          // create fund account - upi
          else if (payOption == "upi") {
            const payloadUpi = {
              contact_id: response?.data?.contact_id,
              account_type: "vpa",
              vpa: {
                address: tutorData?.Bank?.upi_id,
              },
            };
            const response2 = await axios.post(
              `${localStorage.getItem("api")}/api/payments/fund_accounts_upi/${
                tutorData.wa_id
              }`,
              payloadUpi,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(response2?.data);

            // create payout
            const payloadPayout_ = {
              account_number: "3434949239801329",
              fund_account_id: response2?.data?.fund_upi_id,
              amount:
                !checked && tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 10
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 100 - tutorAmt * 20
                  : tutorAmt * 100,
              currency: "INR",
              mode: "UPI",
              purpose: "vendor bill",
              // queue_if_low_balance: true,
              reference_id: response2?.data?.tutor_id,
              narration: "Tutor Fund Transfer",
              notes: {
                TDS:
                  !checked && tutorData.pan
                    ? tutorAmt * 0.1
                    : !checked && !tutorData?.pan
                    ? tutorAmt * 0.2
                    : tutorAmt * 0,
                PAN: tutorData.pan ? tutorData?.pan : "",
                EMAIL: tutorData.email,
                SESSION: sessionId,
              },
            };
            const payoutRes_ = await axios.post(
              `${localStorage.getItem("api")}/api/payments/payouts/${
                tutorData.wa_id
              }/${sessionId}`,
              payloadPayout_,
              {
                headers: {
                  ...payHeaders,
                },
              }
            );
            console.log(payoutRes_?.data);
            setRpayPout(payoutRes_?.data?.rpay?.id);
            // setOpenPayment(false);
          }
        } else if (tutorData.contact_id && tutorData.fund_bank_id) {
          console.log("already created");
          const payloadPayout = {
            account_number: "3434949239801329",
            fund_account_id:
              payOption == "bank"
                ? tutorData.fund_bank_id
                : payOption == "upi"
                ? tutorData.fund_upi_id
                : "",
            amount:
              !checked && tutorData?.pan
                ? tutorAmt * 100 - tutorAmt * 10
                : !checked && !tutorData?.pan
                ? tutorAmt * 100 - tutorAmt * 20
                : tutorAmt * 100,
            currency: "INR",
            mode:
              payOption == "bank" ? payMode : payOption == "upi" ? "UPI" : "",
            purpose: "vendor bill",
            // queue_if_low_balance: true,
            reference_id: tutorData.tutor_id,
            narration: "Tutor Fund Transfer",
            notes: {
              TDS:
                !checked && tutorData.pan
                  ? tutorAmt * 0.1
                  : !checked && !tutorData?.pan
                  ? tutorAmt * 0.2
                  : tutorAmt * 0,
              PAN: tutorData.pan ? tutorData?.pan : "",
              EMAIL: tutorData.email,
              SESSION: sessionId,
            },
          };
          const payoutRes = await axios.post(
            `${localStorage.getItem("api")}/api/payments/payouts/${
              tutorData.wa_id
            }/${sessionId}`,
            payloadPayout,
            {
              headers: {
                ...payHeaders,
              },
            }
          );
          setRpayPout(payoutRes?.data?.rpay?.id);
          setUpdated(!updated);
          console.log(payoutRes?.data);
        } else {
          alert(
            "Something is wrong with the user's bank details! Please try another payment method."
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClosePayWindow = () => {
    setPaymentLoading(false);
    setPaymentSuccess(false);
  };

  // get tutor details from id
  const getTutorDetails = async (id) => {
    try {
      const response = await axios.get(`${localStorage.getItem('api')}/api/tutor/getTutorDetail/${id}`);
      console.log(response.data);
      setTutorDetails(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // sending ratings in database
  const handleAssignTutorRating = async (tutorId) => {
    if (storeTutorRating) {
      setDisableRateBtn(true);
      const payload = {
        rating: storeTutorRating?.rating,
        speed: storeTutorRating?.speed,
        accuracy: storeTutorRating?.accuracy,
        legitimacy: storeTutorRating?.legitimacy,
        reviews: storeTutorRating?.reviews,
        session_done: sessionId,
        session_rating: storeTutorRating?.rating,
      };
      try {
        const res = await axios.put(
          `${localStorage.getItem('api')}/api/tutor/setTutorRating/${tutorId}`,
          payload
        );
        const res_ = await axios.put(
          `${localStorage.getItem(
            "api"
          )}/api/sessions/tutor-session-rating/${tutorId}/${sessionId}`,
          payload
        );

        setUpdated(!updated);
        setDisableRateBtn(false);

        setShowTutorRatingBox(false);
      } catch (err) {
        console.log(err.Error);
        setDisableRateBtn(false);
      }
    }
  };

  useEffect(async () => {
    await handleAssignTutorRating(assgnTutorId);
  }, [storeTutorRating]);

  const handleUnAssignTutor = async (tutorId, status_) => {
    try {
      const payload = {
        status: status_,
      };
      const res = await axios.put(
        `${localStorage.getItem(
          "api"
        )}/api/sessions/unassign-tutor/${sessionId}/${tutorId}`,
        payload,
        {
          headers: "",
        }
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  //   const [tutorRating, setTutorRating] = useState();
  //   let response_;
  //   useEffect(() => {
  //   let fetchTutorRating = (tutor_id) => {
  //     response_ = axios.get(
  //         `${localStorage.getItem('api')}/api/tutor/getTutorDetails/${tutor_id}`
  //       );
  //     return (response_?.data?.rating);
  //   };
  //   setTutorRating(() => fetchTutorRating());
  // }, [response_]);

  const handleSendTemplateToAssignTutor = async (waId, tutorName, tutorId) => {
    const payload = {
      name: "",
      from: "",
      wa_id: waId,
      templateName:
        sessionType == "Live Session"
          ? `sessionassigned_notify_${WAID}`
          : sessionType == "Assignment" || sessionType == "Project"
          ? `generalsession_assigned_notify_${WAID}`
          : "",
      templateText: `Hi *{{1}}*, This is Tutorpoint\n\nWe have assigned a ${sessionType} with Session Id ${sessionId} to you. You had shown interest for this session. So Please click on the button below to accept it. \n\n*Accepting a Live session means you take responsibility to solve all the problems according to instructions given to you. You will provide clean and suitable answers to questions and submit the required files on time before deadline*\n\n*Poor performance in General Sessions will impact your ratings. Maintain high ratings to receive more work from us*`,
      template: {
        namespace: NAME_SPACE,
        language: "en",
      },
      param1: sessionType + " Assigned",
      param2: tutorName,
      param3: sessionId,
      param4: `d${deviceNo}/tutorForm/${sessionId}/${tutorId}?accept_task=success`,
      button: "",
      timestamp: "",
      operatorName: "",
      isOwner: true,
      status: "",
      ticketId: "",
      eventType: "template",
    };
    try {
      const res = await axios.post(
        `${localStorage.getItem("api")}/api/messages/tutorAssignTemplate`,
        payload,
        {
          headers: "",
        }
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendMailToAssignTutor = async (email, tutorName, tutorId) => {
    const payload = {
      name: tutorName,
      email: email,
      from: "",
      templateName:
        sessionType == "Live Session"
          ? `sessionassigned_notify_${WAID}`
          : sessionType == "Assignment" || sessionType == 'Project'
          ? `generalsession_assigned_notify_${WAID}`
          : "",
      param1: sessionType + " Assigned",
      param2: tutorName,
      param3: sessionId,
      param4: `d${deviceNo}/tutorForm/${sessionId}/${tutorId}?accept_task=success`,
    };
    try {
      const res = await axios.post(
        `${localStorage.getItem(
          "api"
        )}/api/sessions/tutorAssignMailNotification`,
        payload,
        {
          headers: "",
        }
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  // select TDS
  const handleTDS = (e) => {
    setChecked(e.target.checked);
  };

  // useEffect(() => {
  //   if(tutorPayout?.payload?.transaction?.entity?.source?.status == 'processed') {
  //     //sent template for payment confirmation
  //     const payload = {
  //       name: tutorData.name,
  //       from: '',
  //       wa_id: tutorData.wa_id,
  //       templateName: 'pay_tutor_send_notify',
  //       templateText: "Hi *{{1}}*. This is Tutorpoint. An amount of *Rs {{2}}* has been sent to your bank account registered with us. Following are the details :   \n\n1. Session ID : *{{3}}*\n2. Tutor ID : *{{4}}*\n2. Session Subject and Topic : *{{5}}*\n3. Date and Time : *{{6}}*\n4. UTR No. : *{{7}}*\n5. TDS Deducted : *{{8}}*",
  //       template: {
  //         namespace: NAME_SPACE,
  //         language: 'en',
  //       },
  //       param1: 'Payment Notification Tutorpoint',
  //       param2: tutorData.name,
  //       param3: `${tutorAmt} INR`,
  //       param4: sessionId,
  //       param5: tutorData.tutor_id,
  //       param6: subject,
  //       param7: deadline,
  //       param8: tutorPayout?.payload?.transaction?.entity?.source?.utr,
  //       param9: tutorData.pan ? tutorAmt/9 : tutorAmt/8,
  //       button: '',
  //       timestamp: '',
  //       operatorName: '',
  //       isOwner: true,
  //       status: '',
  //       ticketId: '',
  //       eventType: 'template',
  //     };
  //     const paymentAlert = await axios.post('${localStorage.getItem('api')}/api/messages3/tutorPaymentTemplate', payload, {
  //       headers: ''
  //     });
  //   }
  // }, [tutorPayout])

  const handleCancelTutor = async (tutorId, sessionId) => {
    try {
      const payload = {
        status: true,
      };
      const res = await axios.put(
        `${localStorage.getItem(
          "api"
        )}/api/sessions/cancelNotifiedTutor/${sessionId}/${tutorId}`,
        payload,
        {
          headers: "",
        }
      );
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const tutorPayoutStatus = async (wa_id, pout_info) => {
    try {
      for(let i = 0; i < pout_info.length; i++) {
        const payload = {
          sessionId: sessionId,
          waId: wa_id
        };
        const res = await axios.post(
          `${localStorage.getItem('api')}/api/payments/payout-update/${pout_info[i].id}`,
          payload,
          {
            headers: {
              ...payHeaders,
            }
          }
        );
      }
      setUpdated(!updated);
    } catch (err) {
      console.log(err)
    }
  }

  function filterArr(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  const shortText = (text) => {
    if (text?.length > 12) {
      return `${text?.slice(0, 12)}..`;
    } else if (text?.length <= 12) {
      return text;
    }
  };

  return (
    <div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab label="Interested Tutors" value="1" />
            <Tab label="Notified Tutors" value="2" />
            <Tab label="Assigned Tutors" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" style={{ padding: "15px" }}>
          <div>
            {tutor_interested?.map((tutor, index) => (
              <>
                <div key={index} style={{ padding: "10px 0px" }}>
                  <span style={{ fontWeight: "800" }}>
                    {shortText(tutor.name)}
                  </span>
                  <span>&nbsp;{tutor.tutor_id}</span>
                  &nbsp;
                  <span>
                    <HtmlTooltip
                      placement="top"
                      title={
                        <>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Highest Degree: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.highest_degree}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Department: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.dept}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>College/s: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.academic_info && tutorDetails?.academic_info[0]?.college.toString()}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>WhatsApp: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.wa_id}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Subjects known: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.subjects && tutorDetails?.subjects.toString()}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Tags: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.tags && tutorDetails?.tags.toString()}</span></Typography>
                        <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Rating: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.rating && <Chip size="small" icon={ <StarPurple500SharpIcon style={{ color: "#ffff", fontSize: "14px" }} /> } label={("" + tutorDetails.rating / 2)?.slice(0, 4)} color="success" />}</span></Typography>
                      </>
                      }
                    >
                      <InfoIcon
                        fontSize="small"
                        style={{ fontSize: "16px", cursor: "pointer" }}
                        onMouseEnter={() => getTutorDetails(tutor.tutor_id)}
                        onMouseLeave={() => setTutorDetails(null)}
                      />
                    </HtmlTooltip>
                  </span>
                  {/* <span>
                    &nbsp; &nbsp;
                    <Chip
                      size='small'
                      // onClick={handleClick}
                      // onDelete={handleDelete}
                      icon={
                        <StarPurple500SharpIcon
                          style={{ color: '#ffff', fontSize: '14px' }}
                        />
                      }
                      label={('' + tutor.rating / 2)?.slice(0, 4)}
                      color='success'
                    />
                  </span> */}
                  &nbsp; &nbsp;
                  <span>
                    <HtmlTooltip
                      placement="top"
                      title={
                        <>
                          <span style={{ marginBottom: "10px" }}>
                            Last 5 reviews and rating
                          </span>
                          {tutorDetails?.rating_and_reviews
                            ?.slice(
                              Math.max(tutorDetails?.rating_and_reviews?.length - 5, 0)
                            )
                            ?.map((el, index) => (
                              <Typography
                                color="inherit"
                                style={{
                                  fontSize: "13.5px",
                                  fontWeight: "600",
                                  marginTop: "5px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {el.reviews && `- ${el.reviews}  [${el.rating}☆]`}
                                </span>
                              </Typography>
                            ))}
                        </>
                      }
                    >
                      <span style={{fontSize: '11px', border: '1px solid gray', borderRadius: '20px', padding: '3px'}} onMouseEnter={() => getTutorDetails(tutor.tutor_id)}>Reviews</span>
                    </HtmlTooltip>
                  </span>
                  {/* {!assigned_tutors.find(
                      (el) => el.tutor_id == tutor.tutor_id
                    ) && <span style={{marginLeft: '20px'}}>
                    {sessionType == 'Live Session' &&
                    <NumberFormat
                      style={{width: "50px", outline: "none", borderRadius: "3px", border: "1px solid gray"}}
                      format="## : ##"
                      placeholder="00 : 00"
                      onChange={(e) => setTutorDuration(e.target.value)}
                      autoComplete="off"
                    />}
                  </span>} */}
                  <span
                    style={{ float: "right", cursor: "pointer" }}
                    onClick={() => handleAssignTutor(tutor)}
                  >
                    {assigned_tutors.find(
                      (el) => el.tutor_id == tutor.tutor_id
                    ) ? (
                      <AssignmentTurnedInIcon fontSize="medium" />
                    ) : (
                      <AssignmentTurnedInOutlinedIcon fontSize="medium" />
                    )}
                  </span>
                </div>
                <hr
                  style={{
                    width: "70%",
                    marginLeft: "0px",
                    marginBottom: "8px",
                  }}
                />
              </>
            ))}
          </div>
        </TabPanel>
        <TabPanel value="2" style={{ padding: "15px" }}>
          <div>
            {notified_tutors?.map((tutor, index) => (
              <>
                <div key={index} style={{ padding: "10px 0px" }}>
                  <span style={{ fontWeight: "800" }}>
                    {shortText(tutor.name)}
                  </span>
                  <span>&nbsp;{tutor.tutor_id}&nbsp;</span>
                  <span>
                    <HtmlTooltip
                      placement="top"
                      title={
                        <>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Highest Degree: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.highest_degree}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Department: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.dept}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>College/s: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.academic_info && tutorDetails?.academic_info[0]?.college.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>WhatsApp: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.wa_id}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Subjects known: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.subjects && tutorDetails?.subjects.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Tags: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.tags && tutorDetails?.tags.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Notified At: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutor?.timestamp ? moment(new Date(tutor?.timestamp*1000)).format('lll') : '---'}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Rating: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.rating && <Chip size="small" icon={ <StarPurple500SharpIcon style={{ color: "#ffff", fontSize: "14px" }} /> } label={("" + tutorDetails.rating / 2)?.slice(0, 4)} color="success" />}</span></Typography>
                        </>
                      }
                    >
                      <InfoIcon
                        fontSize="small"
                        style={{ fontSize: "16px", cursor: "pointer" }}
                        onMouseEnter={() => getTutorDetails(tutor.tutor_id)}
                        onMouseLeave={() => setTutorDetails(null)}
                      />
                    </HtmlTooltip>
                  </span>
                  {tutor.medium == "wa" && (
                    <span>
                      <WhatsappOutlinedIcon
                        fontSize="small"
                        color="success"
                        style={{ marginRight: "5px", fontSize: "17px" }}
                      />
                    </span>
                  )}
                  {tutor.medium == "mail" && (
                    <span>
                      <MarkEmailReadOutlinedIcon
                        fontSize="small"
                        color="success"
                        style={{ marginRight: "5px", fontSize: "17px" }}
                      />
                    </span>
                  )}
                  {tutor.medium == "wa-mail" && (
                    <span>
                      <WhatsappOutlinedIcon
                        fontSize="small"
                        color="success"
                        style={{ marginRight: "5px", fontSize: "17px" }}
                      />{" "}
                      <MarkEmailReadOutlinedIcon
                        fontSize="small"
                        color="success"
                        style={{ marginRight: "5px", fontSize: "17px" }}
                      />
                    </span>
                  )}
                  {/* <span>
                    &nbsp; &nbsp;
                    <Chip
                      size="small"
                      // onClick={handleClick}
                      // onDelete={handleDelete}
                      icon={
                        <StarPurple500SharpIcon
                          style={{ color: "#ffff", fontSize: "14px" }}
                        />
                      }
                      label={("" + tutor.rating / 2)?.slice(0, 4)}
                      color="success"
                    />
                  </span> */}
                  {/* {!tutor?.cancel_tutor ? (
                    <span
                      style={{ float: 'right', cursor: 'pointer' }}
                      onClick={() =>
                        handleCancelTutor(tutor.tutor_id, sessionId)
                      }
                    >
                      <DoNotDisturbIcon />
                    </span>
                  ) : (
                    <span
                      style={{ float: 'right' }}
                    >
                      <CancelIcon />
                    </span>
                  )} */}
                </div>
                <hr
                  style={{
                    width: "70%",
                    marginLeft: "0px",
                    marginBottom: "8px",
                  }}
                />
              </>
            ))}
          </div>
        </TabPanel>
        <TabPanel value="3" style={{ padding: "15px" }}>
          <div>
            {assigned_tutors && assigned_tutors.length > 0 ? (
              assigned_tutors?.map((tutor, index) => (
                <div
                  style={{
                    backgroundImage: `url(${
                      tutor?.tutor_cancelled &&
                      tutor?.tutor_cancelled === "cancelled" &&
                      cancelPic1
                    })`,
                    backgroundSize: "10rem",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right",
                  }}
                >
                  <div key={index} style={{ padding: "10px 0px" }}>
                    <span style={{ fontWeight: "800" }}>
                      {shortText(tutor.name)}
                    </span>
                    <span>&nbsp;{tutor.tutor_id}</span>
                    &nbsp;
                    <span>
                      <HtmlTooltip
                        placement="top"
                        title={
                        <>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Highest Degree: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.highest_degree}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Department: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.dept}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>College/s: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.academic_info && tutorDetails?.academic_info[0]?.college.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>WhatsApp: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.wa_id}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Subjects known: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.subjects && tutorDetails?.subjects.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Tags: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.tags && tutorDetails?.tags.toString()}</span></Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px'}}>Rating: <span style={{fontSize: '12px', fontWeight: 'normal'}}>{tutorDetails?.rating && <Chip size="small" icon={ <StarPurple500SharpIcon style={{ color: "#ffff", fontSize: "14px" }} /> } label=
                          {
                            tutorDetails?.rating && tutor?.session_rating
                              ? (
                                  "" +
                                  (+tutorDetails?.rating + +tutor?.session_rating) / 4
                                )?.slice(0, 4)
                              : tutorDetails?.rating && !tutor?.session_rating
                              ? ("" + tutorDetails?.rating / 2)?.slice(0, 4)
                              : !tutorDetails?.rating && tutor?.session_rating
                              ? ("" + tutor?.session_rating / 2)?.slice(0, 4)
                              : "N/A"
                          } color="success" />}</span>
                          </Typography>
                          <Typography color="inherit" style={{fontSize: '13.5px', fontWeight: '600', marginBottom: '5px', marginTop: '10px', display: 'flex', justifyContent: 'right'}}>
                              {(!tutor?.tutor_cancelled || (tutor?.tutor_cancelled && tutor?.tutor_cancelled!=="cancelled")) && <button
                                style={{
                                  backgroundColor: '#ffff',
                                  color: '#FF0000',
                                  border: '0.5px solid #FF0000',
                                  borderRadius: '3px',
                                  height: '23px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                }}
                                onClick={() =>
                                  handleCancelAssignedTutor(tutor.name,tutor.wa_id,tutor.tutor_id)
                                }
                              >
                                Cancel Tutor
                              </button>}
                          </Typography>
                        </>
                        }
                      >
                        <InfoIcon
                          fontSize="small"
                          style={{ fontSize: "16px", cursor: "pointer" }}
                          onMouseEnter={() => getTutorDetails(tutor.tutor_id)}
                          onMouseLeave={() => setTutorDetails(null)}
                        />
                      </HtmlTooltip>
                    </span>
                    {/* <span>
                      &nbsp; &nbsp;
                      <Chip
                        size="small"
                        // onClick={handleClick}
                        // onDelete={handleDelete}
                        icon={
                          <StarPurple500SharpIcon
                            style={{ color: "#ffff", fontSize: "14px" }}
                          />
                        }
                        label={
                          tutor?.rating && tutor?.session_rating
                            ? (
                                "" +
                                (+tutor?.rating + +tutor?.session_rating) / 4
                              )?.slice(0, 4)
                            : tutor?.rating && !tutor?.session_rating
                            ? ("" + tutor?.rating / 2)?.slice(0, 4)
                            : !tutor?.rating && tutor?.session_rating
                            ? ("" + tutor?.session_rating / 2)?.slice(0, 4)
                            : "N/A"
                        }
                        color="success"
                      />
                    </span> */}
                    {tutor?.acceptance_status == "accepted" && (
                      <span
                        style={{
                          color: "green",
                          fontSize: "14px",
                          marginLeft: "10px",
                        }}
                      >
                        <Chip size="small" label="accepted" color="success" />
                      </span>
                    )}
                    <span style={{ float: "right",width: "110px",marginLeft:"15px" }}>
                      <span>
                        <div style={{ fontWeight: "800",marginBottom:"5px"}}>
                          {(tutor.tutor_id===assgnTutorId &&  editTutorAmt) ? (
                            <span style={{ fontWeight: "800" }}>
                              <input
                                key={index}
                                type="number"
                                style={{
                                  width: "30%",
                                  height: "20px",
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
                              {!tutor?.tutor_cancelled ? (
                                <button
                                  style={{
                                    backgroundColor: "#1876D1",
                                    color: "#ffff",
                                    border: "none",
                                    borderRadius: "2px",
                                    height: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={()=>tutorAmtHandler(tutor?.tutor_id)}
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
                          ):
                          (
                            <div style={{ fontWeight: "800",marginBottom:"5px" }}>
                              <>
                              <span>{tutor?.tutor_dealt_amount ? `${(tutor?.tutor_dealt_amount) / 100} INR` : `--- INR`}</span>
                                &nbsp;
                                <span style={{ cursor: "pointer" }}>
                                  <EditIcon
                                    key={index}
                                    fontSize="x-small"
                                    style={{ fontSize: "15px" }}
                                    onClick={(e) => editTutorAmtFunc(e,tutor.tutor_id,index)}
                                  />
                                </span>
                              </>
                            </div>
                          ) 
                          }
                        </div>
                      </span>
                      {tutor?.session_rating && !tutor?.tutor_cancelled ? (
                        <Button
                          variant="contained"
                          size="small"
                          style={{ maxWidth: "52px" }}
                          onClick={() => handleOpenTutorPayment(index, tutor)}
                        >
                          Pay
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          style={{ maxWidth: "52px" }}
                          disabled
                        >
                          Pay
                        </Button>
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      marginRight: "5px",
                      marginBottom: "12px",
                    }}
                  >
                    <span>
                      &nbsp;
                      {!disableRateBtn &&
                      tutor?.tutor_unassigned == "assigned" ? (
                        <Chip
                          style={{
                            cursor: "pointer",
                          }}
                          size="small"
                          label="Rating & Reviews"
                          variant="outlined"
                          onClick={() =>
                            handleTutorRating(
                              tutor.rating_and_reviews,
                              tutor.tutor_id
                            )
                          }
                        />
                      ) : (
                        <Chip
                          style={{ cursor: "pointer" }}
                          size="small"
                          label="Rating & Reviews"
                          variant="outlined"
                          disabled
                        />
                      )}
                    </span>
                    &nbsp;
                    <span>
                      <HtmlTooltip
                        placement="top"
                        title={
                          <>
                            <span style={{ marginBottom: "10px" }}>
                              Last 5 reviews and rating
                            </span>
                            {tutorDetails?.rating_and_reviews
                              ?.slice(
                                Math.max(tutorDetails?.rating_and_reviews?.length - 5, 0)
                              )
                              ?.map((el, index) => (
                                <Typography
                                  color="inherit"
                                  style={{
                                    fontSize: "13.5px",
                                    fontWeight: "600",
                                    marginTop: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    {el.reviews && `- ${el.reviews}  [${el.rating}☆]`}
                                  </span>
                                </Typography>
                              ))}
                          </>
                        }
                      >
                        <InfoIcon
                          fontSize="small"
                          style={{ fontSize: "16px" }}
                        />                      
                      </HtmlTooltip>
                    </span>
                    {tutor?.tutor_unassigned == "assigned" ? (
                      <span style={{ marginLeft: "20px" }}>
                        <Chip
                          style={{ cursor: "pointer" }}
                          size="small"
                          label="assigned"
                          onClick={() =>
                            handleUnAssignTutor(tutor.tutor_id, "unassigned")
                          }
                        />
                      </span>
                    ) : (
                      <span style={{ marginLeft: "20px" }}>
                        <Chip
                          style={{ cursor: "pointer" }}
                          size="small"
                          label="unassigned"
                          variant="outlined"
                          onClick={() =>
                            handleUnAssignTutor(tutor.tutor_id, "assigned")
                          }
                        />
                      </span>
                    )}
                    {/* {(tutor?.tutor_cancelled && tutor?.tutor_cancelled==="cancelled") ? (
                      <span style={{ marginLeft: '20px' }}>
                        <Chip
                          style={{ cursor: 'pointer' }}
                          size='small'
                          label='cancelled'
                          disabled
                        />
                      </span>
                    ) : !tutor?.tutor_cancelled && tutor?.tutor_unassigned == 'assigned' ? (
                      <span style={{ marginLeft: '20px' }}>
                        <Chip
                          style={{ cursor: 'pointer' }}
                          size='small'
                          label='assigned'
                          onClick={() =>
                            handleUnAssignTutor(tutor.tutor_id, 'unassigned')
                          }
                        />
                      </span>
                    ) : (
                      <span style={{ marginLeft: '20px' }}>
                        <Chip
                          style={{ cursor: 'pointer' }}
                          size='small'
                          label='unassigned'
                          variant='outlined'
                          onClick={() =>
                            handleUnAssignTutor(tutor.tutor_id, 'assigned')
                          }
                        />
                      </span>
                    )} */}
                    {/* <span style={{marginLeft:"47px"}}>
                      {(!tutor?.tutor_cancelled || (tutor?.tutor_cancelled && tutor?.tutor_cancelled!=="cancelled") ) &&  (
                        <Button
                          variant="contained"
                          style={{
                            border:"none",
                            borderRadius: '5px',
                            height: '25px',
                            borderRadius:"5px",
                            backgroundColor:"#df0303",
                            color:"#ffff",
                            width:"70px"

                          }}
                          onClick={()=>handleCancelAssignedTutor(tutor.name,tutor.wa_id,tutor.tutor_id)}

                        >
                          cancel
                        </Button>
                      )}
                    </span> */}
                  </div>
                  <p
                    style={{
                      margin: "0px",
                      fontSize: "12.5px",
                      color: "chocolate",
                    }}
                  >
                    All Payments: &nbsp; {tutor?.pout_info && tutor?.pout_info.length > 0 && <div style={{cursor: 'pointer', float: 'right'}} onClick={() => tutorPayoutStatus(tutor.wa_id, tutor.pout_info)}><RefreshIcon fontSize='medium' /></div>}
                    <span>
                      {tutor?.pout_info &&
                        filterArr(
                          tutor?.pout_info.sort((a, b) => {
                            return b.created_at - a.created_at;
                          }),
                          (it) => it.id
                        ).map((i) => (
                          <>
                            <p style={{ margin: "5px 0px" }}>
                              {i.amount / 100} {i.currency}
                              {" (" + i.status + ")"}
                              {" [TDS ("}
                              {i.notes.TDS}
                              {" INR)"}
                              {" Amount ("}
                              {+i.amount / 100 + i.notes.TDS}
                              {" INR)]"}
                              {' [Payment ID: '}
                              {i.id.replace('pout_', '')}
                              {']'}
                            </p>
                          </>
                        ))}
                    </span>
                  </p>
                  <hr
                    style={{
                      width: "70%",
                      marginLeft: "0px",
                      marginBottom: "8px",
                    }}
                  />
                </div>
              ))
            ) : (
              <div>No Tutors Assigned</div>
            )}
            {showTutorRatingBox && (
              <TutorRatingAndReviews
                rating_and_reviews={assgnTutorRating}
                tutorId={assgnTutorId}
                handleAssignTutorRating={handleAssignTutorRating}
                setShowTutorRatingBox={setShowTutorRatingBox}
                showTutorRatingBox={showTutorRatingBox}
                setStoreTutorRating={setStoreTutorRating}
              />
            )}
          </div>
        </TabPanel>
        <Dialog open={openPayment} onClose={handleCloseTutorPayment}>
          <DialogTitle>Tutor Payment</DialogTitle>
          {paymentLoading && !paymentSuccess ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "120px 200px",
              }}
            >
              <CircularProgress
                style={{ alignSelf: "center", marginBottom: "30px" }}
              />
              <em>Payment Processing...</em>
            </div>
          ) : paymentLoading && paymentSuccess ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "120px 200px",
              }}
            >
              <em>Payment {tutorPayout?.payload?.payout?.entity?.status}</em>
            </div>
          ) : (
            <DialogContent>
              <label style={{ fontSize: "13px" }}>Tutor Name</label>
              <TextField
                // autoFocus
                margin="dense"
                id="name"
                // label="Session ID"
                // placeholder="Session ID"
                type="text"
                value={tutorName}
                fullWidth
                variant="standard"
                style={{ marginBottom: "30px" }}
              />

              <label style={{ fontSize: "13px" }}>Amount</label>
              <TextField
                // autoFocus
                margin="dense"
                id="name"
                // label="Session ID"
                // placeholder="Session ID"
                type="number"
                value={tutorAmt}
                onChange={handleChangeTutorAmt}
                style={{ marginBottom: "5px" }}
                fullWidth
                variant="standard"
                autoComplete="off"
                required
              />
              <div style={{ marginBottom: "27px", fontSize: "13px" }}>
                Actual amount:{" "}
                {!checked && tutorData?.pan && tutorAmt
                  ? tutorAmt - tutorAmt * 0.1
                  : !checked && !tutorData?.pan && tutorAmt
                  ? tutorAmt - tutorAmt * 0.2
                  : checked
                  ? tutorAmt
                  : "0"}{" "}
                INR, TDS:{" "}
                {!checked && tutorData?.pan && tutorAmt
                  ? tutorAmt * 0.1
                  : !checked && !tutorData?.pan && tutorAmt
                  ? tutorAmt * 0.2
                  : checked
                  ? "0"
                  : "0"}{" "}
                INR{" "}
                <span>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleTDS}
                        defaultChecked
                        size="small"
                        style={{ padding: "0px 4px" }}
                      />
                    }
                    label="Without TDS"
                    style={{ marginLeft: "20px" }}
                  />
                </span>
              </div>
              <div></div>
              <FormControl component="fieldset">
                <FormLabel component="legend">Choose Payment Option</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="row-radio-buttons-group"
                  onChange={handlePayMode}
                >
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label="Bank Transfer"
                  />
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label="UPI Transfer"
                  />
                </RadioGroup>
              </FormControl>
              <div style={{ marginTop: "20px" }}>
                {payOption === "bank" ? (
                  <>
                    <label style={{ fontSize: "13px" }}>Account Number</label>
                    <TextField
                      // autoFocus
                      margin="dense"
                      id="name"
                      // label="Session ID"
                      // placeholder="Session ID"
                      type="text"
                      value={accNo}
                      style={{ marginBottom: "27px" }}
                      fullWidth
                      variant="standard"
                    />
                    <label style={{ fontSize: "13px" }}>IFSC</label>
                    <TextField
                      // autoFocus
                      margin="dense"
                      id="name"
                      // label="Session ID"
                      // placeholder="Session ID"
                      type="text"
                      value={ifsc}
                      style={{ marginBottom: "27px" }}
                      fullWidth
                      variant="standard"
                    />
                    <p style={{ fontSize: "13px", padding: "3px 0px 8px 0px" }}>
                      Mode
                    </p>
                    <NativeSelect
                      defaultValue="NEFT"
                      inputProps={{
                        name: "amount",
                        id: "uncontrolled-native",
                      }}
                      // style={{ width: '20%', padding: '6px 5px', marginTop: '8px', fontSize: '14px'}}
                      onChange={handleChangePayMode}
                    >
                      <option value="IMPS">IMPS</option>
                      {/* <option value='NEFT'>NEFT</option>
                      <option value='RTGS'>RTGS</option> */}
                    </NativeSelect>
                  </>
                ) : payOption === "upi" ? (
                  <>
                    {upiId ? (
                      <>
                        <label style={{ fontSize: "13px" }}>UPI ID</label>
                        <TextField
                          // autoFocus
                          margin="dense"
                          id="upi"
                          // label="Session ID"
                          // placeholder="Session ID"
                          type="text"
                          value={upiId}
                          style={{ marginBottom: "27px" }}
                          fullWidth
                          variant="standard"
                          autoComplete="off"
                        />
                      </>
                    ) : (
                      <p style={{ textAlign: "center", color: "gray" }}>
                        UPI ID is not Available
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            </DialogContent>
          )}
          {tutorAmt >= 10000 && (
            <DialogContent>
              <div style={{ fontSize: "12px", color: "red" }}>
                *Tutor amount should be less than 10,000 INR
              </div>
            </DialogContent>
          )}
          {paymentLoading && !paymentSuccess ? (
            <em
              style={{
                textAlign: "center",
                marginBottom: "45px",
                color: "coral",
              }}
            >
              #Please don't close this window
            </em>
          ) : paymentLoading && paymentSuccess ? (
            <DialogActions>
              <Button onClick={handleClosePayWindow}>Close</Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button onClick={handleCloseTutorPayment}>Cancel</Button>
              {tutorAmt > 0 && tutorAmt < 10000 && payOption ? (
                <Button onClick={payTutor}>Pay</Button>
              ) : (
                <Button disabled>Pay</Button>
              )}
            </DialogActions>
          )}
        </Dialog>
      </TabContext>
    </div>
  );
};

export default NotifiedTutors;
