export interface RegisterBankDto {
  name: string;
  number: string;
  agency: string;
  password: string;
  zipcode: string;
}

export interface LoginBankDto {
  number: string;
  agency: string;
  password: string;
}
