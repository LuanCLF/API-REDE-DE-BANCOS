import { RequestHandler } from 'express';

import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

type TField = 'body' | 'header' | 'query' | 'params';

type TGetSchema = <T extends Maybe<AnyObject>>(
  schema: ObjectSchema<T>
) => ObjectSchema<T>;
type TAllSchemas = Record<TField, ObjectSchema<any>>;
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation =
  (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);

    const errorsResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      try {
        schema.validateSync(req[key as TField], {
          abortEarly: false,
        });
      } catch (err) {
        const yupErrors = err as ValidationError;

        let recordErrors: Record<string, string> = {};

        yupErrors.inner.forEach((err) => {
          if (!err.path) return;

          recordErrors[err.path] = err.message;
        });
        errorsResult[key] = recordErrors;
      }
    });

    if (Object.entries(errorsResult).length > 0) {
      return res.status(400).json(errorsResult);
    }

    next();
  };
