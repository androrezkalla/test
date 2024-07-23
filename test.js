const updateAssetDetails = async (loginId, userInfoOutput) => {
  // Extract relevant details from userInfoOutput
  const employeeIDMatch = userInfoOutput.match(/EmployeeID\s*:\s*(\S+)/);
  const homeDirectoryMatch = userInfoOutput.match(/HomeDirectory\s*:\s*(\S+)/);
  const givenNameMatch = userInfoOutput.match(/GivenName\s*:\s*(\S+)/);
  const surnameMatch = userInfoOutput.match(/Surname\s*:\s*(\S+)/);
  
  const employeeID = employeeIDMatch ? employeeIDMatch[1] : '';
  const homeDirectory = homeDirectoryMatch ? homeDirectoryMatch[1] : '';
  const givenName = givenNameMatch ? givenNameMatch[1] : '';
  const surname = surnameMatch ? surnameMatch[1] : '';

  const assetToUpdate = assets.find(asset => asset.login_id === loginId);
  if (assetToUpdate) {
      try {
          // Prepare the updated asset object with all fields to be updated
          const updatedAssetDetails = {
              ...assetToUpdate,
              business_group: employeeID,
              home_directory: homeDirectory,
              given_name: givenName,
              surname: surname
          };

          const response = await fetch(`http://localhost:5000/api/assets/${assetToUpdate.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedAssetDetails),
          });

          if (!response.ok) {
              throw new Error('Failed to update asset');
          }

          const updatedAsset = await response.json();
          setAssets(assets.map((asset) => (asset.id === assetToUpdate.id ? updatedAsset : asset)));
      } catch (error) {
          console.error('Failed to update asset with multiple fields:', error);
      }
  }
};
