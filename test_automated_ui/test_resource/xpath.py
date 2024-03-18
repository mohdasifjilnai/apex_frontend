# partner 

sign_with_password= '//*[contains(text()," Sign In with Password ")]'
enter_email_partner= '//*[@id="form_email"]'
etner_password_partner= '//*[@id="form_password"]'
sign_in_partner= '//*[@type="submit"]'
wait_for_login_success= '//*[@id="userProfile"]'

#  product page x- path

two_wheel= '(//*[contains(text(),"Two Wheeler")])[1]'
four_wheel= '(//*[contains(text(),"Private Car")])[1]'
commercial_wheel= '(//*[contains(text(),"Commercial Vehicle")])[1]'
registration_number= '//input'
get_vehicle_details_with_reg_num= '//*[@id-automation="getVehicleDetailsId"]'
proceed_without_vehicle_number= '//*[contains(text(),"Proceed without Vehicle Number")]'

#  mmv details page

search_vehicle='//*[@id-automation="searchVehicle"]'
select_vehicle='//span[@class="mat-option-text"]//span'
search_rto= '//*[@id-automation="rtoData"]'
select_drop_down_option='//*[@class="mat-option-text"]'
enter_reg_year='//*[@id-automation="registrationYearId"]'
search_previous_insurer='//*[@id-automation="previousInsuranceId"]'
enter_policy_expiry='//*[@id-automation="policy_expiry_date"]'
calendar_icon='//*[local-name()="svg"]'
registration_year='//*[text()=" %s "]'
registration_month='//*[text()=" %s "]'
get_vehicle_details='//*[@id-automation="getVehicleDetailsId"]'

#mmv confirmation page
above_details_correct_btn='//*[contains(text(),"Above details are correct")]'
calendar_icon='(//*[local-name()="svg"])[2]'

#quotes page
#ownership=
ownership_type='//*[text()="%s"]'
trace_id='//*[contains(text(),"Trace ID:")]'
click_on_add_on='//*[@id="addon"]'
select_add_on='//*[@id="addon"]//..//..//..//*[@class="mat-checkbox-label"]'
selelct_insurer='(//*[contains(text(), "%s")]//..)[1]'
select_discount_deductibles='//*[@id="discounts_deductibles"]//..//..//..//*[@class="mat-checkbox-label"]'
select_cpa='//*[@id="cpa"]//..//..//..//*[@class="mat-checkbox-label"]'
select_accessories='//input[@id="%s-input"]//parent::span'
enter_accessories_amount='//input[@id="%s"]'
select_additional_cover='//*[@id="%s"]/parent::span'
additional_cover_drp='(//*[@id="%s"])[2]'
select_additional_cover_ammount="//*[text()='%s']"
select_geographical_extention="(//*[text()='%s'])[1]"

#CKYC
ckyc_tab='//*[text()=" CKYC "]'
ckyc_drop_down='(//*[text()="Select Document Type"])[1]'
ckyc_pan_card='//*[text()=" Pan Number "]'
ckyc_dob='(//*[@id-automation="dob"])[1]'
document_number='(//*[@id-automation="documentNumber"])[1]'
ckyc_fetch_details='(//*[text()=" Fetch Details "])[1]'