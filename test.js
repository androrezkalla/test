exec(`powershell -ExecutionPolicy Bypass -NoProfile -Command "${script}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return res.status(500).send(error.message);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return res.status(500).send(stderr);
  }

  console.log('stdout:', stdout); // Check what PowerShell outputs

  try {
    const result = JSON.parse(stdout);
    res.json(result);
  } catch (err) {
    console.error(`Error parsing JSON: ${err}`);
    res.status(500).send('Error parsing JSON response from PowerShell');
  }
});
