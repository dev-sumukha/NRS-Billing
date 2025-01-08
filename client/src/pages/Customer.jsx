import React, { useState } from "react";

const Customer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    customerName: "",
    shopName: "",
    GSTNumber: "",
    amountBalance: "",
    amountPaid: "",
    place: "",
    index: undefined, // To track editing
  });

  const [customers, setCustomers] = useState([]);

  // Modal Toggle
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      // Reset form when opening the modal
      setFormFields({
        customerName: "",
        shopName: "",
        GSTNumber: "",
        amountBalance: "",
        amountPaid: "",
        place: "",
        index: undefined,
      });
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formFields.index !== undefined) {
      // Editing existing customer
      const updatedCustomers = [...customers];
      updatedCustomers[formFields.index] = { ...formFields, index: undefined, vouchers: [] };
      setCustomers(updatedCustomers);
    } else {
      // Adding new customer
      setCustomers([...customers, { ...formFields, vouchers: [] }]);
    }
    setFormFields({
      customerName: "",
      shopName: "",
      GSTNumber: "",
      amountBalance: "",
      amountPaid: "",
      place: "",
      index: undefined,
    });
    toggleModal();
  };

  // Delete Customer
  const handleDelete = (index) => {
    const updatedCustomers = customers.filter((_, i) => i !== index);
    setCustomers(updatedCustomers);
  };

  // Edit Customer
  const handleEdit = (index) => {
    const customerToEdit = { ...customers[index], index }; // Include index for editing
    setFormFields(customerToEdit);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#4E45E5" }}>
          Customers
        </h1>
        <button
          className="px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: "#4E45E5" }}
          onClick={toggleModal}
        >
          + Create Customer
        </button>
      </header>

      {/* Customer Table */}
      {customers.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Shop Name</th>
              <th className="border border-gray-300 px-4 py-2">GST Number</th>
              <th className="border border-gray-300 px-4 py-2">Amount Balance</th>
              <th className="border border-gray-300 px-4 py-2">Amount Paid</th>
              <th className="border border-gray-300 px-4 py-2">Place</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{customer.customerName}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.shopName}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.GSTNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.amountBalance}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.amountPaid}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.place}</td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm text-white rounded bg-blue-500"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-white rounded bg-green-500"
                  >
                    Vouchers
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-white rounded bg-red-500"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No customers added yet.</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#4E45E5" }}
            >
              {formFields.index !== undefined ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formFields.customerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={formFields.shopName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">GST Number</label>
                <input
                  type="text"
                  name="GSTNumber"
                  value={formFields.GSTNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Amount Balance
                </label>
                <input
                  type="number"
                  name="amountBalance"
                  value={formFields.amountBalance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Amount Paid</label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formFields.amountPaid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Place</label>
                <input
                  type="text"
                  name="place"
                  value={formFields.place}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 text-white rounded-md bg-gray-500"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: "#4E45E5" }}
                >
                  {formFields.index !== undefined ? "Update" : "Add"} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;

