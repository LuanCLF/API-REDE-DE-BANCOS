export interface IBank {
  id: number;
  name: string;
  number: string;
  agency: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  zipcode: string;
}

export interface IBankValidate {
  id: number;
  password: string;
}

export interface IAccounts {
  number: number;
  bank_id: number;
  balance: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  zipcode: string;
}
