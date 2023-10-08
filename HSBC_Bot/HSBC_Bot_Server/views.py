from django.shortcuts import render
from django.http import JsonResponse
import openai
from django.views.decorators.csrf import csrf_exempt
import json

openai.api_key = "API_KEY"


# Create your views here.
def index(request):
    return render(request, 'index.html')


@csrf_exempt
def get_gpt_response(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        text_prompt = request.GET.get('text')
        print("Text Prompt:", text_prompt)

        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=text_prompt, max_tokens=50)
        print("Response:", response)
        gpt_response = response.choices[0]["text"]
        return JsonResponse({'data': gpt_response})
    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})


def get_financial_recommendation(request):
    return render(request, 'financial_recommendation.html')


@csrf_exempt
def get_products_and_services(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        user_responses = request.GET.get('userResponses')
        user_responses = json.loads(user_responses)["userResponses"]

        user_question = "My name is {0}. "\
                        "My age is {1}. "\
                        "I am a {2}. "\
                        "I live in {3}. "\
                        "My primary financial objective is to: {4}. "\
                        "I want to retire by the age of {5}. "\
                        "My purchasing decision-making behavior: {6}. "\
                        "My hobbies: {7}. "\
                        "Based on this information, please recommend me financial products and services from HSBC Bank in my location."\
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

        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=user_question, max_tokens=400)
        print("Response:", response)
        gpt_response = response.choices[0]["text"]
        return JsonResponse({'data': gpt_response})
    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})


def yes_no_question(request):
    return render(request,"ques.html")

def get_photo(request):
    return render(request,"photo.html")
