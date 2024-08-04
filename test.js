app.get('/api/statistics', async (req, res) => {
  try {
    // Total Assets
    const totalAssetsResult = await pool.query('SELECT COUNT(*) FROM assets');
    const totalAssets = parseInt(totalAssetsResult.rows[0].count, 10);

    // Defective Devices
    const defectiveDevicesResult = await pool.query('SELECT COUNT(*) FROM defective_devices');
    const defectiveDevices = parseInt(defectiveDevicesResult.rows[0].count, 10);

    // Assets Ready and Not Ready
    const assetsReadyResult = await pool.query(`
      SELECT COUNT(*) FROM assets
      WHERE imaging_complete = TRUE
        AND ynx1c_complete = TRUE
        AND business_bundles_complete = TRUE
        AND rsa_complete = TRUE
    `);
    const assetsReady = parseInt(assetsReadyResult.rows[0].count, 10);

    const assetsNotReadyResult = await pool.query(`
      SELECT COUNT(*) FROM assets
      WHERE NOT (
        imaging_complete = TRUE
        AND ynx1c_complete = TRUE
        AND business_bundles_complete = TRUE
        AND rsa_complete = TRUE
      )
    `);
    const assetsNotReady = parseInt(assetsNotReadyResult.rows[0].count, 10);

    // Imaging, YNX1C, Bundles, RSA Counts
    const imagingCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE imaging_complete = TRUE');
    const imagingComplete = parseInt(imagingCompleteResult.rows[0].count, 10);

    const ynx1cCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE ynx1c_complete = TRUE');
    const ynx1cComplete = parseInt(ynx1cCompleteResult.rows[0].count, 10);

    const bundlesCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE business_bundles_complete = TRUE');
    const bundlesComplete = parseInt(bundlesCompleteResult.rows[0].count, 10);

    const rsaCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE rsa_complete = TRUE');
    const rsaComplete = parseInt(rsaCompleteResult.rows[0].count, 10);

    // Assets by Technician
    const assetsByTechnicianResult = await pool.query('SELECT technician, COUNT(*) FROM assets GROUP BY technician');
    const assetsByTechnician = assetsByTechnicianResult.rows.map(row => ({
      technician: row.technician,
      count: parseInt(row.count, 10),
    }));

    res.json({
      total_assets: totalAssets,
      defective_devices: defectiveDevices,
      assets_ready: assetsReady,
      assets_not_ready: assetsNotReady,
      imaging_complete: imagingComplete,
      ynx1c_complete: ynx1cComplete,
      bundles_complete: bundlesComplete,
      rsa_complete: rsaComplete,
      assets_by_technician: assetsByTechnician,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
