from django.db import models
from django.contrib.auth.models import User

class Card(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='cards'
    )
    cardholder_name = models.CharField(max_length=100)
    card_type = models.CharField(max_length=20, default='Credit')
    masked_card = models.CharField(max_length=19)
    last_4_digits = models.CharField(max_length=4)
    exp_month = models.IntegerField()
    exp_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cards'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.cardholder_name} - {self.masked_card}"
    