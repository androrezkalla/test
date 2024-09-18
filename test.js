CREATE TABLE checked_in_guests (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



const { Pool } = require('pg'); // Import pg module
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_db_password',
  port: 5432,
});

// Endpoint to mark the guest as checked-in
app.post('/api/check-in', async (req, res) => {
  const { email, first_name, last_name } = req.body;

  try {
    // Check if the guest has already checked in
    const checkQuery = 'SELECT * FROM checked_in_guests WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email.toLowerCase()]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Guest has already checked in.' });
    }

    // Insert the guest into the checked_in_guests table
    const insertQuery = `
      INSERT INTO checked_in_guests (email, first_name, last_name)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [email.toLowerCase(), first_name, last_name];

    const result = await pool.query(insertQuery, values);
    res.status(200).json({ message: 'Guest checked in successfully.', guest: result.rows[0] });
  } catch (error) {
    console.error('Error in /api/check-in:', error);
    res.status(500).json({ message: 'Error checking in guest', error });
  }
});



try {
  await axios.post('http://localhost:5000/api/check-in', {
    email: foundGuest.email,
    first_name: foundGuest.first_name,
    last_name: foundGuest.last_name
  });
} catch (error) {
  console.error('Error marking check-in status:', error.response ? error.response.data : error.message);
}



// Endpoint to get all checked-in guests
app.get('/api/checked-in-guests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM checked_in_guests ORDER BY check_in_time DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in /api/checked-in-guests:', error);
    res.status(500).json({ message: 'Error fetching checked-in guests', error });
  }
});





// Fetch the checked-in guests from the backend
const fetchCheckedInGuests = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/checked-in-guests');
    setCheckedInGuests(response.data);
  } catch (error) {
    console.error('Error fetching checked-in guests:', error);
  }
};

// Call fetchCheckedInGuests in a useEffect hook in the admin component to load the data on mount
useEffect(() => {
  fetchCheckedInGuests();
}, []);

// Render the checked-in guests in the admin view
<tbody>
  {checkedInGuests.map((guest, index) => (
    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
      <td className="py-3 px-4">{guest.first_name}</td>
      <td className="py-3 px-4">{guest.last_name}</td>
      <td className="py-3 px-4">{guest.email}</td>
      <td className="py-3 px-4">{new Date(guest.check_in_time).toLocaleString()}</td>
    </tr>
  ))}
</tbody>
