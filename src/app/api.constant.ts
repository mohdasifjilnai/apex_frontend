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
  public static create_proposal: string = `/api/v1/create_update_proposal/`;
}
