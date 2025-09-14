-- Delete and recreate admin user
DELETE FROM users WHERE state_id = 'ADMIN123';

INSERT INTO users (id, name, state_id, password, type, role, first_login)
VALUES (
    uuid_generate_v4(),
    'Admin',
    'ADMIN123',
    'admin123',
    'internal'::user_type,
    'admin'::user_role,
    false
);