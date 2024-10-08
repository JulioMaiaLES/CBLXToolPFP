from django import forms
from .models.engage_template import Engage
from .models.investigate_template import Investigate
from .models.act_template import Act

class EngageForm(forms.ModelForm):
    class Meta:
        model = Engage
        fields = ['big_idea', 'essential_question', 'challenge']

class InvestigateForm(forms.ModelForm):
    class Meta:
        model = Investigate
        fields = ['guiding_question', 'guiding_resource', 'guiding_activity', 'result', 'date_start', 'date_end']

class ActForm(forms.ModelForm):
    class Meta:
        model = Act
        fields = ['image', 'file', 'text_input']