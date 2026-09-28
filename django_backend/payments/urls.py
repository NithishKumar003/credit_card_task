from django.urls import path
from .views import ProcessPaymentView, TransactionListView

urlpatterns = [
   path('process/', ProcessPaymentView.as_view(), name='process_payment'),
   path('history/', TransactionListView.as_view(), name='payment_history'), 
]