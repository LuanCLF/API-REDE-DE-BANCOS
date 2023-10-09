export interface DepositOrWithdrawalsDto {
  value: number;
}

export interface TransferDto {
  value: number;
  destinationUserID?: number;
  destinationUserEmail?: string;
}
