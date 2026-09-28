from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20)
    message = models.TextField(blank=True, null=True)
    masked_card = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.transaction_id} - {self.status} - {self.amount} {self.currency}"