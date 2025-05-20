export interface ServiceAPIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ServiceAuthResponse<T> extends ServiceAPIResponse<T> {
  token?: string;
}