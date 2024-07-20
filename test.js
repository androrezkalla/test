const handleFetchUserInfo = async (loginId) => {
  setLoadingUserInfo(loginId);
  try {
    const response = await fetch('http://localhost:5000/api/run-powershell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        script: `Get-ADUser -Filter {SamAccountName -eq '${loginId}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`
      }),
    });

    const data = await response.json();

    if (response.ok && data.output) {
      const parsedUserInfo = parsePowerShellOutput(data.output);
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [loginId]: parsedUserInfo,
      }));
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [loginId]: 'No User Found'
      }));
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [loginId]: 'No User Found'
    }));
  } finally {
    setLoadingUserInfo('');
  }
};

const parsePowerShellOutput = (output) => {
  const lines = output.split('\r\n');
  const parsedOutput = {};

  lines.forEach(line => {
    const [key, value] = line.split(':');
    if (key && value) {
      parsedOutput[key.trim()] = value.trim();
    }
  });

  return parsedOutput;
};

const mergeData = () => {
  return assets.map(asset => {
    const userInfoData = userInfo[asset.login_id] || {};
    return {
      ...asset,
      ...userInfoData,
    };
  });
};
