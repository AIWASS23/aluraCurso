DROP DATABASE IF EXISTS cegas_iticdigital;
CREATE DATABASE cegas_iticdigital;

CREATE TABLE IF NOT EXISTS usuarios(
  id TEXT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  categoria TEXT[] NOT NULL,
  situacao VARCHAR(50) NOT NULL,
--   TODO: imagem_url
  senha TEXT NOT NULL
);

INSERT INTO usuarios (id, nome, email, telefone, categoria, situacao, senha) VALUES ('1', 'Admin', 'admin', '999999999', array['Administrador'], 'Ativo', 'admin123');

CREATE TABLE IF NOT EXISTS clientes(
  id TEXT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  cnpj VARCHAR(20) NOT NULL UNIQUE,
  logix VARCHAR(20) NOT NULL UNIQUE,
  arquivado BOOLEAN NOT NULL
--   TODO: imagem_url
);

CREATE TABLE IF NOT EXISTS leituras(
  id TEXT PRIMARY KEY,
  cliente_id TEXT,
  valor INTEGER NOT NULL,
  data_leitura VARCHAR(10) NOT NULL,
  hora_leitura VARCHAR(10) NOT NULL,
  possivel_erro BOOLEAN NOT NULL,
--   TODO: imagem_url,
  FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

CREATE TABLE IF NOT EXISTS medidores(
  id TEXT PRIMARY KEY,
  cliente_id TEXT,
  numero_serie VARCHAR(50),
  gps_latitude VARCHAR(50),
  gps_longitude VARCHAR(50),
  leitura_inicial INTEGER NOT NULL,
  ptz BOOLEAN NOT NULL,
  qr_code TEXT NOT NULL,
  arquivado BOOLEAN NOT NULL,
  percentual_variacao DECIMAL NOT NULL,
--   TODO: este dado é necessário no BD? =>  percentual_variacao DECIMAL NOT NULL
  FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);