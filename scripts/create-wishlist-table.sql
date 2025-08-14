-- Create the wishlist table with the requested columns
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('checkable', 'contributable')),
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample data
INSERT INTO wishlist (name, image, description, type) VALUES
('Wireless Headphones', '/placeholder.svg?height=200&width=200', 'High-quality noise-canceling headphones for music and calls', 'checkable'),
('Coffee Machine', '/placeholder.svg?height=200&width=200', 'Professional espresso machine for the perfect morning brew', 'contributable'),
('Running Shoes', '/placeholder.svg?height=200&width=200', 'Comfortable running shoes for daily workouts', 'checkable'),
('Laptop Stand', '/placeholder.svg?height=200&width=200', 'Ergonomic laptop stand for better posture', 'contributable');
