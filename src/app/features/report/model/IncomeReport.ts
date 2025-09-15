import { IncomeEntry } from './IncomeEntry';

export interface IncomeReport {
  stablishmentName: string;
  startAt: string;
  endAt: string;
  items: IncomeEntry[];
  total: number;
}

