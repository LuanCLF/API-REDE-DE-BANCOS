import axios from 'axios';
import { pool } from '../enviroment/env';

export interface Izipcode {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const registerZipCode = async (zipcode: Izipcode): Promise<string> => {
  const { cep: zip, logradouro, complemento, bairro, localidade, uf } = zipcode;
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
};

export const getZipCode = async (
  zipcode: string
): Promise<string | undefined> => {
  const { data } = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`);
  const result: Izipcode = data;

  if (data.erro) {
    if (data.erro) {
      return undefined;
    }
    console.log(data);
    console.log(data);
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
  }
};
