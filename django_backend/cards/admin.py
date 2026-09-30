from django.contrib import admin

from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'cardholder_name',
        'card_type',
        'masked_card',
        'last_4_digits',
        'exp_month',
        'exp_year',
        'created_at',
    )

    list_filter = (
        'card_type',
        'exp_year',
    )

    search_fields = (
        'cardholder_name',
        'last_4_digits',
        'user__username',
        'user__email',
    )