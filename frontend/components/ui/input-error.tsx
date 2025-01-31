/* eslint-disable @typescript-eslint/no-explicit-any */

import { renderErrorMessage } from '@/lib/utils';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface ErrorMessageProps {
  message?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-red-500 text-sm">{renderErrorMessage(message)}</p>;
};

export default ErrorMessage;
