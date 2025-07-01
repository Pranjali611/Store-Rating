-- Create initial admin user
-- Password: Admin123!
INSERT INTO users (id, name, email, password, address, role) VALUES 
('admin-001', 'System Administrator', 'admin@storerating.com', '$2b$10$rQZ8kHWKtGKVOmBGWxvHKOqmY8qJZvQxvQxvQxvQxvQxvQxvQxvQx', '123 Admin Street, Admin City', 'ADMIN');

-- Create sample store owners
INSERT INTO users (id, name, email, password, address, role) VALUES 
('owner-001', 'John Store Owner Smith', 'john@techstore.com', '$2b$10$rQZ8kHWKtGKVOmBGWxvHKOqmY8qJZvQxvQxvQxvQxvQxvQxvQxvQx', '456 Business Ave, Commerce City', 'STORE_OWNER'),
('owner-002', 'Sarah Fashion Store Johnson', 'sarah@fashionhub.com', '$2b$10$rQZ8kHWKtGKVOmBGWxvHKOqmY8qJZvQxvQxvQxvQxvQxvQxvQxvQx', '789 Fashion Blvd, Style Town', 'STORE_OWNER');

-- Create sample stores
INSERT INTO stores (id, name, email, address, "ownerId") VALUES 
('store-001', 'Tech Electronics Store', 'contact@techstore.com', '456 Business Ave, Commerce City', 'owner-001'),
('store-002', 'Fashion Hub Boutique', 'info@fashionhub.com', '789 Fashion Blvd, Style Town', 'owner-002');

-- Create sample normal users
INSERT INTO users (id, name, email, password, address, role) VALUES 
('user-001', 'Alice Regular Customer Johnson', 'alice@email.com', '$2b$10$rQZ8kHWKtGKVOmBGWxvHKOqmY8qJZvQxvQxvQxvQxvQxvQxvQxvQx', '321 Customer Lane, User City', 'USER'),
('user-002', 'Bob Happy Shopper Williams', 'bob@email.com', '$2b$10$rQZ8kHWKtGKVOmBGWxvHKOqmY8qJZvQxvQxvQxvQxvQxvQxvQxvQx', '654 Shopper Street, Buyer Town', 'USER');

-- Create sample ratings
INSERT INTO ratings (id, rating, "userId", "storeId") VALUES 
('rating-001', 5, 'user-001', 'store-001'),
('rating-002', 4, 'user-002', 'store-001'),
('rating-003', 5, 'user-001', 'store-002'),
('rating-004', 3, 'user-002', 'store-002');
