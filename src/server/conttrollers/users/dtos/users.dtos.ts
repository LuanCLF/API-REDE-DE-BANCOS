export interface CreateUserDto {
  number: string;
  agency: string;
  name: string;
  cpf: string;
  phone_number?: string;
  email: string;
  password: string;
  zipcode: string;
}

export interface LoginUserDto {
  number: string;
  agency: string;
  cpf: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  cpf?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  zipcode?: string;
}
