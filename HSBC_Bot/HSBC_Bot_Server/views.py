from django.shortcuts import render
from django.http import JsonResponse
import openai
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def index(request):
    # return HttpResponse("Hello, world. This is a test view.")
    return render(request, 'index.html')


@csrf_exempt
def get_gpt_response(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        text_prompt = request.GET.get('text')
        print("Text Prompt:", text_prompt)

        openai.api_key = "API_KEY"

        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=text_prompt, max_tokens=50)
        print("Response:", response)
        gpt_response = response.choices[0]["text"]
        return JsonResponse({'data': gpt_response})
    return JsonResponse({'data': "Oops! Something went wrong while retrieving the response. Please try again."})
