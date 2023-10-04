export interface CreateBankDto {
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

export interface UpdateBankDto {
  name?: string;
  number?: string;
  agency?: string;
  password?: string;
  zipcode?: string;
}

export interface DeleteBankDto {
  password: string;
}
