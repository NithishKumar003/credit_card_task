import datetime
import re
from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    # input only fields that are not stored in database
    card_number = serializers.CharField(write_only=True, required=True, min_length=13, max_length=19)
    cvv = serializers.CharField(write_only=True, required=True, min_length=3, max_length=4)
    
    class Meta:
        model = Card
        fields = [
            'id',
            'cardholder_name',
            'card_type',
            'card_number',
            'cvv',
            'masked_card',
            'last_4_digits',
            'exp_month',
            'exp_year',
            'created_at',
        ]
        read_only_fields = ['id', 'masked_card', 'last_4_digits', 'created_at']
        
    def validate_card_number(self, value):
        # remove white spaces or dashes
        cleaned_number = re.sub(r'\D', '', value)
        if len(cleaned_number) < 13 or len(cleaned_number) > 19:
            raise serializers.ValidationError("Check the length of the card number you entered.")
        return cleaned_number
    
    def validate_cvv(self, value):
        cleaned_cvv = re.sub(r'\D', '', value)

        if len(cleaned_cvv) not in (3, 4):
            raise serializers.ValidationError(
                "CVV must be 3 or 4 digits."
            )

        return cleaned_cvv
        
    def validate(self, attrs):
        exp_month = attrs.get('exp_month')
        exp_year = attrs.get('exp_year')
        
        # validate month range
        if not (1 <= exp_month <= 12):
            raise serializers.ValidationError({"exp_month": "Month must between 1 and 12."})
        
        # validate expiration date
        now = datetime.datetime.now()
        current_year = now.year
        current_month = now.month
        
        # Support 2-digit year entry
        if exp_year < 100:
            exp_year += 2000
            attrs['exp_year'] = exp_year
            
        if exp_year < current_year or (exp_year == current_year and exp_month == current_month):
            raise serializers.ValidationError("The card expired.")
        return attrs
    
    def create(self, validated_data):
        # extract raw ssssssitive data
        raw_card_number = validated_data.pop('card_number')
        # CVV is removed and discarded completly
        validated_data.pop('cvv')
        
        # Extract last 4 digits
        last_4 = raw_card_number[-4:]
        # Build masked format
        masked = f"**** **** **** {last_4}"
        validated_data['masked_card'] = masked
        validated_data['last_4_digits'] = last_4
        
        # Associate card with currentlu authenticated user\
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)