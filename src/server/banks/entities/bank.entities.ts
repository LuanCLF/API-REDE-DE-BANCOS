export interface IBank {
  id?: number;
  number: string;
  agency: string;
  password?: string;
  name: string;
  created_at: string | Date;
  updated_at?: string | Date;
  zipcode: string;
}

export interface IBankValidate {
  id: number;
  password: string;
}
