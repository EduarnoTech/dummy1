import React, { useState, useRef, useEffect } from 'react';
import './forwardMsg.css';
import axios from 'axios';
import { msgUrl, sendMsgUrl, sendFileUrl } from '../../serviceUrls/Message-Services';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Pagination from '@mui/material/Pagination';


const ForwardMsg = ({
  apiKey,
  // conversations,
  visible,
  setVisible,
  forward,
  setForwarded,
  forwarded,
  mulForward,
  setMulForward,
  setForwardMsg,
  getCustomersUrl,
  // contactPage,
  // handleContactList,
  // contactListLoading,
 
}) => {
  const [check, setCheck] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(false);
  const [removedNum, setRemovedNum] = useState();
  const [conversationsForward,setConversationsForward]=useState()
  const [convCount,setConvCount] =useState()
  const [contactListLoading,setContactListLoading] =useState(false)
  const [contactPage,setContactPage] =useState(1)

  const show = useRef();
  // console.log(conversations);

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
        setConversationsForward(res?.data?.result);
        setConvCount(res?.data?.length);
      } catch (err) {
        console.log(err.Error);
      }
    };
    getConversations();
  }, []);
 
  const closeModal = () => {
    // show.current.style.display = 'none'
    setVisible(false);
    setMulForward([]);
  };

  console.log(forward)

  const handleCheck = (val) => {
    if(check.find(element => element == val)) {
      let index = check.indexOf(val);
      let removedNo = check.splice(index, 1);
      console.log(check)
      setCheck(check);
      console.log(removedNo)
      setRemovedNum(removedNo[0])
      setColor(false);
    }
    else {
      setCheck([...check, val]);
      setColor(true);
    }
  };
  console.log(check);

  const handleSend = async (user) => {
    setLoading(true);
    if(mulForward.length > 0) {
    for(let k = 0; k < mulForward.length; k++) {
      for (let i = 0; i < check.length; i++) {
        if(mulForward[k].type === 'text') {
        const payload = {
          recipient_type: 'individual',
          to: check[i],
          conversationId: '',
          name: '',
          from: '',
          wa_id: check[i],
          text: {
            body: mulForward[k].data.body
          },
          type: mulForward[k].type,
          data: '',
          isOwner: true,
        };
        try {
          const res = await axios.post(
            sendMsgUrl,
            payload,
            {
              headers: '',
            }
          );
          closeModal();
          setForwarded(!forwarded);
          setMulForward([]);
          //   setMessages([...messages, res.data.message]);
          //   console.log(res);
          //   setUserId(currentChat?.wAid);
          //   setMessageId(res.data.message.whatsappMessageId);
          //   setNewMessage('');
          setForwardMsg('Message forwarded!');
          setLoading(false);
        } catch (err) {
          setForwardMsg('Something went wrong!');
          setMulForward([]);
          console.log(err);
        }
      }
      else {
        const payload = {
          recipient_type: 'individual',
          to: check[i],
          type: mulForward[k].type,
          data: {
            id: mulForward[k]?.data?.id,
            // caption: forward.data.caption,
            filename: mulForward[k]?.data?.filename && mulForward[k]?.data?.filename
          },
          name: '',
          from: '',
          wa_id: check[i],
          timestamp: '',
          operatorName: '',
          isOwner: true,
          status: '',
          ticketId: '',
          eventType: '',
        };
        try {
          const res = await axios.post(
            sendFileUrl,
            payload,
            {
              headers: {
                'D360-API-KEY': apiKey || localStorage.getItem("api_key"),
              },
            }
          );
          closeModal();
          setForwarded(!forwarded);
          setMulForward([]);
          //   setMessages([...messages, res.data.message]);
          //   console.log(res);
          //   setUserId(currentChat?.wAid);
          //   setMessageId(res.data.message.whatsappMessageId);
          //   setNewMessage('');
          setForwardMsg('Message forwarded!');
          setLoading(false);
        } catch (err) {
          setForwardMsg('Something went wrong!');
          console.log(err);
        }
      }
      }
    }
  }
    else {
    for (let i = 0; i < check.length; i++) {
      if(forward.type === 'text') {
      const payload = {
        recipient_type: 'individual',
        to: check[i],
        conversationId: '',
        name: '',
        from: '',
        wa_id: check[i],
        text: {
          body: forward.data.body
        },
        type: forward.type,
        data: '',
        isOwner: true,
      };
      try {
        const res = await axios.post(
          sendMsgUrl,
          payload,
          {
            headers: '',
          }
        );
        closeModal();
        setForwarded(!forwarded);
        setMulForward([]);
        setForwardMsg('Message forwarded!');
        setTimeout(() => {
          setForwardMsg(null);
        }, 1000);
        //   setMessages([...messages, res.data.message]);
        //   console.log(res);
        //   setUserId(currentChat?.wAid);
        //   setMessageId(res.data.message.whatsappMessageId);
        //   setNewMessage('');
        setLoading(false);
      } catch (err) {
        setForwardMsg('Something went wrong!');
        console.log(err);
      }
    }
    else {
      const payload = {
        recipient_type: 'individual',
        to: check[i],
        type: forward.type,
        data: {
          id: forward.data.id,
          caption: forward.data.caption,
          filename: forward?.data?.filename && forward?.data?.filename
        },
        name: '',
        from: '',
        wa_id: check[i],
        timestamp: '',
        operatorName: '',
        isOwner: true,
        status: '',
        ticketId: '',
        eventType: '',
      };
      try {
        const res = await axios.post(
          sendFileUrl,
          payload,
          {
            headers: {
              'D360-API-KEY': apiKey || localStorage.getItem("api_key"),
            },
          }
        );
        closeModal();
        setForwarded(!forwarded);
        setMulForward([]);
        //   setMessages([...messages, res.data.message]);
        //   console.log(res);
        //   setUserId(currentChat?.wAid);
        //   setMessageId(res.data.message.whatsappMessageId);
        //   setNewMessage('');
        setForwardMsg('Message forwarded!');
        setLoading(false);
      } catch (err) {
        setForwardMsg('Something went wrong!');
        console.log(err);
      }
    }
    }
  }
  };
  // const handleSearch = (e) => {
  //   setSearch(e.target.value);
  // };
  // const filteredCoversation = conversationsForward?.filter((f) => {
  //   return (
  //     f.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
  //     f.uid.indexOf(search.toLowerCase()) !== -1
  //   );
  // });
  const filteredCoversation = conversationsForward;
  const handleSearch = async (e) => {
    let agent = localStorage.getItem('agent');
    setSearch(e.target.value);
    // if (e.key == 'Control') {
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
        setConversationsForward(res?.data?.result);
        setConvCount(res?.data?.length);
        setContactPage(1);
        // setTutorListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);
      } catch (err) {
        console.log(err);
      }
    // }
  };

  const handleContactList = async (event, value) => {
    let agent = localStorage.getItem('agent');
    if (search) {
      setContactListLoading(true);
      setContactPage(value);
      try {
        const res = await axios.get(
          getCustomersUrl + `/${agent}/${search}`,
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
        setConversationsForward(res?.data?.result);
        setContactListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);

        // setSaved(null);
        // setUpdated(null);
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
        setConversationsForward(res?.data?.result);
        setContactListLoading(false);
        // setLoadingMsg(false);
        // setPage(page + 1);

        // setSaved(null);
        // setUpdated(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <div id='id01' className='modal' ref={show}>
        <form className='modal-content'>
          <header
            style={{
              height: '95px',
              backgroundColor: '#04787c',
              position: 'absolute',
              width: '436px',
              borderRadius: '4px 4px 0px 0px',
            }}
          >
            <CloseIcon
              fontSize='medium'
              style={{
                color: '#cccc',
                margin: '12px 10px -5px 10px',
                cursor: 'pointer',
              }}
              onClick={closeModal}
            />
            <span
              style={{
                fontSize: '19px',
                margin: '0px 0px 0px 10px',
                fontWeight: '400',
                color: '#ffff',
              }}
            >
              Forward message to
            </span>
            {loading ? <CircularProgress
              style={{
                color: '#ffff',
                margin: '0px 0px -5px 169px',
                height: '28px',
                width: '28px'
              }}
            /> : check.length > 0 ? <SendIcon
              style={{
                color: `#ffff`,
                margin: '0px 0px -5px 170px',
                cursor: 'pointer',
              }}
              onClick={handleSend}
            /> :
            <SendIcon
              style={{
                color: '#cccc',
                margin: '0px 0px -5px 170px',
                cursor: 'default',
              }}
            />
            }
            <input
              placeholder='Search for users'
              className='searchConversation'
              onChange={(e) => handleSearch(e)}
            />
          </header>

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
          ) :<div className='container'>
            {filteredCoversation &&
              filteredCoversation?.map((i) => (
                <div
                  className={check.find(element => element == i.wa_id) ? 'selected_card' : removedNum == i.wa_id ? 'card' : 'card'}
                  onClick={() => handleCheck(i.wa_id)}
                >
                  {/* <input
                    type='checkbox'
                    id={i.wa_id}
                    name={i.wa_id}
                    value={i.wa_id}
                    onClick={(e) => handleCheck(e.target.value)}
                  /> */}
                  {check.find(element => element == i.wa_id) && <CheckCircleIcon fontSize='small' style={{color: 'rgb(11 145 102)'}} />}
                  <label for={i.id} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    {i.name}{' ['}{'ED'+i.uid}]
                  </label>
                </div>
              ))}
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '8px',
                }}
                count={Math.ceil(convCount / 20)}
                page={contactPage}
                onChange={handleContactList}
              />
          </div>}
        </form>
      </div>
    </div>
  );
};

export default ForwardMsg;
