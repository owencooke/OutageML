from rest_framework import serializers
from .models import Transformer


class TransformerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transformer
        fields = ["coordinates", "priority_ranking", "time_elapsed", "resolved"]

