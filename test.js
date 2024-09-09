import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode.react';
import emailjs from 'emailjs-com';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [adminView, setAdminView] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const guests = XLSX.utils.sheet_to_json(sheet);
      setGuestList(guests);
    };
    reader.readAsBinaryString(file);
  };

  const handleScanInput = (e) => {
    const input = e.target.value.trim();
    if (input) {
      const [firstName, lastName, email] = input.split(',');
      const foundGuest = guestList.find(
        (guest) =>
          guest.Email.toLowerCase() === email.toLowerCase() &&
          guest.FirstName.toLowerCase() === firstName.toLowerCase() &&
          guest.LastName.toLowerCase() === lastName.toLowerCase()
      );
      if (foundGuest) {
        setScannedGuest(foundGuest);
        setMessage(`Welcome, ${foundGuest.FirstName}!`);
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
      }
    }
    e.target.value = ''; // Clear the input after processing
  };

  const handleManualCheck = () => {
    alert(JSON.stringify(guestList, null, 2));
  };

  const sendEmail = (guest) => {
    const qrCodeData = `${guest.FirstName},${guest.LastName},${guest.Email}`;
    const qrCodeURL = document.getElementById(`qr-code-${guest.Email}`).toDataURL();

    const templateParams = {
      to_name: guest.FirstName,
      to_email: guest.Email,
      qr_code: qrCodeURL,
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.log('Failed to send email:', error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {adminView ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Admin Section</h2>
          <div className="mb-4">
            <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
            <button
              onClick={handleManualCheck}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Manually Check Guest List
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">First Name</th>
                  <th className="py-2 px-4">Last Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">QR Code</th>
                  <th className="py-2 px-4">Send Email</th>
                </tr>
              </thead>
              <tbody>
                {guestList.map((guest, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{guest.FirstName}</td>
                    <td className="py-2 px-4">{guest.LastName}</td>
                    <td className="py-2 px-4">{guest.Email}</td>
                    <td className="py-2 px-4">
                      <QRCode
                        id={`qr-code-${guest.Email}`}
                        value={`${guest.FirstName},${guest.LastName},${guest.Email}`}
                        size={64}
                        level={"H"}
                      />
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => sendEmail(guest)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Send QR Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`min-h-screen w-full flex items-center justify-center ${
          scannedGuest ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <h1 className="text-white text-4xl font-bold">{message}</h1>
        </div>
      )}

      <button
        onClick={() => setAdminView(!adminView)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        {adminView ? 'Switch to User View' : 'Switch to Admin View'}
      </button>
    </div>
  );
};

export default GalaCheckIn;
