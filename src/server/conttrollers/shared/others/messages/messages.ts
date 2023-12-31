const bankErrorMessages = {
  bankNotFound: 'Banco não encontrado',
  bankAlreadyExist: 'Esse banco já está cadastrado',
};
const genericErrorMessages = {
  intern: 'Erro inesperado no servidor',
  zipCode: 'Endereço não encontrado',
  unauthorized: 'Não autorizado',
  requestEmpty: 'Não há nada no corpo da requisição',
};
const userErrorMessages = {
  userNotFound: 'Cadastro não encontrado',
  userAlreadyExist: 'Usuário já está cadastrado',
  userLoginInvalid: 'Email ou senha incorretos',
};
const withdrawalErrorMessage = {
  lessThanNecessary: 'O valor informado não está disponivel para saque',
};
const transferErrorMessage = {
  lessThanNecessary: 'O valor informado não está disponivel para transferência',
  sendSomething: `Envie ao menos uma informação do destinatário, o 'destinationUserID' ou 'destinationUserEmail'`,
  recipientNotFound: 'Destinatário não encontrado',
  sameUser: 'Não pode fazer transferência para si mesmo',
};

const midleErrorMessages = {
  phoneInvalid: 'O número de celular deve ser composto só por números',
};

const bankSucessMessage = {
  logged: 'Admin logado',
};

const userSucessMessage = {
  logged: 'Usuário logado',
};

export {
  bankErrorMessages,
  userErrorMessages,
  genericErrorMessages,
  midleErrorMessages,
  bankSucessMessage,
  userSucessMessage,
  withdrawalErrorMessage,
  transferErrorMessage,
};
