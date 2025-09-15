import { Payment } from './Payment';

export interface Employee {
  id: string;
  establishmentId: string;
  establishmentName: string;
  firstName: string;
  lastName: string;
  salary: number;
  nationalId: string;
  payments: Payment[];
}

