import { useState, useEffect } from 'react';
import './payment.css'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'SL No.', width: 70 },
  { field: 'txnId', headerName: 'ID', width: 180 },
  { field: 'tutorId', headerName: 'Tutor ID', width: 180 },
  { field: 'amount', headerName: 'Amount', width: 130 },
  { field: 'status', headerName: 'Status', width: 120 },
];


const PaymentData = () => {
  const [payDet, setPayDet] = useState();
  const [paymentCount, setpaymentCount] = useState();

  const payHeaders = {
    username: 'rzp_live_Jk4vwq7tyL9Aeg',
    password: 'qUjOJWotN6x47WSDExJ4NURs',
  };

  useEffect(() => {
    const getPaymentDetails = async () => {
      const response = await axios.get(
        `${localStorage.getItem('api')}/api/payments/payouts?account_number=3434949239801329`,
        {
          headers: {
            ...payHeaders,
          },
        }
      );
      // const data = await response.json();
      setPayDet(response?.data?.items);
      setpaymentCount(response?.data?.count);
    };
    getPaymentDetails();
  }, []);

  const rows = payDet?.map((i, j) => ({
    id: j+1,
    txnId: i.id,
    tutorId: i.reference_id,
    amount: i.amount/100 + ' INR',
    status: i.status,
  }));
  //   const rows = [
  //     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 }]

  return (
    <div>
      <div
        style={{
        //   borderLeft: '1px solid rgba(224, 224, 224, 1)',
          fontFamily: 'sans-serif',
          fontSize: '17px',
          fontWeight: '500',
          padding: '18px 15px',
        }}
      >
        Payment History
        <hr
          style={{
            width: '12%',
            marginLeft: '1px',
            marginTop: '2px',
            marginBottom: '2px',
            background: 'coral',
            borderColor: 'coral',
            borderRadius: '5px',
          }}
        />
      </div>
      <div style={{ height: '85vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          style={{ borderRadius: '0px', border: '0px', borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </div>
    </div>
  );
};

export default PaymentData;
