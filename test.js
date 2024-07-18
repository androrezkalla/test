const handleFetchAssetDetails = async () => {
  setLoading(true);
  setError('');
  setOutput('');

  try {
    const script = `Get-CimInstance -ClassName Win32_ComputerSystem -ComputerName '${hostname}' | Select-Object PSComputerName, Manufacturer, Model, TotalPhysicalMemory, UserName, SystemType, Domain, DomainRole, BootupState, PowerState, NumberOfProcessors, NumberOfLogicalProcessors | ConvertTo-Json -Compress`;
    const response = await fetch('http://127.0.0.1:5000/api/run-powershell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }),
    });

    const data = await response.json();

    if (data.success) {
      const formattedOutput = formatJsonOutput(data.output);
      setOutput(formattedOutput);
    } else {
      setError(data.error);
    }
  } catch (error) {
    setError('Failed to execute the script');
  } finally {
    setLoading(false);
  }
};
