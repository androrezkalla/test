ALTER TABLE assets
ADD COLUMN login_id VARCHAR(255) NULL,
ADD COLUMN business_group VARCHAR(255) NULL;

// Endpoint to add a batch of assets
app.post('/api/assets', async (req, res) => {
  const { batchDate, technician, assets, business_group } = req.body;
  const client = await pool.connect();

  try {
    if (!batchDate || !technician || !assets || !Array.isArray(assets)) {
      return res.status(400).send({ success: false, error: 'Invalid request body' });
    }

    await client.query('BEGIN');
    const promises = assets.map((asset) =>
      client.query(
        'INSERT INTO assets (batch_date, technician, asset_number, login_id, business_group) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [batchDate, technician, asset.asset_number, asset.login_id, business_group]
      )
    );
    const results = await Promise.all(promises);
    await client.query('COMMIT');
    res.send(results.map(result => result.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting assets:', error);
    res.status(500).send({ success: false, error: 'Database error' });
  } finally {
    client.release();
  }
});


// Endpoint to edit an asset
app.put('/api/assets/:id', async (req, res) => {
  const assetId = req.params.id;
  const { asset_number, login_id, business_group } = req.body;

  if (!asset_number) {
    return res.status(400).send({ success: false, error: 'Asset number is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE assets SET asset_number = $1, login_id = $2, business_group = $3 WHERE id = $4 RETURNING *',
      [asset_number, login_id, business_group, assetId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ success: false, error: 'Asset not found' });
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).send({ success: false, error: 'Database error' });
  }
});

