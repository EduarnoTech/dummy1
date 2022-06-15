import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({handleStickComments,setStickComments,stickComments,wa_id,fetchStickComments}) {
  const [open, setOpen] = React.useState(false);

console.log({stickComments})
  const handleClickOpen = () => {
    fetchStickComments(wa_id)
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button  onClick={handleClickOpen}>
      Comments
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Comments</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
           Write Your comments here..
          </DialogContentText> */}
          <TextField
              placeholder='write your comments here!'
              multiline
              onChange={(e) => setStickComments(e.target.value)}
              value={stickComments}
              rows={2}
              maxRows={6}
              style={{ width: '30rem' }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleStickComments(wa_id,stickComments)}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}