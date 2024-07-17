CREATE TABLE action_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  action_type VARCHAR(50),
  asset_id INTEGER,
  asset_details JSONB -- Capture detailed asset information
);


app.post('/api/assets', async (req, res) => {
  const { batchDate, technician, assets, business_group } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const promises = assets.map((asset) =>
      client.query(
        'INSERT INTO assets (batch_date, technician, asset_number, business_group) VALUES ($1, $2, $3, $4) RETURNING *',
        [batchDate, technician, asset, business_group]
      )
    );
    const results = await Promise.all(promises);

    // Log each asset addition
    for (let result of results) {
      const assetId = result.rows[0].id;
      const assetDetails = result.rows[0]; // Modify as per your asset structure
      await client.query(
        'INSERT INTO action_logs (user_id, action_type, asset_id, asset_details) VALUES ($1, $2, $3, $4)',
        [req.user.id, 'asset_added', assetId, assetDetails]
      );
    }

    await client.query('COMMIT');
    res.send({ success: true, message: 'Assets added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding assets:', error);
    res.status(500).send({ success: false, error: 'Database error' });
  } finally {
    client.release();
  }
});
