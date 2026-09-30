import os
import requests
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Transaction
from cards.models import Card
from .serializers import TransactionSerializer, PaymentSubmitSerializer

# Change this:
# FASTAPI_PROCESS_URL = os.environ.get('FASTAPI_URL', 'http://127.0.0.1:8001')

# To this (explicitly append the route path):
FASTBASE_URL = os.environ.get('FASTAPI_URL', 'http://fastapi_engine:8001')
FASTAPI_PROCESS_URL = f"{FASTBASE_URL}/api/payments/process"




class ProcessPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        payload = serializer.validated_data
        # convert decimal to float for  json transmission
        payload['amount'] = float(payload['amount'])
        
        try:
            fastapi_res = requests.post(FASTAPI_PROCESS_URL, json=payload, timeout=5)
        except requests.exceptions.RequestException as err:
            print(f"[FASTAPI CONNECTION ERROR]: {err}")
            return Response(
                {"detail": f"Payment microservice is currently unavailable: {err}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        if fastapi_res.status_code != 200:
            error_data = fastapi_res.json()
            return Response(error_data, status=fastapi_res.status_code)
        
        gateway_data = fastapi_res.json()
        
        # save record to mysql except card number and cvv
        tx = Transaction.objects.create(
            user = request.user,
            transaction_id = gateway_data.get('transaction_id'),
            amount = gateway_data.get('amount'),
            currency = gateway_data.get('currency', 'USD'),
            status = gateway_data.get('status'),
            message = gateway_data.get('message'),
            masked_card = gateway_data.get('masked_card'),
        )
        
        return Response(TransactionSerializer(tx).data, status=status.HTTP_201_CREATED)
    
class TransactionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
class AdminDailySummaryView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.localdate()

        transactions_today = Transaction.objects.filter(
            created_at__date=today
        )

        total_transactions = Transaction.objects.count()

        successful_transactions = Transaction.objects.filter(
            status='SUCCESS'
        ).count()

        declined_transactions = Transaction.objects.filter(
            status='DECLINED'
        ).count()

        total_amount = Transaction.objects.aggregate(
            total=Sum('amount')
        )['total'] or 0

        total_users = User.objects.count()

        total_cards = Card.objects.count()

        today_transactions = transactions_today.count()

        today_successful = transactions_today.filter(
            status='SUCCESS'
        ).count()

        today_declined = transactions_today.filter(
            status='DECLINED'
        ).count()

        today_amount = transactions_today.aggregate(
            total=Sum('amount')
        )['total'] or 0

        return Response({
            'date': today,

            'total_users': total_users,
            'total_cards': total_cards,

            'total_transactions': total_transactions,
            'successful_transactions': successful_transactions,
            'declined_transactions': declined_transactions,
            'total_amount': total_amount,

            'today_transactions': today_transactions,
            'today_successful': today_successful,
            'today_declined': today_declined,
            'today_amount': today_amount,
        })
        
class AdminTransactionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all().order_by('-created_at')