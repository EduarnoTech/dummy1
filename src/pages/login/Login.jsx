import { useContext, useRef } from "react";
import "./login.css";
// import { loginCall } from "../../apiCalls";
// import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";

export default function Login({
  userId,
  setUserId,
  agent,
  setAgent,
  pass,
  setPass,
  setUser,
  setApiUrl,
  setApiKey,
  otp,
  setOtp,
}) {
  const email = useRef();
  const password = useRef();
  //   const { isFetching, dispatch } = useContext(AuthContext);

  //   const handleClick = (e) => {
  //     e.preventDefault();
  //     loginCall(
  //       { email: email.current.value, password: password.current.value },
  //       dispatch
  //     );
  //   };
  console.log(process.env.REACT_APP_API_194);

  // verify OTP
  const verifyUser = async (e) => {
    e.preventDefault();
    if (
      // otpMatched &&
      userId == process.env.REACT_APP_ID1 &&
      pass == process.env.REACT_APP_PASS1
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_194}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_194);
        setApiKey(process.env.REACT_APP_API_KEY_194);
        localStorage.setItem("api", process.env.REACT_APP_API_194);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_194);
        localStorage.setItem("device", "1");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "917761093194");
        localStorage.setItem(
          "namespace",
          "1ff427bd_e20d_4582_a530_e28f311cc595"
        );
        window.location.reload();
      } else if (verifyAgent.data.remark === "OTP Not Matched") {
        alert("OTP is not correct!");
        setUser(false);
        console.log("failed verify agent api");
      } else {
        alert("OTP is expired.Please send another");
        setUser(false);
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID2 &&
      pass == process.env.REACT_APP_PASS2
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_7091}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_7091);
        setApiKey(process.env.REACT_APP_API_KEY_7091);
        localStorage.setItem("api", process.env.REACT_APP_API_7091);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_7091);
        localStorage.setItem("device", "2");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "917091489698");
        localStorage.setItem(
          "namespace",
          "f02c5e46_b956_4160_abf2_e8f6cf283754"
        );
      } else {
        alert("OTP is not correct!");
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID3 &&
      pass == process.env.REACT_APP_PASS3
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_77618}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_77618);
        setApiKey(process.env.REACT_APP_API_KEY_77618);
        localStorage.setItem("api", process.env.REACT_APP_API_77618);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_77618);
        localStorage.setItem("device", "3");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "917761814102");
        localStorage.setItem(
          "namespace",
          "1ff427bd_e20d_4582_a530_e28f311cc595"
        );
      } else {
        alert("OTP is not correct!");
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID4 &&
      pass == process.env.REACT_APP_PASS4
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_8777}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_8777);
        setApiKey(process.env.REACT_APP_API_KEY_8777);
        localStorage.setItem("api", process.env.REACT_APP_API_8777);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_8777);
        localStorage.setItem("device", "4");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "918777592248");
        localStorage.setItem(
          "namespace",
          "1ff427bd_e20d_4582_a530_e28f311cc595"
        );
      } else {
        alert("OTP is not correct!");
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID5 &&
      pass == process.env.REACT_APP_PASS5
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_9065}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_9065);
        setApiKey(process.env.REACT_APP_API_KEY_9065);
        localStorage.setItem("api", process.env.REACT_APP_API_9065);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_9065);
        localStorage.setItem("device", "5");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "919065650479");
        localStorage.setItem(
          "namespace",
          "f02c5e46_b956_4160_abf2_e8f6cf283754"
        );
      } else {
        alert("OTP is not correct!");
        setUser(false);
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID6 &&
      pass == process.env.REACT_APP_PASS6
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_7070}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_7070);
        setApiKey(process.env.REACT_APP_API_KEY_7070);
        localStorage.setItem("api", process.env.REACT_APP_API_7070);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_7070);
        localStorage.setItem("device", "6");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "917070505631");
        localStorage.setItem(
          "namespace",
          "f02c5e46_b956_4160_abf2_e8f6cf283754"
        );
      } else {
        alert("OTP is not correct!");
        console.log("failed verify agent api");
      }
    } else if (
      userId == process.env.REACT_APP_ID7 &&
      pass == process.env.REACT_APP_PASS7
    ) {
      const verifyAgent = await axios.post(
        `${process.env.REACT_APP_API_9661}/api/agent/verifyOtp`,
        {
          otp: otp,
          agent: agent,
        }
      );
      const otpMatched = verifyAgent?.data?.success;
      console.log({ otpMatched });

      if (verifyAgent.data.success) {
        setUser(true);
        localStorage.setItem("user", true);
        setApiUrl(process.env.REACT_APP_API_9661);
        setApiKey(process.env.REACT_APP_API_KEY_9661);
        localStorage.setItem("api", process.env.REACT_APP_API_9661);
        localStorage.setItem("api_key", process.env.REACT_APP_API_KEY_9661);
        localStorage.setItem("device", "7");
        localStorage.setItem("agent", agent);
        localStorage.setItem("waid", "919661126925");
        localStorage.setItem(
          "namespace",
          "3b25ca9e_e7fe_45a1_acd2_224e4fd396d8"
        );
      } else {
        alert("OTP is not correct!");
        console.log("failed verify agent api");
      }
    } else {
      setUser(false);
      alert("Login Failed! UserID or password is incorrect.");
    }
  };

  // send Otp
  const sendOtp = async () => {
    if (
      // otpMatched &&
      userId == process.env.REACT_APP_ID1 &&
      pass == process.env.REACT_APP_PASS1
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_194}/api/agent/sendOtp`,
          {
            device: "Device1",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID2 &&
      pass == process.env.REACT_APP_PASS2
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_7091}/api/agent/sendOtp`,
          {
            device: "Device2",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID3 &&
      pass == process.env.REACT_APP_PASS3
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_77618}/api/agent/sendOtp`,
          {
            device: "Device3",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID4 &&
      pass == process.env.REACT_APP_PASS4
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_8777}/api/agent/sendOtp`,
          {
            device: "Device4",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID5 &&
      pass == process.env.REACT_APP_PASS5
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_9065}/api/agent/sendOtp`,
          {
            device: "Device5",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID6 &&
      pass == process.env.REACT_APP_PASS6
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_7070}/api/agent/sendOtp`,
          {
            device: "Device6",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else if (
      userId == process.env.REACT_APP_ID7 &&
      pass == process.env.REACT_APP_PASS7
    ) {
      if (
        agent &&
        (agent === process.env.REACT_APP_AGENT_ADMIN ||
          agent === process.env.REACT_APP_AGENT_1 ||
          agent === process.env.REACT_APP_AGENT_2 ||
          agent === process.env.REACT_APP_AGENT_3 ||
          agent === process.env.REACT_APP_AGENT_4)
      ) {
        const sendOtp = await axios.post(
          `${process.env.REACT_APP_API_9661}/api/agent/sendOtp`,
          {
            device: "Device7",
            agent: agent,
          }
        );
        if (sendOtp.data) {
          alert("OTP Sent");
          console.log("OTP is sent");
        } else {
          alert("OTP not sent. Try Again!");
          console.log("OTP is sent");
        }
      } else {
        alert("Please Enter Correct Agent's Name");
      }
    } else {
      alert("UserID or password is incorrect.");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Eduarno Chat Dashboard</h3>
        </div>
        <div className="loginRight">
          <form className="loginBox">
            <input
              placeholder="User ID"
              type="text"
              value={userId}
              required
              className="loginInput"
              onChange={(e) => setUserId(e.target.value)}
              ref={email}
            />
            <input
              placeholder="Agent Name"
              type="text"
              value={agent}
              className="loginInput"
              onChange={(e) => setAgent(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={pass}
              required
              minLength="6"
              className="loginInput"
              onChange={(e) => setPass(e.target.value)}
              ref={password}
            />
            <div style={{ display: "flex" }}>
              <input
                style={{ flex: "80%", height: "47px" }}
                placeholder="OTP"
                type="text"
                value={otp}
                required
                minLength="4"
                className="loginInput"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                style={{
                  flex: "20%",
                  height: "50px",
                  marginLeft: "10px",
                  backgroundColor: "#25d366",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                }}
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>
            <button className="loginButton" type="submit" onClick={verifyUser}>
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            {/* <button className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}
