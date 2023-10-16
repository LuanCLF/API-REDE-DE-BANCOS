import { DepositRepository } from '../../../repositories/transation/deposits/deposit.repository';

export const Deposit = async (userID: number, value: number) => {
  const depositRepository = new DepositRepository();

  const user = await depositRepository.userUpdateBalance(userID, value);

  const { balance, accounts, ...rest } = user;

  await depositRepository.registerDeposit(
    accounts[0].number,
    value,
    new Date()
  );

  const userFormat = {
    account: { accountNumber: accounts[0].number, bank: accounts[0].bank },
    user: rest,

    balance: Number(user.balance).toFixed(2),
  };
  return userFormat;
};
