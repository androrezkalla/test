import os
import pandas as pd
import qrcode
import win32com.client

# Load the Excel file
guest_list = pd.read_excel('guest_list.xlsx')

# Create directories for QR codes and .msg files
qr_code_dir = 'qr_codes'
msg_dir = 'msg_files'
os.makedirs(qr_code_dir, exist_ok=True)
os.makedirs(msg_dir, exist_ok=True)

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

def create_outlook_msg(first_name, last_name, email, qr_code_path, msg_filename):
    try:
        # Create an Outlook application instance
        outlook = win32com.client.Dispatch('Outlook.Application')
        mail = outlook.CreateItem(0)  # 0: olMailItem

        # Set the email properties
        mail.Subject = f"Your Invitation, {first_name} {last_name}"
        mail.To = email
        mail.Body = f"Dear {first_name} {last_name},\n\nYou are invited to our event. Please find your QR code attached.\n\nBest regards,\nEvent Organizer"
        
        # Attach the QR code
        mail.Attachments.Add(os.path.abspath(qr_code_path))

        # Save as .msg file
        msg_filepath = os.path.join(msg_dir, msg_filename)
        
        # Save as .msg format (9 indicates .msg format)
        mail.SaveAs(msg_filepath, 3)  # 3 is the OlSaveAsType for .msg format

    except Exception as e:
        print(f"Failed to save .msg file for {first_name} {last_name}: {e}")

# Iterate through the guest list, generate QR codes, and create .msg files
for index, row in guest_list.iterrows():
    # Generate QR code
    data = f"{row['FirstName']},{row['LastName']},{row['Email']}"
    qr_code_filename = os.path.join(qr_code_dir, f"qr_{row['FirstName']}_{row['LastName']}.png")
    generate_qr_code(data, qr_code_filename)
    
    # Create a .msg file for the email
    msg_filename = f"invitation_{row['FirstName']}_{row['LastName']}.msg"
    create_outlook_msg(row['FirstName'], row['LastName'], row['Email'], qr_code_filename, msg_filename)

print("Processing completed.")
