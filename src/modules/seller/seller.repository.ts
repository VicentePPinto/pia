import { pool } from '../../infra/db.ts';

export class SellerRepository {

  async existsById(id: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM sellers WHERE id = $1 LIMIT 1',
      [id]
    );

    if (!result.rowCount) {
        console.log(`❌ Seller with ID ${id} does not exist.`);
        return false;
    } else {
        console.log(`✅ Seller with ID ${id} exists.`);
        return result.rows[0];
    }
  }
}