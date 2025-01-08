import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomerVouchers() {
  const { customerId } = useParams();
  const [voucherList, setVoucherList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});

  useEffect(() => {
    const getVoucherList = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/customer/voucher/getVouchers/${customerId}`);
        setCustomerDetails(res.data.customerDetails);
        setVoucherList(res.data.customerVoucherList.vouchers || []);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    getVoucherList();
  }, [customerId]);

  // Function to get the status color for "paid" or "unpaid"
  const getStatusColor = (status) => {
    return status === 'paid' ? '#28a745' : '#dc3545'; // Green for paid, Red for unpaid
  };

  // Function to get the saved status color for "draft" or "final"
  const getSavedStatusColor = (savedStatus) => {
    return savedStatus === 'draft' ? '#ffc107' : '#17a2b8'; // Yellow for draft, Blue for final
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Voucher Details for Customer</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Customer ID: {customerId}</h2>
        <h3>Customer Name: {customerDetails.customerName}</h3>
        <h4>GST Number: {customerDetails.GSTNumber}</h4>
        <h4>Place: {customerDetails.place}</h4>
      </div>

      <h3>Vouchers:</h3>
      {voucherList.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Serial Number</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Amount</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Saved Status</th>
            </tr>
          </thead>
          <tbody>
            {voucherList.map((voucher, index) => (
              <tr key={voucher._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {voucher.serialNumber || index + 1}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(voucher.createdAt).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {voucher.totalAmount || 0}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color: getStatusColor(voucher.status) }}>
                  {voucher.status}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', color: getSavedStatusColor(voucher.savedStatus) }}>
                  {voucher.savedStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vouchers available.</p>
      )}
    </div>
  );
}

export default CustomerVouchers;
