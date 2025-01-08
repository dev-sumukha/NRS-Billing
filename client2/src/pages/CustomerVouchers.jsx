import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomerVouchers() {
  const { customerId } = useParams();
  const [voucherList, setVoucherList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});

  const createVoucher = async (e) => {
    e.preventDefault();

    try {
      // Sending the request to create a new voucher
      const res = await axios.post(`http://localhost:3000/api/customer/voucher/createVoucher/${customerId}`);
      
      // Assuming the response contains the newly created voucher
      const newVoucher = res.data.voucher;

      // Update the voucherList with the newly created voucher
      setVoucherList((prevList) => [...prevList, newVoucher]);

      console.log(res);
    } catch (error) {
      console.log("Error ", error.message);
    }
  }

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Voucher Details for Customer</h1>
      
      {/* Create Voucher Button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl">Customer ID: {customerId}</h2>
          <h3 className="text-lg text-gray-600">Customer Name: {customerDetails.customerName}</h3>
          <h4 className="text-sm text-gray-600">GST Number: {customerDetails.GSTNumber}</h4>
          <h4 className="text-sm text-gray-600">Place: {customerDetails.place}</h4>
        </div>
        {/* Button to create a new voucher */}
        <button onClick={createVoucher} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
          Create Voucher
        </button>
      </div>

      <h3 className="text-2xl mb-4">Vouchers:</h3>
      {voucherList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left border-b">Serial Number</th>
                <th className="px-6 py-3 text-left border-b">Date</th>
                <th className="px-6 py-3 text-left border-b">Total Amount</th>
                <th className="px-6 py-3 text-left border-b">Status</th>
                <th className="px-6 py-3 text-left border-b">Saved Status</th>
                <th className="px-6 py-3 text-left border-b">Actions</th> {/* Added actions column */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {voucherList.map((voucher, index) => (
                <tr
                  key={voucher._id}
                  className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
                >
                  <td className="px-6 py-4 border-b">{voucher.serialNumber || index + 1}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(voucher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">{voucher.totalAmount || 0}</td>
                  <td
                    className="px-6 py-4 border-b"
                    style={{ color: getStatusColor(voucher.status) }}
                  >
                    {voucher.status}
                  </td>
                  <td
                    className="px-6 py-4 border-b"
                    style={{ color: getSavedStatusColor(voucher.savedStatus) }}
                  >
                    {voucher.savedStatus}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {/* Add Item Button */}
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                      Add Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No vouchers available.</p>
      )}
    </div>
  );
}

export default CustomerVouchers;
