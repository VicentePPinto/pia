CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  function VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL,
  reason TEXT,
  client_id INT NOT NULL,
  seller_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_clients FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_sellers FOREIGN KEY (seller_id) REFERENCES sellers(id)
);

CREATE INDEX idx_appointments_seller_datetime
ON appointments (seller_id, datetime);

INSERT INTO clients (name, email) 
VALUES ('João Silva', 'joao@email.com'), 
('Maria Santos', 'maria@email.com'), 
('Carlos Oliveira', 'carlos@email.com'), 
('Ana Costa', 'ana@email.com'), 
('Pedro Almeida', 'pedro@email.com');

INSERT INTO sellers (name, email, function) 
VALUES ('Vicente Pinto', 'vicente@mail.com', 'Sales Manager'), 
('Erick Wendel', 'erick@mail.com', 'Sales Associate'),
('Carlos Junior', 'carlos@mail.com', 'Sales Associate');