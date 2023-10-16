import axios from 'axios';
import { ApiError } from '../../middlewares/error';
import { genericErrorMessages } from '../messages/messages';
import { prisma } from '../../../database/prismaClient';

export interface Izipcode {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const registerZipCode = async (zipcode: Izipcode): Promise<void> => {
  const { cep: zip, logradouro, complemento, bairro, localidade, uf } = zipcode;
  const str = 'Não encontrado';

  await prisma.address.create({
    data: {
      zipcode: zip,
      patio: logradouro || str,
      complement: complemento || str,
      neighborhood: bairro || str,
      locality: localidade || str,
      uf: uf,
    },
  });
};

export const validZipCode = async (zipcode: string): Promise<string> => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`);
  const result: Izipcode = data;

  if (data.erro) {
    throw new ApiError(genericErrorMessages.zipCode, 404);
  }

  const address = await prisma.address.findUnique({
    select: {
      zipcode: true,
    },
    where: {
      zipcode: result.cep,
    },
  });

  if (!address) {
    await registerZipCode(result);
  }

  return result.cep;
};
