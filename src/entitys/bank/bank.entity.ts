export interface IBank {
  id: number;
  name: string;
  number: string;
  agency: string;
  password: string;
  created_at: string;
  updated_at: string;
  zipcode: string;
}

export interface IBankValidate {
  id: number;
  password: string;
}
