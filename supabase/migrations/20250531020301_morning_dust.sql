-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('internal', 'external');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  type user_type NOT NULL,
  role user_role NOT NULL,
  first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create drugs table if it doesn't exist
CREATE TABLE IF NOT EXISTS drugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create queue table if it doesn't exist
CREATE TABLE IF NOT EXISTS queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status transaction_status DEFAULT 'pending',
  queue_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  queue_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_state_id ON users(state_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_user_id ON queue(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Insert default admin user if it doesn't exist
INSERT INTO users (id, name, state_id, password, type, role, first_login)
SELECT 
    uuid_generate_v4(),
    'Admin',
    'ADMIN123',
    'admin123',
    'internal',
    'admin',
    false
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE state_id = 'ADMIN123'
);

-- Insert sample drugs if they don't exist
INSERT INTO drugs (name, description, value, image_url)
SELECT 'Paiero', 'Cigarro artesanal de primeira qualidade', 80.00, 'https://images.pexels.com/photos/1466434/pexels-photo-1466434.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM drugs WHERE name = 'Paiero');

INSERT INTO drugs (name, description, value, image_url)
SELECT 'Dream', 'Sonho em forma de pó', 150.00, 'https://images.pexels.com/photos/6615091/pexels-photo-6615091.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM drugs WHERE name = 'Dream');

INSERT INTO drugs (name, description, value, image_url)
SELECT 'Green Leaf', 'Erva natural premium', 120.00, 'https://images.pexels.com/photos/606506/pexels-photo-606506.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM drugs WHERE name = 'Green Leaf');