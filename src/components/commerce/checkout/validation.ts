/*
 * Client-side checks for a friendly UX only.
 * BACKEND: re-validate everything server-side; the payment gateway is the
 * source of truth for card/UPI validity.
 */

export interface Details {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export type DetailsErrors = Partial<Record<keyof Details, string>>;

export const EMPTY_DETAILS: Details = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^[1-9]\d{5}$/;
const UPI_RE = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export function validateDetails(d: Details, needsAddress: boolean): DetailsErrors {
  const e: DetailsErrors = {};
  if (d.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(d.email.trim())) e.email = "Enter an email like name@example.com — your receipt goes here.";
  if (!PHONE_RE.test(d.phone)) e.phone = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  if (needsAddress) {
    if (d.line1.trim().length < 5) e.line1 = "Enter house number and street.";
    if (d.city.trim().length < 2) e.city = "Enter your city.";
    if (!d.state) e.state = "Choose your state.";
    if (!PINCODE_RE.test(d.pincode)) e.pincode = "Enter a 6-digit PIN code.";
  }
  return e;
}

export type PayMethod = "UPI" | "Card" | "Netbanking";

export interface PaymentInput {
  upiId: string;
  cardNumber: string; // formatted "4111 1111 ..."
  cardExpiry: string; // "MM/YY"
  cardCvv: string;
  cardName: string;
  bank: string;
}

export const EMPTY_PAYMENT: PaymentInput = { upiId: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "", bank: "" };

export type PaymentErrors = Partial<Record<keyof PaymentInput, string>>;

function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

function expiryError(value: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return "Use the MM/YY format.";
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return "Month should be between 01 and 12.";
  const now = new Date();
  const isPast = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
  return isPast ? "This card has expired." : undefined;
}

export function validatePayment(method: PayMethod, p: PaymentInput): PaymentErrors {
  const e: PaymentErrors = {};
  if (method === "UPI") {
    if (!UPI_RE.test(p.upiId.trim())) e.upiId = "Enter a UPI ID like name@okbank.";
  }
  if (method === "Card") {
    const digits = p.cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19 || !luhn(digits)) e.cardNumber = "That card number doesn’t look right.";
    const exp = expiryError(p.cardExpiry);
    if (exp) e.cardExpiry = exp;
    if (!/^\d{3,4}$/.test(p.cardCvv)) e.cardCvv = "3 or 4 digits on the back.";
    if (p.cardName.trim().length < 2) e.cardName = "Name as printed on the card.";
  }
  if (method === "Netbanking" && !p.bank) e.bank = "Choose your bank.";
  return e;
}

/* Input formatters */
export function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function digitsOnly(raw: string, max: number): string {
  return raw.replace(/\D/g, "").slice(0, max);
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank",
  "Bank of Baroda", "Canara Bank", "Union Bank of India", "IDFC FIRST Bank",
] as const;
