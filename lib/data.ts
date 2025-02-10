import { randomUUID } from 'crypto';
import db from './db';
import { TGIInstance } from '@/types/tgi';

export const tgiService = {
  // 获取所有实例
  getAllInstances: (): TGIInstance[] => {
    const stmt = db.prepare('SELECT * FROM tgi_instances');
    return stmt.all() as TGIInstance[];
  },

  // 获取单个实例
  getInstance: (id: string): TGIInstance | null => {
    const stmt = db.prepare('SELECT * FROM tgi_instances WHERE id = ?');
    return stmt.get(id) as TGIInstance | null;
  },

  getInstanceByModel: (id: string): TGIInstance | null => {
    const stmt = db.prepare('SELECT * FROM tgi_instances WHERE modelId = ?');
    return stmt.get(id) as TGIInstance | null;
  },

  // 创建新实例
  createInstance: (instance: Omit<TGIInstance, 'id'>): TGIInstance => {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO tgi_instances (id, url, modelId, notes)
      VALUES (?, ?, ?,  ?)
    `);

    stmt.run(id, instance.url, instance.modelId, instance.notes);
    return { id, ...instance };
  },

  // 更新实例
  updateInstance: (instance: TGIInstance): TGIInstance => {
    const stmt = db.prepare(`
      UPDATE tgi_instances 
      SET url = ?, modelId = ?, notes = ?
      WHERE id = ?
    `);

    stmt.run(
      instance.url,
      instance.modelId,
      instance.notes,
      instance.id
    );
    return instance;
  },

  // 删除实例
  deleteInstance: (id: string): void => {
    const stmt = db.prepare('DELETE FROM tgi_instances WHERE id = ?');
    stmt.run(id);
  }
};
