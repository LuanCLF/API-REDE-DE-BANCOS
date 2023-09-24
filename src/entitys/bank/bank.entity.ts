export interface IBank {
  id: number;
  name: string;
  number: string;
  agency: string;
  password: string;
  zipcode: string;
  created_at: string;
  updated_at: string;
  cep: string;
}

export interface IBankValidate {
  id: number;
  password: string;
}
