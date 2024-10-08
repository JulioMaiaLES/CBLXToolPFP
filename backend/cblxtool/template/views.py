from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models.engage_template import Engage
from .models.investigate_template import Investigate
from .models.act_template import Act
from django.core.exceptions import ValidationError

# versão com erro criando elementos iniciais com ['']
# @csrf_exempt
# def create_engage(request):
#     if request.method == 'POST':
#         try:
#             engage_data = json.loads(request.body)
#             big_idea = engage_data.get('big_idea')
#             essential_question = engage_data.get('essential_question')
#             challenge = engage_data.get('challenge')

#             # Create a new Engage object
#             engage = Engage(
#                 big_idea=big_idea,
#                 essential_question=essential_question,
#                 challenge=challenge
#             )
#             engage.save()
#             return JsonResponse({'message': 'Engage created successfully'}, status=201)

#         except (json.JSONDecodeError, ValidationError) as e:
#             return JsonResponse({'error': str(e)}, status=400)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)


# Versão 1 GPT Resolvendo a situação:
@csrf_exempt
def create_engage(request):
    if request.method == 'POST':
        try:
            engage_data = json.loads(request.body)

            # Ensure that the values are strings, not lists or arrays
            big_idea = engage_data.get('big_idea', '')
            essential_question = engage_data.get('essential_question', '')
            challenge = engage_data.get('challenge', '')

            # If the value is passed as a list (['string']), we need to extract the string
            if isinstance(big_idea, list):
                big_idea = big_idea[0] if big_idea else ''
            if isinstance(essential_question, list):
                essential_question = essential_question[0] if essential_question else ''
            if isinstance(challenge, list):
                challenge = challenge[0] if challenge else ''

            # Create a new Engage object
            engage = Engage(
                big_idea=big_idea,
                essential_question=essential_question,
                challenge=challenge
            )
            engage.save()
            return JsonResponse({'message': 'Engage created successfully'}, status=201)

        except (json.JSONDecodeError, ValidationError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_engage_data(request):
    latest_engage = Engage.objects.order_by('-id').first()

    if latest_engage:
        engage_data = {
            'id': latest_engage.id,
            'big_idea': latest_engage.big_idea,
            'essential_question': latest_engage.essential_question,
            'challenge': latest_engage.challenge
        }
        return JsonResponse({'data': engage_data}, status=200)
    else:
        return JsonResponse({'error': 'No data found'}, status=404)


@csrf_exempt
def create_investigate(request):
    if request.method == 'POST':
        try:
            investigate_data = json.loads(request.body)
            guiding_question = investigate_data.get('guiding_question')
            guiding_resource = investigate_data.get('guiding_resource')
            guiding_activity = investigate_data.get('guiding_activity')
            result = investigate_data.get('result')
            date_start = investigate_data.get('date_start')
            date_end = investigate_data.get('date_end')

            # Create a new Investigate object
            investigate = Investigate(
                guiding_question=guiding_question,
                guiding_resource=guiding_resource,
                guiding_activity=guiding_activity,
                result=result,
                date_start=date_start,
                date_end=date_end,
            )
            investigate.save()
            return JsonResponse({'message': 'Investigate created successfully'}, status=201)

        except (json.JSONDecodeError, ValidationError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def create_act(request):
    if request.method == 'POST':
        try:
            # For handling files (like images and files), use request.FILES
            act_data = json.loads(request.body)
            text_input = act_data.get('text_input')

            image = request.FILES.get('image')  # Handle image file upload
            file = request.FILES.get('file')    # Handle file upload

            # Create a new Act object
            act = Act(
                image=image,
                file=file,
                text_input=text_input,
            )
            act.save()
            return JsonResponse({'message': 'Act created successfully'}, status=201)

        except (json.JSONDecodeError, ValidationError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
