export type ServiceResult<T = any> = {
  success: boolean;
  code?: string;
  data?: T;
};