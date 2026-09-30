from django.urls import path
from .views import ProcessPaymentView, TransactionListView, AdminDailySummaryView, AdminTransactionListView

urlpatterns = [
   path('process/', ProcessPaymentView.as_view(), name='process-payment'),
   path('history/', TransactionListView.as_view(), name='payment-history'), 
   path('admin/daily-summary/', AdminDailySummaryView.as_view(), name='admin-summary'),
   path('admin/transactions/', AdminTransactionListView.as_view(), name='admin-transactions'),
]