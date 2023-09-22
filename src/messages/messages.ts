const bankErrorMessages = {
  bankNotFound: 'Banco não encontrado',
  bankAlreadyExist: 'Esse banco já está cadastrado',
};
const genericErrorMessages = {
  intern: 'Erro inesperado no servidor',

  unauthorized: 'Sem autorização',
};
const userErrorMessages = {
  userNotFound: 'Cadastro não encontrado',
  userAlreadyExist: 'Usuário já está cadastrado',
  userLoginInvalid: 'Email ou senha incorretos',
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
};
