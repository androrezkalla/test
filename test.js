import os
import pandas as pd
import qrcode
from email.message import EmailMessage

# Load the Excel file
guest_list = pd.read_excel('guest_list.xlsx')

# Create directories for QR codes and .eml files
qr_code_dir = 'qr_codes'
eml_dir = 'eml_files'

os.makedirs(qr_code_dir, exist_ok=True)
os.makedirs(eml_dir, exist_ok=True)

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

def create_eml_file(first_name, last_name, email, qr_code_path, output_path):
    msg = EmailMessage()
    msg['Subject'] = f"Your Invitation, {first_name} {last_name}"
    msg['From'] = "youremail@example.com"  # Replace with your email or leave as a placeholder
    msg['To'] = email
    
    # Set the email body
    msg.set_content(f"Dear {first_name} {last_name},\n\nYou are invited to our event. Please find your QR code attached.\n\nBest regards,\nEvent Organizer")
    
    # Attach the QR code
    with open(qr_code_path, 'rb') as qr_file:
        msg.add_attachment(qr_file.read(), maintype='image', subtype='png', filename=os.path.basename(qr_code_path))

    # Save the .eml file
    with open(output_path, 'wb') as eml_file:
        eml_file.write(msg.as_bytes())

# Iterate through the guest list, generate QR codes, and create .eml files
for index, row in guest_list.iterrows():
    # Generate QR code
    data = f"{row['FirstName']},{row['LastName']},{row['Email']}"
    qr_code_filename = os.path.join(qr_code_dir, f"qr_{row['FirstName']}_{row['LastName']}.png")
    generate_qr_code(data, qr_code_filename)
    
    # Create .eml file
    eml_filename = os.path.join(eml_dir, f"invitation_{row['FirstName']}_{row['LastName']}.eml")
    create_eml_file(row['FirstName'], row['LastName'], row['Email'], qr_code_filename, eml_filename)
