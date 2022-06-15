import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from "@mui/material/CircularProgress";

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleSend=(e)=>{
      e.preventDefault()
      props.setReasonVal(reason)
      props.setReason(true)
      // props.setReasonDialog(false)
      // setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
    props.setReason(false)
    props.setReasonDialog(false)
  };

  React.useEffect(()=>{

   if(props.reasonDialog){
       setOpen(true)
   }else(
       setOpen(false)
   )
  },[props.reasonDialog])

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reason</DialogTitle>
        <DialogContent>

          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Reason"
            type="text"
            fullWidth
            variant="outlined"
          /> */}
          {/* <select onChange={(e)=>setReason(e)>
            <option>You misbehaved with our agent. </option>
            <option>You misbehaved with our agent. </option>
          </select> */}
        <TextareaAutosize
        aria-label="minimum height"
        placeholder="Write the reason!"
        minRows={3}
        style={{ width: 200 }}
        onChange={(e)=>setReason(e)}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend}>Send</Button><span >{props.visibleCircularbar && <CircularProgress style={{height:"25px",width:"25px"}} /> }</span>
        </DialogActions>
      </Dialog>
    </div>
  );
}