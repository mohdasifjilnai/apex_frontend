
import sys
import os
myDir = os.getcwd()
sys.path.append(myDir)

from ..main.utils import funtion_wrapper as function_
from ..main.apex_ui import apex_main as apex_functions
from ..main.utils.initiate_webdriver import get_driver
from ..test_resource import test_data as test_data


import time

driver=None
logger=None
test_case_scenario={}
test_case_name={}

    
def test_set_up():
    global logger
    global driver
    global test_case_name
    function_.clean_folder()
    local_logger=function_.get_logger(file_name='apex_log')
    logger = local_logger
    driver_1 = get_driver()
    driver=driver_1
    test_case_name=function_.get_cases_name()





def test_00():
    test_name='partner login'
    driver.get('https://www.google.com')
    apex_functions.get_partner_login(driver,logger)
    

def test_01():
    test_case_id='TC_01'
    logger.info('test case id : '+test_case_id)
    logger.info('test case name : '+test_case_name[test_case_id])
    apex_functions.switch_to_apex_journey(driver)
    
def test_02():
    test_case_id='TC_02'
    logger.info('test case id : '+test_case_id)
    logger.info('test case name : '+test_case_name[test_case_id])
    apex_functions.switch_to_apex_journey(driver)