from rest_framework import generics, permissions
from .models import Card
from .serializers import CardSerializer

class CardListCreateView(generics.ListCreateAPIView):
    # GET/ api/cards list all cards owned by logged-in user
    # POST / api/cards add new card for logged-in user
    
    serializer_class = CardSerializer
    permission_class = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
    
class CardDetailDeleteView(generics.RetrieveDestroyAPIView):
    # GET /api/cards view sing card details
    # DELETE /api/cards delete card owned by user
    
    serializer_class = CardSerializer
    permission_class = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
    
class AdminCardListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = CardSerializer
    queryset = Card.objects.all().order_by('-created_at')