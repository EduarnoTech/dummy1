import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext, useState } from "react";
import Messenger from "./pages/messenger/Messenger";
import Login from "./pages/login/Login";

function App() {
  const [userId, setUserId] = useState();
  const [pass, setPass] = useState();
  const [otp, setOtp] = useState();
  const [agent, setAgent] = useState();
  const [user, setUser] = useState(false);
  const [apiUrl, setApiUrl] = useState();
  const [apiKey, setApiKey] = useState();
  let login = localStorage.getItem("user");
  let agent_ = localStorage.getItem("agent");

  if(Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      console.log(permission)
    })
  }
  return (
    <Router>
      <Switch>
         <Route exact path="/">
           {user || login ? <Messenger apiUrl={apiUrl} apiKey={apiKey} /> : <Login userId={userId} setUserId={setUserId} agent={agent} setAgent={setAgent} pass={pass} setPass={setPass} setUser={setUser} setApiUrl={setApiUrl} setApiKey={setApiKey} otp={otp} setOtp={setOtp}/>}
         </Route>
         <Route exact path="/login">{user || login ? <Redirect to="/" /> : <Login userId={userId} setUserId={setUserId} agent={agent} setAgent={setAgent} pass={pass} setPass={setPass} setUser={setUser} setApiUrl={setApiUrl} setApiKey={setApiKey} otp={otp} setOtp={setOtp}/>}</Route>
         {/* <Route path="/">{user || login ? <Redirect to={`/${agent_}`} /> : <Login userId={userId} setUserId={setUserId} agent={agent} setAgent={setAgent} pass={pass} setPass={setPass} setUser={setUser} setApiUrl={setApiUrl} setApiKey={setApiKey} />}</Route> */}
      </Switch>
    </Router>
  );
}

export default App;
