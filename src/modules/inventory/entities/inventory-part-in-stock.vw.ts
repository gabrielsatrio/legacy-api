import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_INVENTORY_PART_IN_STOCK_V')
@ObjectType()
export class InventoryPartInStockView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'CONFIGURATION_ID' })
  configurationId!: string;

  @Field()
  @PrimaryColumn({ name: 'LOCATION_NO' })
  locationNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @PrimaryColumn({ name: 'SERIAL_NO' })
  serialNo!: string;

  @Field()
  @PrimaryColumn({ name: 'ENG_CHG_LEVEL' })
  engChgLevel!: string;

  @Field()
  @PrimaryColumn({ name: 'WAIV_DEV_REJ_NO' })
  waivDevRejNo!: string;

  @Field()
  @PrimaryColumn({ name: 'ACTIVITY_SEQ' })
  activitySeq!: number;

  @Field()
  @Column({ name: 'AVG_UNIT_TRANSIT_COST' })
  avgUnitTransitCost!: number;

  @Field({ nullable: true })
  @Column({ name: 'COUNT_VARIANCE' })
  countVariance?: number;

  @Field({ nullable: true })
  @Column({ name: 'EXPIRATION_DATE' })
  expirationDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'FREEZE_FLAG' })
  freezeFlag?: string;

  @Field()
  @Column({ name: 'FREEZE_FLAG_DB' })
  freezeFlagDb!: string;

  @Field()
  @Column({ name: 'LAST_ACTIVITY_DATE' })
  lastActivityDate!: Date;

  @Field({ nullable: true })
  @Column({ name: 'LAST_COUNT_DATE' })
  lastCountDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'LOCATION_TYPE' })
  locationType?: string;

  @Field()
  @Column({ name: 'LOCATION_TYPE_DB' })
  locationTypeDb!: string;

  @Field()
  @Column({ name: 'QTY_IN_TRANSIT' })
  qtyInTransit!: number;

  @Field()
  @Column({ name: 'QTY_ONHAND' })
  qtyOnhand!: number;

  @Field()
  @Column({ name: 'QTY_RESERVED' })
  qtyReserved!: number;

  @Field({ nullable: true })
  @Column({ name: 'RECEIPT_DATE' })
  receiptDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'SOURCE' })
  source?: string;

  @Field()
  @Column({ name: 'WAREHOUSE' })
  warehouse!: string;

  @Field()
  @Column({ name: 'BAY_NO' })
  bayNo!: string;

  @Field()
  @Column({ name: 'ROW_NO' })
  rowNo!: string;

  @Field()
  @Column({ name: 'TIER_NO' })
  tierNo!: string;

  @Field()
  @Column({ name: 'BIN_NO' })
  binNo!: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE' })
  conditionCode?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONDITION_CODE_DB' })
  conditionCodeDb?: string;

  @Field({ nullable: true })
  @Column({ name: 'AVAILABILITY_CONTROL_ID' })
  availabilityControlId?: string;

  @Field({ nullable: true })
  @Column({ name: 'PROJECT_ID' })
  projectId?: string;

  @Field({ nullable: true })
  @Column({ name: 'CATCH_QTY_IN_TRANSIT' })
  catchQtyInTransit?: number;

  @Field({ nullable: true })
  @Column({ name: 'CATCH_QTY_ONHAND' })
  catchQtyOnhand?: number;

  @Field({ nullable: true })
  @Column({ name: 'PART_OWNERSHIP' })
  partOwnership?: string;

  @Field({ nullable: true })
  @Column({ name: 'PART_OWNERSHIP_DB' })
  partOwnershipDb?: string;

  @Field({ nullable: true })
  @Column({ name: 'OWNING_CUSTOMER_NO' })
  owningCustomerNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'OWNING_VENDOR_NO' })
  owningVendorNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_RESERVED' })
  ctmReserved?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_PACKAGE' })
  ctmPackage?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_GROSS_LENGTH' })
  ctmGrossLength?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_CUT_QTY' })
  ctmCutQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_DEFECT_QTY' })
  ctmDefectQty?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_PIECE_NO' })
  ctmPieceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_COLOR_LOT' })
  ctmColorLot?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_INSPECTION' })
  ctmInspection?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_MIDDLE_COLOR' })
  ctmMiddleColor?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_PROCESS_ID' })
  ctmProcessId?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_NOTE' })
  ctmNote?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_DOP_ID' })
  ctmDopId?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_LOT_BATCH_SOURCE' })
  ctmLotBatchSource?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_REPAIR_GENERATED' })
  ctmRepairGenerated?: string;

  @Field({ nullable: true })
  @Column({ name: 'CTM_WEIGHT' })
  ctmWeight?: number;

  @Field({ nullable: true })
  @Column({ name: 'CTM_JOB_ORDER' })
  ctmJobOrder?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJID' })
  objid?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJVERSION' })
  objversion?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJKEY' })
  objkey?: string;
}
