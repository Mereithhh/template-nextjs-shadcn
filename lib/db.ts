import Database from 'better-sqlite3';


const db = new Database('data/tgi.db');

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS tgi_instances (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    modelId TEXT NOT NULL,
    notes TEXT
  )
`);

export default db; 