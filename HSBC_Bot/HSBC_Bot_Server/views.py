from pathlib import Path
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import openai
from django.views.decorators.csrf import csrf_exempt
import json
import cv2
from PIL import Image, ImageDraw
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os


# openai.api_key = "YOUR_API_KEY"


# Create your views here.
def index(request):
    return render(request, 'index.html')


def get_photo(request):
    # return HttpResponse("Hello, world. This is a test view.")
    return render(request, 'photo_booth.html')


def get_mail(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        user_mail = request.GET.get('user_mail')
        print("User mail", user_mail)

        # Initialize the camera
        cap = cv2.VideoCapture(0)

        # Capture a frame
        ret, frame = cap.read()

        # Release the camera
        cap.release()

        # Open the captured image
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # Load the emoji image
        # lumo_path=os.path.join(BASE_DIR,"static","images","lumo.png")
        lumo_path = Path("./static/images/lumo.png")
        emoji = Image.open(lumo_path)

        # Resize the emoji to fit your desired size
        emoji = emoji.resize((150, 150))

        # Calculate the position for the left bottom corner
        x_position = 20  # Adjust this value for the desired horizontal position
        y_position = image.height - emoji.height - 20  # 20 pixels from the bottom, adjust as needed

        # Paste the emoji onto the captured image
        image.paste(emoji, (x_position, y_position), emoji)

        # Save the modified image
        output_image_path = "./static/images/output_image.png"
        image.save(output_image_path)

        # Send the modified image via email
        from_email = "vemulashivani2012@gmail.com"
        from_password = "llvj qyvp zfka zfhx"
        # user_mail=input("Enter your mail id")
        to_email = user_mail

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
        output_image = cv2.imread(output_image_path)
        cv2.imshow("Saved Output Image", output_image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        print(from_email)
        server.login(from_email, from_password)

        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()

        return JsonResponse({'data': "Image is mailed to user"})
    return JsonResponse({'data': "Oops! Something went wrong. Please try again."})


@csrf_exempt
def get_gpt_response(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        text_prompt = request.GET.get('text')
        print("Text Prompt:", text_prompt)

        gpt_response = get_openai_completion_response(text_prompt, 200)
        if gpt_response == "":
            return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})
        else:
            return JsonResponse({'data': gpt_response})

    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})


def get_financial_recommendation(request):
    return render(request, 'financial_recommendation.html')


@csrf_exempt
def get_products_and_services(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        user_responses = request.GET.get('userResponses')
        user_responses = json.loads(user_responses)["userResponses"]

        user_question = "My name is {0}. " \
                        "My age is {1}. " \
                        "I am a {2}. " \
                        "I live in {3}. " \
                        "My primary financial objective is to: {4}. " \
                        "I want to retire by the age of {5}. " \
                        "My purchasing decision-making behavior: {6}. " \
                        "My hobbies: {7}. " \
                        "Based on this information, please recommend me financial products and services from HSBC Bank in my location." \
            .format(
            user_responses[0]["answer"],
            user_responses[1]["answer"],
            user_responses[2]["answer"],
            user_responses[3]["answer"],
            user_responses[4]["answer"],
            user_responses[5]["answer"],
            user_responses[6]["answer"],
            user_responses[7]["answer"]
        )

        print("User Question:", user_question)

        gpt_response = get_openai_completion_response(user_question, 400)
        if gpt_response == "":
            return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})
        else:
            return JsonResponse({'data': gpt_response})

    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})


def yes_no_question(request):
    return render(request, "ques.html")


def photo_yes_no_question(request):
    return render(request, "photo.html")


def get_openai_api_keys():
    with open("./static/openai_api_keys.json") as f:
        data = json.load(f)
        return data["api_keys"]


def get_openai_completion_response(text_prompt, max_tokens):
    openai_api_keys = get_openai_api_keys()

    total_keys = len(openai_api_keys)
    key_num = 0

    while key_num < total_keys:
        try:
            openai.api_key = openai_api_keys[key_num]
            response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=text_prompt,
                                                max_tokens=max_tokens)
            print(f"Request successful for key {key_num}")

            print(response.choices[0]["text"])
            return response.choices[0]["text"]
        except Exception as e:
            print(f"Error for {key_num}: {e}")
            key_num += 1

    return ""
