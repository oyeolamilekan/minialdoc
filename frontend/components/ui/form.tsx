import { FormHTMLAttributes, ReactNode } from 'react'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: FormHTMLAttributes<HTMLFormElement>['onSubmit'];
  children?: ReactNode;
}

export function Form({ onSubmit = () => {}, children, ...props }: FormProps) {
  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  )
}