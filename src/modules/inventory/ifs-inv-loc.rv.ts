import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { mapError } from '../../utils/map-error';
import { InventoryLocation } from './entities/ifs-inv-loc.vw';

@Resolver(InventoryLocation)
export class InventoryLocationResolver {
  @Query(() => InventoryLocation, { nullable: true })
  @UseMiddleware(isAuth)
  async getRandomLocation(
    @Arg('contract') contract: string,
    @Arg('numOfLoc') numOfLoc: number
  ): Promise<any | undefined> {
    try {
      const sql = `SELECT DISTINCT location_no
      FROM   (SELECT   DISTINCT (bay_no || '-' || row_no || '-' || tier_no) AS location_no
              FROM     inventory_location
              WHERE    location_no LIKE 'FG%'
              AND      contract = :contract
              ORDER BY DBMS_RANDOM.VALUE)
      WHERE  ROWNUM <= :numOfLoc`;

      // const sql1 = `SELECT LISTAGG(location_no, ';') WITHIN GROUP (ORDER BY location_no) AS location_no
      // FROM   (SELECT   DISTINCT (bay_no || '-' || row_no || '-' || tier_no) AS location_no
      //         FROM     inventory_location
      //         WHERE    location_no LIKE 'FG%'
      //         AND      contract = :contract
      //         ORDER BY DBMS_RANDOM.VALUE)
      // WHERE  ROWNUM <= 4`;
      const result = await getConnection().query(sql, [contract, numOfLoc]);
      const length = Object.keys(result).length;
      const locationNo = [];

      for (let i = 0; i < length; i++) {
        locationNo.push(result[i].LOCATION_NO);
      }

      console.log('array locationNo', locationNo);
      const arrObj = { ...locationNo };
      console.log(arrObj);
      const final = locationNo.toString();
      return { locationNo: final };

      //return { locationNo: final };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  async startOpname(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<any | undefined> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.START_STOCK_OPNAME(:contract, :username, :tanggal)`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }

  async finishOpname(
    @Arg('contract') contract: string,
    @Arg('username') username: string,
    @Arg('tanggal') tanggal: Date
  ): Promise<any | undefined> {
    try {
      const sql = `BEGIN GBR_STOCK_OPNAME_API.FINISH_STOCK_OPNAME(:contract, :username, :tanggal)`;
      const result = await getConnection().query(sql, [
        contract,
        username,
        tanggal
      ]);
      const status = result[0].STATUS;
      return { status };
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
