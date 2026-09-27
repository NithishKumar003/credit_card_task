from pydantic import BaseModel, Field, field_validator
import datetime
import re


class PaymentRequest(BaseModel):
    cardholder_name: str = Field(..., min_length=2, max_length=100)
    card_number: str = Field(..., min_length=13, max_length=19)
    exp_month: int = Field(..., ge=1, le=12)
    exp_year: int = Field(...)
    cvv: str = Field(..., min_length=3, max_length=4)
    amount: float = Field(..., gt=0, description="Transaction amount in currency units")
    currency: str = Field(default="USD", max_length=3)

    @field_validator("card_number")
    @classmethod
    def clean_card_number(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v)
        if len(cleaned) < 13 or len(cleaned) > 19:
            raise ValueError("Card number must be between 13 and 19 digits.")
        return cleaned

    @field_validator("cvv")
    @classmethod
    def clean_cvv(cls, v: str) -> str:
        cleaned = re.sub(r"\D", "", v)
        if len(cleaned) not in (3, 4):
            raise ValueError("CVV must be 3 or 4 digits.")
        return cleaned


class PaymentResponse(BaseModel):
    transaction_id: str
    status: str  # SUCCESS, FAILED, DECLINED
    message: str
    amount: float
    currency: str
    masked_card: str
    timestamp: str