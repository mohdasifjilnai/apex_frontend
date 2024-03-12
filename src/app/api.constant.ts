export class ApiConstants {
  //get vehicle
  public static get_vehicle_mmv: string = `/api/v1/vehicle_search/`;

  //With Registration Number
  public static registration_number = `/api/v1/vaahan/registration_number/`;
  public static get_rto_list: string = `/api/v1/rto_search/`;

  public static get_previous_insurer: string = `/api/v1/insurer_search/`;

  // Initiate quotes List
  public static initiate_quotes: string = `/api/v1/initiate_quotes/`;

  //addons end point

  public static addons: string = `/api/v1/addon/`;

  // fetch ckyc data
  public static fetch_ckyc_data: string = `/api/v1/ckyc/fetch_ckyc_data/`;

  public static document_type: string = `/api/v1/document_type/`;

  //proposal type api end point

  public static proposal_type: string = `/api/v1/proposer_type/`;

  // get expiry policy
  public static exp_policy_type = `/api/v1/master/exp_policy_type/`;

  public static getCoverageType = `/api/v1/get_coverage_types/`;

  //create proposal
  public static create_proposal: string = `/api/v1/proposal/create_update_proposal/`;
  public static getExpiringPolicy: string = `/api/v1/get_previous_expiry_type/`;

  //get proposal Data
  public static get_proposal: string = `/api/v1/proposal/get_proposal`;

  //ncb list

  public static ncb_list: string = `/api/v1/ncb_discount/`;

  // expiry policy list
  public static expiry_policy_list: string = `/api/v1/master/exp_policy_type/`;

  // share opt phone and email
  public static send_communication: string = `/api/v1/spear/send_communication/`;
  // verify opt by phone or email
  public static verify_otp: string = `/api/v1/spear/verify_otp/`;

  public static redirection_payment_getway: string = `/api/v1/payment/redirection/`;

  // share Quotes
  public static share_quotes: string = `api/v1/spear/send_communication/`;
  //Occupation Type
  public static occupation_type: string = `/api/v1/occupation_type/`;

  //Relation Type
  public static relation_type: string = `/api/v1/relationship_type/`;

  //Financier Type
  public static financier_type: string = `/api/v1/financiers/`;

  //generate proposal
  public static generate_proposal: string = `/api/v1/proposal/generate_proposal/`;
}
