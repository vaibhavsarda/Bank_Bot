import cv2
from PIL import Image, ImageDraw
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# Initialize the camera
cap = cv2.VideoCapture(0)

# Capture a frame
ret, frame = cap.read()

# Release the camera
cap.release()

# Open the captured image
image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

# Load the emoji image
emoji = Image.open('../static/images/lumo.png')

# Resize the emoji to fit your desired size
emoji = emoji.resize((150, 150))

# Calculate the position for the left bottom corner
x_position = 20  # Adjust this value for the desired horizontal position
y_position = image.height - emoji.height - 20  # 20 pixels from the bottom, adjust as needed

# Paste the emoji onto the captured image
image.paste(emoji, (x_position, y_position), emoji)

# Save the modified image
output_image_path = "../static/images/output_image.png"
image.save(output_image_path)

# Send the modified image via email
from_email = "vemulashivani2012@gmail.com"
from_password = "qlww rkwk waze aycs"
# user_mail=input("Enter your mail id") get user name from request parameters
to_email = ""

# Create a MIME object
msg = MIMEMultipart()
msg['From'] = from_email
msg['To'] = to_email
msg['Subject'] = "Image with LUMOS LOGO"

# Attach the modified image
with open(output_image_path, 'rb') as attachment:
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(attachment.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f"attachment; filename= {output_image_path}")
    msg.attach(part)

# Connect to Gmail's SMTP server and send the email
try:
    # Connect to Gmail's SMTP server and send the email
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)
    server.sendmail(from_email, user_mail, msg.as_string())
    server.quit()
    print("Email sent successfully to:", user_mail)
except Exception as e:
    print("Email could not be sent:", str(e))