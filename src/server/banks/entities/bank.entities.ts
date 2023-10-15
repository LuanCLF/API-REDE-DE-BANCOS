export interface IBank {
  number: string;
  agency: string;
  name: string;
  created_at: string | Date;
  zipcode: string;
}

export interface IBankID {
  id: number;
}

export interface IBankPassword {
  password: string;
}

export interface IBankAccounts {
  accounts: {
    number: number;
    bank_id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
  }[];
}
