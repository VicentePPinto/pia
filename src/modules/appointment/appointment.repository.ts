import { pool } from '../../infra/db.ts';

export class AppointmentRepository {

  async findConflict(
    sellerId: number,
    startsAt: Date,
    endsAt: Date,
  ) {

    const query = `
      SELECT *
      FROM appointments
      WHERE seller_id = $1
      AND datetime < $3
      AND datetime > $2
      LIMIT 1
    `;

    const result = await pool.query(query, [
      sellerId,
      startsAt.toISOString(),
      endsAt.toISOString(),
    ]);

    return result.rows[0] ?? null;
  }
  async findByClientAndDatetime(clientId: number, datetime: Date) {
    const query = `
      SELECT * FROM appointments
      WHERE client_id = $1
      AND datetime = $2
      LIMIT 1
    `;

    const result = await pool.query(query, [clientId, datetime]);
    return result.rows[0];
  }
  async findBySellerClientAndDatetime(sellerId: number, clientId: number, datetime: Date) {
    const query = `
      SELECT * FROM appointments
      WHERE seller_id = $1
      AND client_id = $2
      AND datetime = $3
      LIMIT 1
    `;

    const result = await pool.query(query, [sellerId, clientId, datetime]);
    return result.rows[0];
  }
  async checkSellerConflict(sellerId: number, datetime: Date) {
  const result = await pool.query(
    `SELECT 1 FROM appointments
     WHERE seller_id = $1 AND datetime = $2
     LIMIT 1`,
    [sellerId, datetime]
  );

  if (!result.rowCount) {
    console.log(`✅ No conflict for client ID ${sellerId} at ${datetime.toISOString()}.`);
    return result
  } else {
    console.log(`❌ Conflict found for client ID ${sellerId} at ${datetime.toISOString()}.`);
    return false
  }
}

async checkClientConflict(clientId: number, datetime: Date) {
  const result = await pool.query(
    `SELECT 1 FROM appointments
     WHERE client_id = $1 AND datetime = $2
     LIMIT 1`,
    [clientId, datetime]
  );
  if (!result.rowCount) {
    console.log(`✅ No conflict for client ID ${clientId} at ${datetime.toISOString()}.`);
    return result
  } else {
    console.log(`❌ Conflict found for client ID ${clientId} at ${datetime.toISOString()}.`);
    return false
  }

}
  async delete(id: number) {
  await pool.query(
    'DELETE FROM appointments WHERE id = $1',
    [id]
  );
}
  async create(data: {
    clientId: number;
    sellerId: number;
    datetime: Date;
    reason?: string;
  }) {
    const query = `
      INSERT INTO appointments (client_id, seller_id, datetime, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      data.clientId,
      data.sellerId,
      data.datetime,
      data.reason || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async update (id: number, newdatetime: Date){
    const query = `
      UPDATE appointments
      SET datetime = $1
      WHERE id = $2
      RETURNING *
    `;

    const values = [
      newdatetime,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}