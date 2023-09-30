import axios from 'axios';
import { pool } from '../enviroment/env';
import { ApiError } from '../bank/middlewares/error';
import { genericErrorMessages } from '../messages/messages';

export interface Izipcode {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const registerZipCode = async (zipcode: Izipcode): Promise<string> => {
  try {
    const {
      cep: zip,
      logradouro,
      complemento,
      bairro,
      localidade,
      uf,
    } = zipcode;
    const str = 'Não encontrado';
    const queryAddress =
      'insert into addresses (zipcode, patio, complement, neighborhood, locality, UF) values ($1,$2,$3,$4,$5,$6) returning zipcode';
    const { rows } = await pool.query(queryAddress, [
      zip,
      logradouro || str,
      complemento || str,
      bairro || str,
      localidade || str,
      uf,
    ]);
    return rows[0].zipcode;
  } catch (error) {
    throw new Error();
  }
};

export const getZipCode = async (zipcode: string): Promise<string> => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`);
  const result: Izipcode = data;

  if (data.erro) {
    throw new ApiError(genericErrorMessages.zipCode, 404);
  }

  const { rowCount: addressArray } = await pool.query(
    `select zipcode from addresses where zipcode = $1`,
    [result.cep]
  );

  let finalZipCode = result.cep;
  if (addressArray < 1) {
    const zip = await registerZipCode(result);
    finalZipCode = zip;
  }
  return finalZipCode;
};
