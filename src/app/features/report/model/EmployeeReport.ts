import { Employee } from '../../employee/model/Employee';

export interface EmployeeReport {
  establishmentName: string;
  totalEmployees: number;
  employees: Employee[];
}
