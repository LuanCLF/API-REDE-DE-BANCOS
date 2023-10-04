export interface IBank {
  id?: number;
  number: string;
  agency: string;
  password?: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
  zipcode: string;
}

export interface IBankValidate {
  id: number;
  password: string;
}
