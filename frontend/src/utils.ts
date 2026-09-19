import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Cn = (...inputs: ClassValue[])=> {
  return twMerge(clsx(inputs));
}
export default Cn;