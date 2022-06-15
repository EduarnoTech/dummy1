import { useEffect, useState } from 'react';
import './message.css';
import { format } from 'timeago.js';
import moment from 'moment';
import axios from 'axios';
import ReplyIcon from '@material-ui/icons/Reply';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { getFileUrl } from '../../serviceUrls/Message-Services';
import { headerKey } from '../../serviceUrls/ApiHeaderKey';
import ReactAudioPlayer from 'react-audio-player';
import Checkbox from '@mui/material/Checkbox';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Message = ({
  apiUrl,
  message,
  msgArr,
  own,
  ownAlt,
  setForward,
  mulForward,
  setMulForward,
  setVisible,
  showSelector,
  setShowSelector,
  status
}) => {
  const [fileData, setFileData] = useState();
  const [image, setImage] = useState();
  const [context, setContext] = useState();
  const [fileType, setFileType] = useState();
  const [check, setCheck] = useState();

  console.log('stat', status)

  console.log(message);

  useEffect(() => {
    const getImg = async () => {
      try {
        if (
          message.type == 'image' ||
          message.type == 'video' ||
          message.type == 'document' ||
          message.type == 'voice' ||
          message.type == 'audio' ||
          (message?.messages && message?.messages[0]?.type == 'image') ||
          (message?.messages && message?.messages[0]?.type == 'video') ||
          (message?.messages && message?.messages[0]?.type == 'voice') ||
          (message?.messages && message?.messages[0]?.type == 'audio') ||
          (message?.messages && message?.messages[0]?.type == 'document')
        ) {
          await fetch(
            `https://waba.360dialog.io/v1/media/${
              message?.data?.id ||
              (message?.messages &&
                message?.messages[0]?.[message?.messages[0]?.type]?.id)
            }`,
            {
              headers: { ...headerKey },
            }
          )
            .then((res) => res.blob())
            .then((blob) => {
              setImage(() => URL.createObjectURL(blob));
            });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getImg();

    const getContext = async () => {
      if (
        (message?.context && message?.context?.id) ||
        (message?.messages && message?.messages[0]?.context)
      ) {
        try {
          const res = await axios.get(
            `${apiUrl || localStorage.getItem('api')}/api/messages/findMsg/${
              message?.context?.id ||
              (message?.messages && message?.messages[0]?.context?.id)
            }`
          );
          if (res.data[0].eventType === 'template') {
            setContext(res.data[0].templateText);
            console.log(res.data[0]);
          } else if (res.data[0].type === 'text') {
            setContext(res.data[0].text.body);
          } else if (
            res.data[0].type === 'image' ||
            res.data[0].type === 'video' ||
            res.data[0].type === 'document'
          ) {
            setFileType(res.data[0].type);
            await fetch(
              `https://waba.360dialog.io/v1/media/${res.data[0].data?.id}`,
              {
                headers: { ...headerKey },
              }
            )
              .then((res) => res.blob())
              .then((blob) => {
                setContext(() => URL.createObjectURL(blob));
              });
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    getContext();
    
  }, [message]);

  
  console.log(image);

  // const handleCheck = (val) => {
  //   if(mulForward.find(element => element == val)) {
  //     let index = mulForward.indexOf(val);
  //     mulForward.splice(index, 1);
  //   }
  //   else if() {
  //     message.type === 'image' ||
  //             message.type === 'video' ||
  //             message.type === 'document'
  //               ? setMulForward([...mulForward, { type: message.type, data: message.data }]) : setMulForward([...mulForward, { type: message.type, data: message.text }])
  //   }
  // }

  console.log(mulForward);

  return (
    <>
      {message.eventType === 'template' ? (
        <div className='temp_message'>
          <p className='temp_messageText'>{message.templateText}</p>
        </div>
      ) : message.eventType === 'note' ? (
        <div className='note_message'>
          <p className='note_messageText'>
            <span style={{color: message?.clientNotes?.priority === 'high' ? 'red' : message?.clientNotes?.priority === 'medium' ? 'royalblue' : '#9b9b9b', fontSize: '12px', fontWeight: '700'}}>NOTE: </span>
            {message.clientNotes.noteText}
          </p>
        </div>
      ) : (
        <div className={own || ownAlt ? 'message own' : 'message'}>
          <div className={own || ownAlt ? 'messageTop _own_' : 'messageTop'}>
            {showSelector && (
              <Checkbox
                size='small'
                style={{ placeSelf: 'center', marginRight: '15px' }}
                // id={i._id}
                // name={i._id}
                // value={i.wa_id}
                onChange={() => {
                  if (
                    mulForward?.find(
                      (element) =>
                        (element?.data?.body &&
                          element?.data?.body == message?.text?.body) ||
                        (element?.data?.body &&
                          message?.messages &&
                          element?.data?.body ==
                            message?.messages[0]?.[message?.messages[0]?.type]
                              .body) ||
                        (element?.data?.id &&
                          element?.data?.id == message?.data?.id) ||
                        (element?.data?.id &&
                          message?.messages &&
                          element?.data?.id ==
                            message?.messages[0]?.[message?.messages[0]?.type]
                              .id)
                    )
                  ) {
                    let index = mulForward?.findIndex(
                      (x) =>
                        (x?.data?.body &&
                          x?.data?.body === message?.text?.body) ||
                        (x?.data?.id && x?.data?.id === message?.data?.id) ||
                        (x?.data?.body &&
                          message?.messages &&
                          x?.data?.body ===
                            message?.messages[0]?.[message?.messages[0]?.type]
                              .body) ||
                        (x.data.id &&
                          message?.messages &&
                          x.data.id ===
                            message?.messages[0]?.[message?.messages[0]?.type]
                              .id)
                    );
                    mulForward.splice(index, 1);
                  } else {
                    setMulForward([
                      ...mulForward,
                      {
                        type:
                          message?.type ||
                          (message?.messages && message?.messages[0]?.type),
                        data:
                          message?.data ||
                          message.text ||
                          (message?.messages &&
                            message?.messages[0]?.[message?.messages[0]?.type]),
                      },
                    ]);
                    // : message?.type === 'text' ||
                    // message?.messages[0]?.type === 'text' ? setMulForward([
                    //     ...mulForward,
                    //     {
                    //       type:
                    //         message.type ||
                    //         (message?.messages && message?.messages[0]?.type),
                    //       data:
                    //         message.text ||
                    //         (message?.messages &&
                    //           message?.messages[0]?.text),
                    //     },
                    //   ]) : setMulForward([
                    //     ...mulForward,
                    //     {
                    //       type:
                    //         message.type ||
                    //         (message?.messages && message?.messages[0]?.type),
                    //       data:
                    //         message.text ||
                    //         (message?.messages &&
                    //           message?.messages[0]?.text),
                    //     },
                    //   ])
                  }
                }}
              />
            )}
            {message.type === 'image' ||
            (message?.messages && message?.messages[0]?.type == 'image') ? (
              <div className={own || ownAlt ? 'messageImage own_' : 'messageImage'}>
              <img
                src={image}
                className={own || ownAlt ? 'imageBox ownimg_' : 'imageBox'}
                // className={own || ownAlt ? 'messageImage own_' : 'messageImage'}
              />
              <div style={{textAlign: 'start', padding: '0px 7px 0px 7px', fontSize: '13px', width: '-webkit-fill-available'}}>
                {message?.data?.caption || message?.messages && message?.messages[0]?.[message?.messages[0]?.type]?.caption}
              </div>
              </div>
            ) : message.type === 'video' ||
              (message?.messages && message?.messages[0]?.type == 'video') ? (
              <div className={
                own || ownAlt ? 'messageVideo ownVid' : 'messageVideo'
              }>
              <video
                controls
                src={image}
                className={
                  own || ownAlt ? 'videoBox ownVid_' : 'videoBox'
                }
              />
              <div style={{textAlign: 'start', padding: '0px 7px 0px 7px', fontSize: '13px', width: '-webkit-fill-available'}}>
                {message?.data?.caption || message?.messages && message?.messages[0]?.[message?.messages[0]?.type]?.caption}
              </div>
              </div>
            ) : message.type === 'voice' || message.type === 'audio' ||
              (message?.messages && message?.messages[0]?.type == 'voice') || (message?.messages && message?.messages[0]?.type == 'audio') ? (
              <ReactAudioPlayer
                src={image}
                style={{ marginBottom: '15px' }}
                controls
              />
            ) : message.type === 'document' ||
              (message?.messages &&
                message?.messages[0]?.type == 'document') ? (
              <div
                className={own || ownAlt ? 'messageDocs own_' : 'messageDocs'}
              >
                {/* <iframe src={image} height="200" width="300"></iframe> */}
                {/* {JSON.stringify(image)} */}
                {/* <img src={image} /> */}
                <a href={image} target='_blank'>
                  {message?.messages
                    ? message?.messages[0]?.document?.filename || message?.messages[0]?.document?.caption
                    : message.data.filename
                    ? message.data.filename
                    : !message.data.filename
                    ? message.data.caption
                    : null}
                </a>
                {/* {message?.messages ? message?.messages[0]?.document?.filename : message.data.filename ? message.data.filename : null} */}
              </div>
            ) : message.type === 'button' ||
              (message?.messages && message?.messages[0]?.type == 'button') ? (
              <div>
                <p className='messageTextContext'>{context}</p>
                <p className='messageTextReplyBtn'>
                  {message?.messages
                    ? message?.messages[0]?.button?.text
                    : message?.replyButton
                    ? message?.replyButton
                    : null}
                </p>
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message?.context ||
                (message?.messages && message?.messages[0]?.context) ? (
                  <div>
                    {fileType === 'image' ||
                    fileType === 'video' ||
                    fileType === 'document' ? (
                      // <iframe
                      //   src={context}
                      //   width='100'
                      //   height='100'
                      //   style={{ border: '2px solid #fff' }}
                      // ></iframe>
                      <div className='messageFileContext'>
                        <a href={context} target='_blank'>
                          file link
                        </a>
                      </div>
                    ) : (
                      <p className='messageTextContext'>{context}</p>
                    )}
                  </div>
                ) : null}
                <p
                  className={
                    message.context ||
                    (message?.messages && message?.messages[0]?.context)
                      ? 'messageTextReply'
                      : 'messageText'
                  }
                >
                  {message?.messages
                    ? message?.messages[0]?.text?.body
                    : message?.text?.body
                    ? message?.text?.body
                    : null}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {own || ownAlt ? (
              <>
                {message.status === 'read' || status?.find(e => e?.msgId == message?.id)?.msgStatus  == 'read' ? (
                  <DoneAllIcon className='seen' />
                ) : message.status === 'delivered' || status?.find(e => e?.msgId == message?.id)?.msgStatus == 'delivered' ? (
                  <DoneAllIcon className='delivered' />
                ) : message.status === 'sent' || status?.find(e => e?.msgId == message?.id)?.msgStatus == 'sent' ? (
                  <DoneIcon className='sent' />
                ) : (
                  <ScheduleIcon className='notsent' />
                )}
              </>
            ) : null}
            <div className='messageBottom'>
              {/* {format(
                message?.createdAt ||
                  (message?.messages &&
                    new Date(message?.messages[0]?.timestamp * 1000))
              )} */}
              {moment(
                message?.createdAt ||
                  (message?.messages &&
                    new Date(message?.messages[0]?.timestamp * 1000))
              ).format('lll')}
            </div>
            <div className='fowardCont'>
              <ReplyIcon
                className='forward'
                onClick={() => {
                  setForward({
                    type:
                      message?.type ||
                      (message?.messages && message?.messages[0]?.type),
                    data:
                      message?.data ||
                      message.text ||
                      (message?.messages &&
                        message?.messages[0]?.[message?.messages[0]?.type]),
                  });
                  setVisible(true);
                }}
              />
              <ReplyAllIcon
                className='forward'
                onClick={() => setShowSelector(true)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Message;
