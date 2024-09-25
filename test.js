let isProcessing = false;  // Flag to indicate if a scan is in progress

const handleScanInput = async (e) => {
    const input = e.target.value.trim();

    // If processing a scan, ignore new inputs
    if (isProcessing) return;

    // Set processing flag
    isProcessing = true;

    try {
        // Clear previous timeout if set
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce the input for scans (use Enter key as an indicator for scanners)
        debounceTimeoutRef.current = setTimeout(async () => {
            // Check for Enter key to finalize the scan
            if (e.key === 'Enter' || sanitizedInput) {
                // Clean up the input to remove extra characters like newlines or spaces
                const sanitizedInput = input.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");

                if (sanitizedInput) {
                    const [firstName, lastName, email] = sanitizedInput.split(',');

                    // Ensure email and names are valid before proceeding
                    if (firstName && lastName && email) {
                        const foundGuest = guestList.find((guest) =>
                            guest.email.toLowerCase() === email.toLowerCase() &&
                            guest.first_name.toLowerCase() === firstName.toLowerCase() &&
                            guest.last_name.toLowerCase() === lastName.toLowerCase()
                        );

                        if (foundGuest) {
                            try {
                                // Attempt to check in the guest via backend
                                await axios.post('http://localhost:5000/api/check-in', {
                                    email: foundGuest.email,
                                    first_name: foundGuest.first_name,
                                    last_name: foundGuest.last_name
                                });

                                // Display success message
                                setMessage(`Welcome, ${foundGuest.first_name}!`);
                                setImage(validBg);  // Green background for success
                                setMessageColor('text-green-500');
                            } catch (error) {
                                if (error.response && error.response.status === 400 && error.response.data.message === 'Guest has already checked in.') {
                                    // Guest already checked in
                                    setMessage(`${foundGuest.first_name} has already checked in!`);
                                    setImage(alreadyCheckedInBg);  // Yellow background
                                    setMessageColor('text-yellow-500');
                                } else {
                                    // Error checking in
                                    setMessage(`${firstName} is not on the guest list!`);
                                    setImage(failedBg);  // Red background for failure
                                    setMessageColor('text-red-500');
                                }
                            }
                        } else {
                            // Guest not found
                            setMessage(`${firstName} is not on the guest list!`);
                            setImage(failedBg);  // Red background for failure
                            setMessageColor('text-red-500');
                        }
                    }
                }
            }
            
            // Reset after processing
            setTimeout(() => {
                setMessage('');  // Reset message after display
                setImage(defaultBg);  // Reset background
                e.target.value = '';  // Clear the input field
                isProcessing = false;  // Reset flag for new scans
            }, 300);  // Adjust delay as needed
        }, 500);  // Adjust debounce timeout if needed (scanner timing sensitivity)
    } catch (error) {
        console.error("Error processing scan:", error);
        isProcessing = false;  // Ensure the flag resets after error
    }
};

// Make sure the input element listens for the "Enter" key
<input type="text" onKeyDown={handleScanInput} />
