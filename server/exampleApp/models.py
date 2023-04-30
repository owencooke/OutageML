from django.db import models

# Create your models here.


class Transformer(models.Model):
    # name = models.CharField("Name", max_length=240)
    # email = models.EmailField()
    # created = models.DateField(auto_now_add=True)

    coordinates = models.JSONField()
    priority_ranking = models.IntegerField()
    time_elapsed = models.IntegerField()
    resolved = models.BooleanField()

    def __str__(self):
        return self.name
