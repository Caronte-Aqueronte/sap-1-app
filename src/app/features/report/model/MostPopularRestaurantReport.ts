import { IncomeEntry } from './IncomeEntry';

export interface MostPopularRestaurantReport {
  restaurantName: string;
  items: IncomeEntry[];
  totalEntries: number;
  totalIncome: number;
}
