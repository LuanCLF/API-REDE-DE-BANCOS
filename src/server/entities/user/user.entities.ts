export interface IAccountsInformation {
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
