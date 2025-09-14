-- Create enum types
CREATE TYPE user_type AS ENUM ('internal', 'external');
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE transaction_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  type user_type NOT NULL,
  role user_role NOT NULL,
  first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create drugs table
CREATE TABLE drugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create queue table
CREATE TABLE queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status transaction_status DEFAULT 'pending',
  queue_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  queue_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create default admin user
INSERT INTO users (id, name, state_id, password, type, role, first_login)
VALUES (
  uuid_generate_v4(),
  'Admin',
  'ADMIN123',
  'admin123',
  'internal',
  'admin',
  false
);

-- Create indexes
CREATE INDEX idx_users_state_id ON users(state_id);
CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_queue_user_id ON queue(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);