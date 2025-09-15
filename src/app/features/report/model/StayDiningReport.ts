import { IncomeEntry } from './IncomeEntry';

export interface StayDiningReport {
  stablishmentName: string;
  clientName: string;
  startAt: string;
  endAt: string;
  totalEntries: number;
  items: IncomeEntry[];
}

