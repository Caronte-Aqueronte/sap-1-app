export interface SavePaymentRequestDTO {
  employeeId: string;
  amount: number;
  payedAt?: string | null;
}
