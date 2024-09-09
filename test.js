import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode.react';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
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

  const createOutlookDraft = (guest) => {
    const qrCodeData = `${guest.FirstName},${guest.LastName},${guest.Email}`;
    const qrCodeURL = document.getElementById(`qr-code-${guest.Email}`).toDataURL();

    const subject = `Your QR Code for the Gala Event`;
    const body = `Dear ${guest.FirstName},%0D%0A%0D%0APlease find your QR code below for the Gala event.%0D%0A%0D%0A<img src="${qrCodeURL}" alt="QR Code" />%0D%0A%0D%0AWe look forward to seeing you there!%0D%0A%0D%0ABest regards,%0D%0AThe Gala Team`;

    const mailtoLink = `mailto:${guest.Email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {adminView ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Admin Section</h2>
          <div className="mb-4">
            <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">First Name</th>
                  <th className="py-2 px-4">Last Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">QR Code</th>
                  <th className="py-2 px-4">Create Draft</th>
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
                        onClick={() => createOutlookDraft(guest)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Create Draft
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-200">
          <h1 className="text-gray-800 text-4xl font-bold">Gala Check-In System</h1>
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
