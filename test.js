<tbody>
  {checkedInGuests.map((guest, index) => (
    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
      <td className="py-3 px-4">{guest.first_name}</td>
      <td className="py-3 px-4">{guest.last_name}</td>
      <td className="py-3 px-4">{guest.email}</td>
      <td className="py-3 px-4">
        {new Date(guest.check_in_time).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })}
      </td>
    </tr>
  ))}
</tbody>
