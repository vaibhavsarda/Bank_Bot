import openai
import json

from django.http import JsonResponse

api_key = "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"


def call_gpt3():
    # Set your API key here (replace 'your-api-key' with your actual API key)

    # Initialize the OpenAI API client with your API key
    openai.api_key = api_key

    # Specify the prompt for generating text
    # prompt = "Translate the following English text to French: 'Hello, how are you?'"
    prompt = "I want to pursue a career in architecture. Please provide me some advice.'"

    # Use the OpenAI API to generate text based on the prompt
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",  # You can use different engines as needed
        prompt=prompt,
        max_tokens=50,  # You can adjust this as needed
    )

    # Extract the generated text from the response
    generated_text = response.choices[0].text

    # Print the generated text
    print(generated_text)


def dall_e():
    openai.api_key = api_key

    response = openai.Image.create(
        model="image-alpha-001",  # Use the appropriate DALL-E model name
        prompt="A two-story pink house shaped like a shoe.",
        n=1,  # Number of images to generate
    )

    # Get the URL of the generated image
    generated_image_url = response['data'][0]['url']

    print(f"Generated Image URL: {generated_image_url}")


def test_response_mechanism():
    with open('mock_response.json', 'r') as f:
        data = json.load(f)
        print(data["choices"][0]["text"].strip())
        json_response = JsonResponse({'data': data["choices"][0]["text"]})


if __name__ == '__main__':

    model = input("Enter GPT model to test (GPT-3, DALL-E, TEST): ")

    if model == "GPT-3":
        call_gpt3()
    elif model == "DALL-E":
        dall_e()
    else:
        test_response_mechanism()
