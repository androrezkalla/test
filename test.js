useEffect(() => {
  const fetchCheckedInGuests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-checked-in-guests');
      setCheckedInGuests(response.data);
    } catch (error) {
      console.error('Error fetching checked-in guests:', error);
    }
  };

  if (!adminView) {
    fetchCheckedInGuests();
  }
}, [adminView]);
