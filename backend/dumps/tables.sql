-- Crear la base de datos 'listas' si no existe y utilizarla
CREATE DATABASE listas;

\connect listas;

-- Crear la tabla 'users'
CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'groups'
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'user_group'
CREATE TABLE IF NOT EXISTS user_group (
    id SERIAL NOT NULL,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'lists'
CREATE TABLE IF NOT EXISTS lists (
    id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'items'
CREATE TABLE IF NOT EXISTS items (
    id SERIAL NOT NULL,
    description text NOT NULL,
    is_completed boolean NULL DEFAULT false,
    quantity numeric(10, 2) NULL,
    notes text NULL,
    priority character varying(50) NULL,
    due_date date NULL,
    creation_date date NULL DEFAULT current_date,
    modified_date date NULL DEFAULT current_date,
    assigned_to integer NULL,
    reminder timestamp without time zone NULL,
    url character varying(2048) NULL,
    cost numeric(10, 2) NULL,
    location text NULL,
    recurring character varying(50) NULL,
    list_id integer NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'tags'
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'item_tag'
CREATE TABLE IF NOT EXISTS item_tag (
    id SERIAL NOT NULL,
    item_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la tabla 'comments'
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL NOT NULL,
    content text NOT NULL,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at timestamp without time zone NULL DEFAULT current_timestamp,
    PRIMARY KEY (id)
);

-- Agregar las restricciones de clave externa después de crear todas las tablas
ALTER TABLE groups
    ADD FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_group
    ADD FOREIGN KEY (user_id) REFERENCES users(id),
    ADD FOREIGN KEY (group_id) REFERENCES groups(id);

ALTER TABLE lists
    ADD FOREIGN KEY (group_id) REFERENCES groups(id);

ALTER TABLE items
    ADD FOREIGN KEY (list_id) REFERENCES lists(id);

ALTER TABLE item_tag
    ADD FOREIGN KEY (item_id) REFERENCES items(id),
    ADD FOREIGN KEY (tag_id) REFERENCES tags(id);

ALTER TABLE comments
    ADD FOREIGN KEY (item_id) REFERENCES items(id),
    ADD FOREIGN KEY (user_id) REFERENCES users(id);
