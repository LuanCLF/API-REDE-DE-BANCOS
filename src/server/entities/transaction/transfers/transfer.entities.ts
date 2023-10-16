export interface ITransferBalance {
  balance: number;
}
export interface ITransferUserDestiny {
  id: number;
}

export interface ITransfersListFromMe {
  transfersFrom: {
    id: number;
    date: Date | string;
    account_origin_number: number;
    account_destiny_number: number;
    value: number;
  }[];
}
export interface ITransfersListToMe {
  transfersTo: {
    id: number;
    date: Date;
    account_origin_number: number;
    account_destiny_number: number;
    value: number;
  }[];
}
