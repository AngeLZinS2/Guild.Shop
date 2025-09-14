import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Drug, QueueItem, Transaction, TransactionStatus } from '../types'; // Assuming your types are correctly defined
import { supabase } from '../lib/supabase';

interface DataContextType {
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'firstLogin'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Drugs
  drugs: Drug[];
  addDrug: (drug: Omit<Drug, 'id'>) => Promise<void>;
  updateDrug: (id: string, updates: Partial<Omit<Drug, 'id'>>) => Promise<void>;
  deleteDrug: (id: string) => Promise<void>;

  // Queue
  queue: QueueItem[];
  addToQueue: (item: Omit<QueueItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateQueueStatus: (id: string, status: TransactionStatus) => Promise<void>;
  refreshQueue: () => Promise<void>; // Ensure this is what you intended for refreshQueue

  // Transactions
  transactions: Transaction[];
  getUserTransactions: (userId: string) => Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchDrugs();
    fetchQueue();
    fetchTransactions();
  }, []);

  // Fetch functions
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
      // Consider throwing the error or setting an error state
      // if your UI needs to react to failed data fetches.
      return;
    }
    if (data) {
      setUsers(data.map(user => ({
        id: user.id,
        name: user.name,
        stateId: user.state_id,
        password: user.password, // Be cautious about fetching/storing passwords client-side
        type: user.type,
        role: user.role,
        firstLogin: user.first_login
      })));
    } else {
      setUsers([]);
    }
  };

  const fetchDrugs = async () => {
    const { data, error } = await supabase.from('drugs').select('*');
    if (error) {
      console.error('Error fetching drugs:', error);
      return;
    }
    if (data) {
      setDrugs(data.map(drug => ({
        id: drug.id,
        name: drug.name,
        description: drug.description,
        value: drug.value,
        imageUrl: drug.image_url
      })));
    } else {
      setDrugs([]);
    }
  };

  const fetchQueue = async () => {
    const { data, error } = await supabase.from('queue').select('*').order('created_at', { ascending: true }); // Example: order queue items
    if (error) {
      console.error('Error fetching queue:', error);
      return;
    }
    if (data) {
      setQueue(data.map(item => ({
        id: item.id,
        drugId: item.drug_id,
        quantity: item.quantity,
        userId: item.user_id,
        status: item.status as TransactionStatus, // Cast if necessary and types align
        queueType: item.queue_type,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      })));
    } else {
      setQueue([]);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }); // Example: order transactions
    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }
    if (data) {
      setTransactions(data.map(transaction => ({
        id: transaction.id,
        drugId: transaction.drug_id,
        quantity: transaction.quantity,
        value: transaction.value,
        userId: transaction.user_id,
        queueType: transaction.queue_type,
        createdAt: new Date(transaction.created_at),
        confirmedAt: transaction.confirmed_at ? new Date(transaction.confirmed_at) : undefined // Handle potentially null confirmed_at
      })));
    } else {
      setTransactions([]);
    }
  };

  // User operations
  const addUser = async (userData: Omit<User, 'id' | 'firstLogin'>) => {
    // Consider client-side validation before sending to Supabase
    const newUser = {
      id: uuidv4(), // Generate ID client-side or let Supabase do it (if configured)
      name: userData.name,
      state_id: userData.stateId,
      password: userData.password, // Ensure this is handled securely (e.g., hashed server-side if it's a raw password)
      type: userData.type,
      role: userData.role,
      first_login: true
    };
    const { error } = await supabase.from('users').insert(newUser);

    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }
    await fetchUsers(); // Re-fetch users list
  };

  const updateUser = async (id: string, updates: Partial<Omit<User, 'id'>>) => {
    // Map camelCase to snake_case for Supabase
    const supabaseUpdates: { [key: string]: any } = {};
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.stateId !== undefined) supabaseUpdates.state_id = updates.stateId;
    if (updates.password !== undefined) supabaseUpdates.password = updates.password; // Handle password updates with care
    if (updates.type !== undefined) supabaseUpdates.type = updates.type;
    if (updates.role !== undefined) supabaseUpdates.role = updates.role;
    if (updates.firstLogin !== undefined) supabaseUpdates.first_login = updates.firstLogin;

    const { error } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
    await fetchUsers();
  };

  // Drug operations
  const addDrug = async (drugData: Omit<Drug, 'id'>) => {
    const newDrug = {
      id: uuidv4(),
      name: drugData.name,
      description: drugData.description,
      value: drugData.value,
      image_url: drugData.imageUrl
    };
    const { error } = await supabase.from('drugs').insert(newDrug);

    if (error) {
      console.error('Error adding drug:', error);
      throw error;
    }
    await fetchDrugs();
  };

  const updateDrug = async (id: string, updates: Partial<Omit<Drug, 'id'>>) => {
    const supabaseUpdates: { [key: string]: any } = {};
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.description !== undefined) supabaseUpdates.description = updates.description;
    if (updates.value !== undefined) supabaseUpdates.value = updates.value;
    if (updates.imageUrl !== undefined) supabaseUpdates.image_url = updates.imageUrl;

    const { error } = await supabase
      .from('drugs')
      .update(supabaseUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating drug:', error);
      throw error;
    }
    await fetchDrugs();
  };

  const deleteDrug = async (id: string) => {
    const { error } = await supabase
      .from('drugs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting drug:', error);
      throw error;
    }
    await fetchDrugs();
  };

  // Queue operations
  const addToQueue = async (itemData: Omit<QueueItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toISOString();
    const newItem = {
      id: uuidv4(),
      drug_id: itemData.drugId,
      quantity: itemData.quantity,
      user_id: itemData.userId,
      queue_type: itemData.queueType,
      status: 'pending' as TransactionStatus,
      created_at: now,
      updated_at: now
    };
    const { error } = await supabase.from('queue').insert(newItem);

    if (error) {
      console.error('Error adding to queue:', error);
      throw error;
    }
    await fetchQueue();
  };

  const updateQueueStatus = async (id: string, status: TransactionStatus) => {
    const now = new Date().toISOString();

    const { error: queueError } = await supabase
      .from('queue')
      .update({
        status,
        updated_at: now
      })
      .eq('id', id)
      .select() // Optionally select the updated item to avoid finding it manually
      .single(); // If you expect only one item to be updated and want it back

    if (queueError) {
      console.error('Error updating queue status:', queueError);
      throw queueError;
    }

    // Refetch queue to ensure local state is up-to-date before proceeding
    // This is simpler than relying on the returned value from 'update',
    // though using the returned value can be more efficient.
    await fetchQueue(); 
    // If you used .select().single() and it was successful, 'queueData' above would hold the updated item.

    if (status === 'completed') {
      // Find the item from the *potentially updated* local state
      const queueItem = queue.find(item => item.id === id);

      if (!queueItem) {
        const err = new Error(`Queue item with id ${id} not found after status update.`);
        console.error(err);
        // Decide if to throw, or just log and skip transaction.
        // Throwing might be better to signal inconsistency.
        throw err;
      }

      // Ensure the status in the found item reflects 'completed' if logic depends on it here.
      // Since we just fetched, it should be up-to-date.

      const drug = drugs.find(d => d.id === queueItem.drugId);

      if (!drug) {
        const err = new Error(`Drug with id ${queueItem.drugId} not found for queue item ${id}.`);
        console.error(err);
        // Consider fetching drugs again or throwing
        // await fetchDrugs(); // Could try to refetch drugs
        throw err;
      }

      const transactionData = {
        id: uuidv4(),
        drug_id: queueItem.drugId,
        quantity: queueItem.quantity,
        value: drug.value * queueItem.quantity,
        user_id: queueItem.userId,
        queue_type: queueItem.queueType,
        created_at: queueItem.createdAt.toISOString(), // This is the original creation time of the queue item
        confirmed_at: now // This is the confirmation time
      };

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        throw transactionError;
      }
      await fetchTransactions(); // Fetch transactions again as a new one was added
    }
    // No need for Promise.all here if fetchQueue was already called and fetchTransactions conditionally.
    // If status wasn't 'completed', only fetchQueue was needed.
    // If it was completed, both fetchQueue (already done) and fetchTransactions (done) were needed.
  };

  const refreshQueue = async () => {
    await fetchQueue();
  };

  // Transactions operations
  const getUserTransactions = (userId: string) => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  return (
    <DataContext.Provider value={{
      users,
      addUser,
      updateUser,
      deleteUser,

      drugs,
      addDrug,
      updateDrug,
      deleteDrug,

      queue,
      addToQueue,
      updateQueueStatus,
      refreshQueue, // Now implemented

      transactions,
      getUserTransactions
    }}>
      {children}
    </DataContext.Provider>
  );
};