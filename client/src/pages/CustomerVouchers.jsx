import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function CustomerVouchers() {
  const { customerId } = useParams();
  const [voucherList, setVoucherList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  // Function to create a new voucher
  const createVoucher = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/customer/voucher/createVoucher/${customerId}`
      );

      const newVoucher = res.data.voucher;

      setVoucherList((prevList) => [...prevList, newVoucher]);
      console.log(res);
    } catch (error) {
      console.error("Error creating voucher: ", error.message);
    }
  };

  // Function to handle Add Items action
// Update the handleAddItem function
const handleAddItem = (voucherId) => {
  navigate(`/dashboard/customers/${customerId}/vouchers/${voucherId}/addItems?customerName=${customerDetails.customerName}`);
};


  // Fetch vouchers and customer details
  useEffect(() => {
    const getVoucherList = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/customer/voucher/getVouchers/${customerId}`
        );
        setCustomerDetails(res.data.customerDetails);
        setVoucherList(res.data.customerVoucherList.vouchers || []);
      } catch (error) {
        console.error("Error fetching vouchers: ", error.message);
      }
    };

    getVoucherList();
  }, [customerId]);

  // Utility function to get status color
  const getStatusColor = (status) =>
    status === "paid" ? "#28a745" : "#dc3545"; // Green for paid, Red for unpaid

  // Utility function to get saved status color
  const getSavedStatusColor = (savedStatus) =>
    savedStatus === "draft" ? "#ffc107" : "#17a2b8"; // Yellow for draft, Blue for final

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">
        Voucher Details for Customer
      </h1>

      {/* Create Voucher Button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl">Customer ID: {customerId}</h2>
          <h3 className="text-lg text-gray-600">
            Customer Name: {customerDetails.customerName}
          </h3>
          <h4 className="text-sm text-gray-600">
            GST Number: {customerDetails.GSTNumber}
          </h4>
          <h4 className="text-sm text-gray-600">Place: {customerDetails.place}</h4>
        </div>
        {/* Button to create a new voucher */}
        <button
          onClick={createVoucher}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
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
                <th className="px-6 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {voucherList.map((voucher, index) => (
                <tr
                  key={voucher._id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 border-b">
                    {voucher.serialNumber || index + 1}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {new Date(voucher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {voucher.totalAmount || 0}
                  </td>
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
                    <button
                      onClick={() => handleAddItem(voucher._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
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
