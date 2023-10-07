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
        user_responses = json.loads(user_responses)
        print(user_responses)

        # response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=text_prompt, max_tokens=50)
        # print("Response:", response)
        # gpt_response = response.choices[0]["text"]
        return JsonResponse({'data': "Success"})
    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})
