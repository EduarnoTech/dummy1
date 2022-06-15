import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

export default function CustomizedDialogs({
  rating_and_reviews,
  tutorId,
  handleAssignTutorRating,
  setShowTutorRatingBox,
  showTutorRatingBox,
  setSendTutorRating,
  setStoreTutorRating,
}) {
  const [open, setOpen] = React.useState(false);
  const [valueRating, setValueRating] = React.useState(
    +rating_and_reviews?.rating / 2
  );
  const [valueSpeed, setValueSpeed] = React.useState(
    +rating_and_reviews?.speed / 2
  );
  const [valueAccuracy, setValueAccuracy] = React.useState(
    +rating_and_reviews?.accuracy / 2
  );
  const [valueLegitimacy, setValueLegitimacy] = React.useState(
    +rating_and_reviews?.legitimacy / 2
  );
  const [valueReview, setValueReview] = React.useState(
    rating_and_reviews?.reviews
  );
  const [hover, setHover] = React.useState({
    hoverRating: '' + +rating_and_reviews?.rating / 2,
    hoverSpeed: '' + +rating_and_reviews?.speed / 2,
    hoverAccuracy: '' + +rating_and_reviews?.accuracy / 2,
    hoverLegitimacy: '' + +rating_and_reviews?.legitimacy / 2,
    hoverReview: rating_and_reviews?.reviews,
  });
  //   setStoreTutorRating()

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setShowTutorRatingBox(false);
  };
  console.log({ rating_and_reviews });
  // console.log({tutorId})
  const handleSave = () => {
    setStoreTutorRating({
      rating: '' + +valueRating * 2,
      speed: '' + +valueSpeed * 2,
      accuracy: '' + +valueAccuracy * 2,
      legitimacy: '' + +valueLegitimacy * 2,
      reviews: valueReview,
    });
    // setSendTutorRating(true)
    // handleAssignTutorRating(tutorId);
  };

  React.useEffect(() => {
    if (showTutorRatingBox) {
      setOpen(true);
      // console.log({rating_and_reviews})
    } else {
      setOpen(false);
    }
  }, [showTutorRatingBox]);

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
       add a button
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleClose}
        >
          &nbsp; Rating & Reviews
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          style={{ textAlign: 'left', margin: '0px 25px' }}
        >
          <Typography gutterBottom style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Overall rating</h3>
            <Box
              sx={{
                width: 200,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating
                name='hover-feedback'
                value={valueRating}
                style={{ fontSize: '35px' }}
                precision={0.5}
                onChange={(event, newValue) => {
                  setValueRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover({
                    ...hover,
                    hoverRating: newHover,
                  });
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
                }
              />
              {valueRating !== null && (
                <Box sx={{ ml: 2 }}>
                  {
                    labels[
                      hover.hoverRating !== -1 ? hover.hoverRating : valueRating
                    ]
                  }
                </Box>
              )}
            </Box>
          </Typography>
          <Typography
            gutterBottom
            style={{
              marginBottom: '30px',
              borderTop: '2px solid rgb(241, 241, 241)',
            }}
          >
            <h3 style={{ marginBottom: '-10px' }}>Rate attributes </h3>
          </Typography>
          <Typography gutterBottom style={{ marginBottom: '30px' }}>
            <h5 style={{ marginBottom: '3px' }}>Speed </h5>
            <Box
              sx={{
                width: 200,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating
                name='hover-feedback'
                value={valueSpeed}
                precision={0.5}
                onChange={(event, newValue) => {
                  setValueSpeed(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover({
                    ...hover,
                    hoverSpeed: newHover,
                  });
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
                }
              />
              {valueSpeed !== null && (
                <Box sx={{ ml: 2 }}>
                  {
                    labels[
                      hover.hoverSpeed !== -1 ? hover.hoverSpeed : valueSpeed
                    ]
                  }
                </Box>
              )}
            </Box>
          </Typography>
          <Typography gutterBottom style={{ marginBottom: '30px' }}>
            <h5 style={{ marginBottom: '3px' }}>Legitimacy</h5>
            <Box
              sx={{
                width: 200,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating
                name='hover-feedback'
                value={valueLegitimacy}
                precision={0.5}
                onChange={(event, newValue) => {
                  setValueLegitimacy(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover({
                    ...hover,
                    hoverLegitimacy: newHover,
                  });
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
                }
              />
              {valueLegitimacy !== null && (
                <Box sx={{ ml: 2 }}>
                  {
                    labels[
                      hover.hoverLegitimacy !== -1
                        ? hover.hoverLegitimacy
                        : valueLegitimacy
                    ]
                  }
                </Box>
              )}
            </Box>
          </Typography>
          <Typography gutterBottom style={{ marginBottom: '20px' }}>
            <h5 style={{ marginBottom: '3px' }}>Accuracy</h5>
            <Box
              sx={{
                width: 200,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Rating
                name='hover-feedback'
                value={valueAccuracy}
                precision={0.5}
                onChange={(event, newValue) => {
                  setValueAccuracy(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover({
                    ...hover,
                    hoverAccuracy: newHover,
                  });
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />
                }
              />
              {valueAccuracy !== null && (
                <Box sx={{ ml: 2 }}>
                  {
                    labels[
                      hover.hoverAccuracy !== -1
                        ? hover.hoverAccuracy
                        : valueAccuracy
                    ]
                  }
                </Box>
              )}
            </Box>
          </Typography>
          <Typography
            gutterBottom
            style={{ borderTop: '2px solid rgb(241, 241, 241)', marginBottom: '20px' }}
          >
            <h3 style={{ marginBottom: '10px' }}>Review</h3>
            <TextField
              placeholder='write your reviews!'
              multiline
              onChange={(e) => setValueReview(e.target.value)}
              value={valueReview}
              rows={2}
              maxRows={4}
              style={{ width: '30rem' }}
            />
          </Typography>
        </DialogContent>
        <DialogActions style={{padding: '13px 24px'}}>
          <Button variant='contained' onClick={handleSave}>
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
