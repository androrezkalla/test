import pandas as pd
import qrcode
import win32com.client as win32

# Load the Excel file
guest_list = pd.read_excel('guest_list.xlsx')

def generate_qr_code(data, filename):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)

def create_msg_file(first_name, last_name, email, qr_code_path, output_path):
    outlook = win32.Dispatch('Outlook.Application')
    mail = outlook.CreateItem(0)  # 0 represents a Mail item

    # Set the subject and body
    mail.Subject = "Your Invitation"
    mail.Body = f"Dear {first_name} {last_name},\n\nYou are invited to our event. Please find your QR code attached.\n\nBest regards,\nEvent Organizer"

    # Add the recipient's email address
    mail.To = email

    # Attach the QR code
    mail.Attachments.Add(qr_code_path)

    # Save the message as a .msg file
    mail.SaveAs(output_path)

# Iterate through the guest list, generate QR codes, and create .msg files
for index, row in guest_list.iterrows():
    # Generate QR code
    data = f"{row['FirstName']},{row['LastName']},{row['Email']}"
    qr_code_filename = f"qr_{row['FirstName']}_{row['LastName']}.png"
    generate_qr_code(data, qr_code_filename)
    
    # Create .msg file
    msg_filename = f"invitation_{row['FirstName']}_{row['LastName']}.msg"
    create_msg_file(row['FirstName'], row['LastName'], row['Email'], qr_code_filename, msg_filename)
