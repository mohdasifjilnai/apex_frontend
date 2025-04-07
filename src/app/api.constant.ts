export class ApiConstants {



  // Initiate quotes List
  public static initiate_quotes(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/initiate_quotes/` : `/api/v1/initiate_quotes/`
  };

  //fetch_quotes
  // public static fetch_quotes: string = `/api/v1/fetch_quotes/`;
  // Initiate quotes List
  public static fetch_quotes(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/fetch_quotes/` : `/api/v1/fetch_quotes/`
  };
  //create proposal
  public static create_proposal: string = `/api/v1/proposal/create_update_proposal/`;

  //Get Insurer Code
  public static get_insurer_code: string = `/api/v1/get_insurer_quote`;

   //Get expiring policy
  //  public static getExpiringPolicy: string = `/api/v1/get_previous_expiry_type/`;
   public static getExpiringPolicy(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/get_previous_expiry_type/` : `/api/v1/get_previous_expiry_type/`
  };
   //Get download Premium Breakup
   public static downloadPremiumBreakup: string = `/api/v1/docfetch/download_pdf/`;

  //get vehicle
  // public static get_vehicle_mmv: string = `/api/v1/vehicle_search/`;
  public static get_vehicle_mmv(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/vehicle_search/` : `/api/v1/vehicle_search/`
  };

  // getdepending mmv
  public static get_depending_mmv: string = `/api/v1/get_depending_mmv/`;

  //With Registration Number
  // public static registration_number = `/api/v1/vaahan/registration_number/`;
  public static registration_number(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/vaahan/registration_number/` : `/api/v1/vaahan/registration_number/`
  };
  // public static get_rto_list: string = `/api/v1/rto_search/`;
  public static get_rto_list(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/rto_search/` : `/api/v1/rto_search/`
  };
  // public static get_previous_insurer: string = `/api/v1/insurer_search/`;
  public static get_previous_insurer(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/insurer_search/` : `/api/v1/insurer_search/`
  };

  //addons end point

  // public static addonsApi: string = `/api/v1/addon/`;
  public static addonsApi(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/addon/` : `/api/v1/addon/`
  };

  // fetch ckyc data
  // public static fetch_ckyc_data: string = `/api/v1/ckyc/fetch_ckyc_data/`;
  public static fetch_ckyc_data(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/ckyc/fetch_ckyc_data/` : `/api/v1/ckyc/fetch_ckyc_data/`
  };
  // public static document_type: string = `/api/v1/document_type/`;
  public static document_type(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/document_type/` : `/api/v1/document_type/`
  };
  //proposal type api end point

  // public static proposal_type: string = `/api/v1/proposer_type/`;
  public static proposal_type(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/proposer_type/` : `/api/v1/proposer_type/`
  };
  // get expiry policy
  // public static exp_policy_type = `/api/v1/master/exp_policy_type/`;

  // public static getCoverageType = `/api/v1/get_coverage_types/`;
  public static getCoverageType(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/get_coverage_types/` : `/api/v1/get_coverage_types/`
  };

  //get proposal Data
  public static get_proposal: string = `/api/v1/proposal/get_proposal`;
  // public static get_proposal(): string {
  //   const isCommercial = sessionStorage.getItem('vehicleType');
  //   return isCommercial=='commercial_vehicle' ? `/cv/api/v1/proposal/get_proposal` : `/api/v1/proposal/get_proposal`
  // };
  //ncb list

  // public static ncb_list: string = `/api/v1/ncb_discount/`;
  public static ncb_list(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/ncb_discount/` : `/api/v1/ncb_discount/`
  };
  // expiry policy list
  // public static expiry_policy_list: string = `/api/v1/master/exp_policy_type/`;
  public static expiry_policy_list(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/master/exp_policy_type/` : `/api/v1/master/exp_policy_type/`
  };
  // share opt phone and email
  // public static send_communication: string = `/api/v1/spear/send_communication/`;
  public static send_communication(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/spear/send_communication/` : `/api/v1/spear/send_communication/`
  };
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
  //make model and variant
  public static make_model_and_variant: string = `/api/v1/get_depending_mmv/`;
  // document save api
  public static upload_document_save: string = `/api/v1/ckyc/upload_document/save/`;

  public static downloadPolicy: string = `/api/v1/policy/get_policy_document/`;

  public static get_inspection_data: string = `/api/v1/inspection/inspection_details/`;

  public static get_renewal_policy: string = `/api/v1/renewals/previous_policy_details/`;
  public static ckyc_upload_document_fields: string = `/api/v1/ckyc/ckyc_upload_document_fields/`;

  public static generate_renewal_proposal: string = `/api/v1/renewals/generate_renewal_proposal/`;

  public static pre_policy_addons: string = `/api/v1/prev_policy_addon_details/`;

  public static vehicle_color = `/api/v1/vehicle_colours/`;

  public static united_ckyc_token = `/api/v1/ckyc/united_ckyc_token`;

  public static united_ckyc_response = `/api/v1/ckyc/united_ckyc_response/`;

  public static get_usgi_ckyc_details = `/api/v1/ckyc/get_usgi_ckyc_details`;
  public static get_insurer_quote_id = `/api/v1/proposal/get_proposal_quote_id`;

  // public static get_trace_Id = `/api/v1/get_trace_id/`;
  public static get_trace_Id(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/get_trace_id/` : `/api/v1/get_trace_id/`
  };
   // public static get_trace_Id = `/api/v1/get_trace_id/`;
   public static get_renewal_data(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/renewals/get_previous_vehicle_details/` : `/api/v1/renewals/get_previous_vehicle_details/`
  };
  // public static fetch_trace_Id = `/api/v1/fetch_quote_request/`;
  public static fetch_trace_Id(): string {
    const isCommercial = sessionStorage.getItem('vehicleType');
    return isCommercial=='commercial_vehicle' ? `/cv/api/v1/fetch_quote_request/` : `/api/v1/fetch_quote_request/`
  };
  public static address_validation = `/api/v1/proposal/get_address_length/`;

  public static crosssell_recommendation = `/api/v1/proposal/crosssell_recommendation/`;

  public static initiate_insurer_quote = `/api/v1/initiate_insurer_quote/`;

  public static renewal_partner_validation = `/api/v1/proposal/renewal_partner_validation`;

  // Commercial Vehicle Api

  public static cv_vehicle_type = `/cv/api/v1/vehicle_type/`;

  public static fetch_partner_code=`/api/v1/proposal/fetch_partner_code/`;

  public static validate_customer_details=`/api/v2/customer-validation/validate_customer_details/`;

}
