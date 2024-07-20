const handleFetchAllUserInfo = async () => {
  setLoadingAllUsers(true);

  const userInfoPromises = assets.map(async (asset) => {
    if (asset.login_id) {
      await handleFetchUserInfo(asset.login_id);
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [asset.id]: 'No User Found'
      }));
    }
  });

  await Promise.all(userInfoPromises);
  setLoadingAllUsers(false);
};

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
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [loginId]: formatUserInfo(data.output)
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
