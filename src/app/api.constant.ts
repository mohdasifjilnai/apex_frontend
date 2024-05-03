export class ApiConstants {
  //get vehicle
  public static get_vehicle_mmv: string = `/api/v1/vehicle_search/`;

  // getdepending mmv
  public static get_depending_mmv: string = `/api/v1/get_depending_mmv/`;

  //With Registration Number
  public static registration_number = `/api/v1/vaahan/registration_number/`;
  public static get_rto_list: string = `/api/v1/rto_search/`;

  public static get_previous_insurer: string = `/api/v1/insurer_search/`;

  // Initiate quotes List
  public static initiate_quotes: string = `/api/v1/initiate_quotes/`;

  //addons end point

  public static addonsApi: string = `/api/v1/addon/`;

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
  //Occupation Type
  public static occupation_type: string = `/api/v1/occupation_type/`;

  //Relation Type
  public static relation_type: string = `/api/v1/relationship_type/`;

  //Financier Type
  public static financier_type: string = `/api/v1/financiers/`;
  //generate proposal
  public static generate_proposal: string = `/api/v1/proposal/generate_proposal/`;
  //pincode
  public static pincode: string = `/api/v1/pincode/`;
  //  upload document
  public static upload_document: string = `/api/v1/ckyc/upload_document/`;
  // get document image url
  public static get_document_image_url: string = `/api/v1/ckyc/get_document/`;
  // agreement type list
  public static aggreement_type: string = `/api/v1/agreement_type/`;
  //salutation List
  public static salutation: string = `/api/v1/salutation/`;
  //financier name
  public static financier_List: string = `/api/v1/financiers/`;
  //Get Insurer Code
  public static get_insurer_code: string = `/api/v1/get_insurer_quote`;
  //make model and variant
  public static make_model_and_variant: string = `/api/v1/get_depending_mmv/`;
  // document save api
  public static upload_document_save: string = `/api/v1/ckyc/upload_document/save/`;

  public static downloadPolicy: string = `/api/v1/policy/get_policy_document/`;

  public static downloadPremiumBreakup: string = `/api/v1/docfetch/download_pdf/`;

  public static get_inspection_data: string = `/api/v1/inspection/inspection_details/`;

  public static get_renewal_policy: string = `/api/v1/renewals/previous_policy_details/`;
  public static ckyc_upload_document_fields: string = `/api/v1/ckyc/ckyc_upload_document_fields/`;

  public static generate_renewal_proposal: string = `/api/v1/renewals/generate_renewal_proposal/`;

  public static pre_policy_addons: string = `/api/v1/prev_policy_addon_details/`;
}
