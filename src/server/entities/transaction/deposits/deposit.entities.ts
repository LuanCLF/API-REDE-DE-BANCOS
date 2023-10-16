export interface IDepositUserUpdate {
  name: string;
  cpf: string;
  balance: number;
  accounts: {
    number: number;
    bank: {
      number: string;
      agency: string;
    };
  }[];
}

export interface IDepositArray {
  deposits: {
    id: number;
    date: Date;
    account_number: number;
    value: number;
  }[];
}
