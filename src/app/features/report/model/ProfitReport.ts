import { Payment } from '../../employee/model/Payment';
import { CostEntry } from './CostEntry';
import { IncomeEntry } from './IncomeEntry';

export interface ProfitReport {
  totalProfit: number;
  totalIncome: number;
  totalCost: number;
  incomes: IncomeEntry[];
  costs: CostEntry[];
  payments: Payment[];
}
