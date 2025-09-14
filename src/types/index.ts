// User related types
export type UserType = 'internal' | 'external';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  stateId: string;
  password: string; // In a real app, this would be hashed
  type: UserType;
  role: UserRole;
  firstLogin: boolean;
}

// Drug related types
export interface Drug {
  id: string;
  name: string;
  description: string;
  value: number;
  imageUrl?: string;
}

// Transaction statuses
export type TransactionStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type QueueType = 'internal' | 'external';

// Queue item
export interface QueueItem {
  id: string;
  drugId: string;
  quantity: number;
  userId: string;
  status: TransactionStatus;
  queueType: QueueType;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction history
export interface Transaction {
  id: string;
  drugId: string;
  quantity: number;
  value: number;
  userId: string;
  queueType: QueueType;
  createdAt: Date;
  confirmedAt: Date;
}