import { pool } from '../../infra/db.ts';
import { normalizeName } from '../../utils/normalize.ts';
export class ClientRepository {

  async findByName(name: string) {
     const normalizedInput = normalizeName(name);
       const query = `
      SELECT *
      FROM clients
    `;

    const result = await pool.query(query);

    const client = result.rows.find((client) => {
      const normalizedClientName = normalizeName(client.name);

      return normalizedClientName.includes(normalizedInput)
        || normalizedInput.includes(normalizedClientName);
    });

    return client ?? null;
  }

  async create(name: string) {
    const query = `
      INSERT INTO clients (name)
      VALUES ($1)
      RETURNING *
    `;

    const result = await pool.query(query, [name]);
    return result.rows[0];
  }
}