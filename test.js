{!adminView && (
  <div className={`min-h-screen w-full flex flex-col justify-center ${scannedGuest ? 'bg-green-500' : 'bg-red-500'}`}>
    <div className="flex-grow flex items-center justify-center">
      <h1 className="text-white text-4xl font-bold">{message}</h1>
    </div>
    <div className="mb-4 px-4 py-2">
      <input
        type="text"
        placeholder="Scan QR Code Here"
        onChange={handleScanInput}
        className="w-full px-4 py-2 border rounded"
        autoFocus
      />
    </div>
  </div>
)}
