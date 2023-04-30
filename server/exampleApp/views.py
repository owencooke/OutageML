from django.shortcuts import render
from .models import Transformer
from rest_framework import generics
from .serializers import TransformerSerializer


class TransformerCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new customer
    queryset = (Transformer.objects.all(),)
    serializer_class = TransformerSerializer


class TransformerList(generics.ListAPIView):
    # API endpoint that allows customer to be viewed.
    queryset = Transformer.objects.all()
    serializer_class = TransformerSerializer


class TransformerDetail(generics.RetrieveAPIView):
    # API endpoint that returns a single customer by pk.
    queryset = Transformer.objects.all()
    serializer_class = TransformerSerializer


class TransformerUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a customer record to be updated.
    queryset = Transformer.objects.all()
    serializer_class = TransformerSerializer


class TransformerDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a customer record to be deleted.
    queryset = Transformer.objects.all()
    serializer_class = TransformerSerializer
