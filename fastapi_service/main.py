import uuid
import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PaymentRequest, PaymentResponse

app = FastAPI(
    title="Payment Processing Service",
    description="Microservice for simulating card authorization and payment transactions.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def luhn_checksum(card_number: str) -> bool:
    """Standard Luhn algorithm for credit card number validation."""
    digits = [int(d) for d in card_number]
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    checksum = sum(odd_digits)
    for d in even_digits:
        checksum += sum(divmod(d * 2, 10))
    return checksum % 10 == 0


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "payment_processor"}


@app.post("/api/payments/process", response_model=PaymentResponse)
def process_payment(payment: PaymentRequest):
    # 1. Expiration check
    now = datetime.datetime.now()
    exp_year = payment.exp_year if payment.exp_year >= 100 else payment.exp_year + 2000
    if exp_year < now.year or (exp_year == now.year and payment.exp_month < now.month):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card has expired."
        )

    # 2. Luhn Algorithm Check
    if not luhn_checksum(payment.card_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card number (failed checksum)."
        )

    # 3. Mask card for safe output: **** **** **** 1234
    last_4 = payment.card_number[-4:]
    masked_card = f"**** **** **** {last_4}"

    # 4. Simulation rules:
    # Amount > 50000 -> Simulated decline (limit exceeded)
    # Card ending in 0000 -> Simulated fraud block
    if last_4 == "0000":
        return PaymentResponse(
            transaction_id=str(uuid.uuid4()),
            status="DECLINED",
            message="Transaction flagged by fraud detection system.",
            amount=payment.amount,
            currency=payment.currency.upper(),
            masked_card=masked_card,
            timestamp=datetime.datetime.utcnow().isoformat() + "Z"
        )

    if payment.amount > 50000:
        return PaymentResponse(
            transaction_id=str(uuid.uuid4()),
            status="DECLINED",
            message="Transaction exceeds single-charge credit limit.",
            amount=payment.amount,
            currency=payment.currency.upper(),
            masked_card=masked_card,
            timestamp=datetime.datetime.utcnow().isoformat() + "Z"
        )

    # Successful transaction
    return PaymentResponse(
        transaction_id=str(uuid.uuid4()),
        status="SUCCESS",
        message="Payment processed successfully.",
        amount=payment.amount,
        currency=payment.currency.upper(),
        masked_card=masked_card,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )