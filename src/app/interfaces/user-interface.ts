export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  email: string;
  password: string;
}
