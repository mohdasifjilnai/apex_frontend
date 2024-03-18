import sys
import os
import openpyxl
from openpyxl.styles import PatternFill
myDir = os.getcwd()
sys.path.append(myDir)

from ...test_resource import test_data as test_data
from ...test_resource import xpath as xpath
from ..utils import funtion_wrapper as function_



def get_partner_login(driver,logger):
    driver.get(test_data.staging_url_partner_login)
    function_.click_on_elm(driver,xpath.sign_with_password,'sign with password',logger)
    function_.send_keys(driver,xpath.enter_email_partner,test_data.partner_login_email,'partner email',logger)
    function_.send_keys(driver,xpath.etner_password_partner,test_data.partner_login_password,'partner email',logger)
    function_.click_on_elm(driver,xpath.sign_in_partner,'parter sign buton',logger)
    function_.wait_for_elm(driver,xpath.wait_for_login_success)
    

def switch_to_apex_journey(driver):
    driver.execute_script(("window.open('{}', '_blank');".format(test_data.staging_url_new_journey)))
    driver.switch_to.window(driver.window_handles[1])


def select_product_type(driver, logger, product_name: str) :
    product_name = product_name.lower()
    if product_name == "two_vehicle":
        function_.click_on_elm(driver,xpath.two_wheel,'two wheeler',logger)
        logger.info(product_name + " selected")
    elif product_name == "four_vehicle":
        function_.click_on_elm(driver,xpath.four_wheel,'four wheeler',logger)
        logger.info(product_name + " selected")
    elif product_name == "commercial_vehicle":
        function_.click_on_elm(driver,xpath.commercial_wheel,'commercial',logger)
        logger.info(product_name + " selected")
       
def enter_registration_month_year(driver, logger, registration_month_year: str) :
    print(registration_month_year)
    month_n_year = registration_month_year.split("/")
    print(month_n_year)
    function_.click_on_elm(driver,xpath.calendar_icon,'calendar',logger)
    function_.click_on_elm(driver,xpath.registration_year.format(month_n_year[2]),'month_n_year[2]',logger)
    function_.click_on_elm(driver,xpath.registration_month.format(month_n_year[1].upper()),'month_n_year[1]',logger)
    logger.info(registration_month_year + " entered")

