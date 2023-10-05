export interface CreateUser {
  number: string;
  agency: string;

  name: string;
  cpf: string;
  phone_number?: string;
  email: string;
  password: string;
  zipcode: string;
}
