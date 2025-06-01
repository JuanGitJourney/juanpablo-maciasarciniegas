export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  envelope_id: string;
  account_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  category: string;
  date: string;
  envelope_id: string;
  account_id: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}