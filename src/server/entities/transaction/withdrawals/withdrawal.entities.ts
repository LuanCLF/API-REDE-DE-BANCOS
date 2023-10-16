export interface IWithdrawalUserUpdate {
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

export interface IWithdrawalsArray {
  withdrawals: {
    id: number;
    date: Date;
    account_number: number;
    value: number;
  }[];
}

export interface IWithdrawalBalance {
  balance: number;
}
