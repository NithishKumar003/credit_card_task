from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id',
            'transaction_id',
            'amount',
            'currency',
            'status',
            'message',
            'masked_card',
            'created_at',
        ]
        read_only_fields = fields
        
class PaymentSubmitSerializer(serializers.Serializer):
    cardholder_name = serializers.CharField(max_length=100)
    card_number = serializers.CharField(min_length=13, max_length=19)
    exp_month = serializers.IntegerField(min_value=1, max_value=12)
    exp_year = serializers.IntegerField()
    cvv = serializers.CharField(min_length=3, max_length=4)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    currency = serializers.CharField(max_length=3, default='USD')