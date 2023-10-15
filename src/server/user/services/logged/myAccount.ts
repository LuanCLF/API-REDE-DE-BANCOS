import { ApiError } from '../../../shared/middlewares/error';
import { dateFormat } from '../../../shared/others/code/dateFormat';
import { userErrorMessages } from '../../../shared/others/messages/messages';
import { UserRepository } from '../../repository/user.repository';

export const MyAccount = async (userID: number) => {
  const userRepositry = new UserRepository();
  const user = await userRepositry.myAccountInformation(userID);

  if (user) {
    const balanceString = user.balance.toString();
    const { accounts, ...rest } = user;
    const userFormated = {
      ...rest,
      balance: Number(balanceString),

      created_at: dateFormat(user.accounts[0].created_at),
      updated_at: dateFormat(user.accounts[0].updated_at),
    };

    return userFormated;
  }

  throw new ApiError(userErrorMessages.userNotFound, 404);
};
