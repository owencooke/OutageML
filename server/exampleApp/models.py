from django.db import models

# Create your models here.


class Transformer(models.Model):
    # name = models.CharField("Name", max_length=240)
    # email = models.EmailField()
    # created = models.DateField(auto_now_add=True)

    coordinates = models.JSONField()
    priorityRanking = models.IntegerField()
    timeElapsed = models.FloatField()
    resolved = models.BooleanField()

    def __str__(self):
        return self.name
