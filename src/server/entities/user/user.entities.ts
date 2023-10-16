export interface IAccountInformation {
  cpf: string;
  email: string;
  name: string;
  phone_number: string | null;
  zipcode: string;
  balance: number;
  accounts: {
    bank_id: number;
    created_at: Date;
    updated_at: Date;
  }[];
}
export interface IAccountFormated {
  balance: number;
  created_at: string;
  updated_at: string;
  cpf: string;
  email: string;
  name: string;
  phone_number: string | null;
  zipcode: string;
}

export interface IAccountLogin {
  id: number;
  password: string;
}

export interface IAccountNumber {
  number: number;
}
export interface IAccount {
  accounts: {
    number: number;
    bank_id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
  }[];
}
