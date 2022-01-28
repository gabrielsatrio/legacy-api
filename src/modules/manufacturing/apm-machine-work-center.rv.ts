import { isAuth } from '@/middlewares/is-auth';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection, In } from 'typeorm';
import { MachineWorkCenter } from './entities/apm-machine-work-center';
import { MachineWorkCenterView } from './entities/apm-machine-work-center.vw';

@Resolver(MachineWorkCenter)
export class MachineWorkCenterResolver {
  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getMachineWorkCentersByContract(
    @Arg('contract', () => [String]) contract: string[]
  ): Promise<MachineWorkCenterView[] | undefined> {
    return await MachineWorkCenterView.find({
      where: {
        contract: In(contract)
      }
    });
  }

  @Query(() => MachineWorkCenterView, { nullable: true })
  @UseMiddleware(isAuth)
  async getMachineWorkCenter(
    @Arg('workCenterNo') workCenterNo: string,
    @Arg('contract') contract: string
  ): Promise<MachineWorkCenterView | undefined> {
    return await MachineWorkCenterView.findOne({ workCenterNo, contract });
  }

  @Query(() => [MachineWorkCenterView])
  @UseMiddleware(isAuth)
  async getAvailMachineWorkCentersByContract(
    @Arg('contract') contract: string
  ): Promise<MachineWorkCenterView[] | undefined> {
    const sql = `
      SELECT   work_center_no AS "workCenterNo",
               contract AS "contract",
               description AS "description",
               status AS "status",
               created_at AS "createdAt",
               updated_at AS "updatedAt",
               ROWID AS "objId"
      FROM     ROB_APM_MACH_WORK_CENTER ramwc
      WHERE    ramwc.contract = :contract
      AND      (ramwc.contract, ramwc.work_center_no) NOT IN (SELECT ram.contract,
                                                                     ram.work_center_no
                                                              FROM   rob_apm_machine ram
                                                              WHERE  ram.contract = ramwc.contract)
      ORDER BY ramwc.work_center_no
    `;
    const results = await getConnection().query(sql, [contract]);
    return results;
  }
}
