import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import Transaction

def export_transactions_csv(modeladmin, request, queryset):
    response = HttpResponse(
        content_type='text/csv'
    )

    response['Content-Disposition'] = (
        'attachment; filename="transactions.csv"'
    )

    writer = csv.writer(response)

    writer.writerow([
        'ID',
        'Transaction ID',
        'User',
        'Amount',
        'Currency',
        'Status',
        'Masked Card',
        'Message',
        'Created At',
    ])

    for transaction in queryset:
        writer.writerow([
            transaction.id,
            transaction.transaction_id,
            transaction.user.username,
            transaction.amount,
            transaction.currency,
            transaction.status,
            transaction.masked_card,
            transaction.message,
            transaction.created_at,
        ])

    return response


export_transactions_csv.short_description = 'Export selected transactions as CSV'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'transaction_id',
        'user',
        'amount',
        'currency',
        'status',
        'masked_card',
        'created_at',
    )

    list_filter = (
        'status',
        'currency',
        'created_at',
    )

    search_fields = (
        'transaction_id',
        'user__username',
        'user__email',
        'masked_card',
    )

    readonly_fields = (
        'transaction_id',
        'created_at',
    )
    
    actions = [export_transactions_csv]