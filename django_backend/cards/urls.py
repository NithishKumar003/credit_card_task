from django.urls import path
from .views import CardListCreateView, CardDetailDeleteView, AdminCardListView

urlpatterns = [
    path('', CardListCreateView.as_view(), name='card_list_create'),
    path('card-detail/<int:pk>/', CardDetailDeleteView.as_view(), name='card_detail_delete'),
    path('admin/cards/', AdminCardListView.as_view(), name='admin_cards'),
]
