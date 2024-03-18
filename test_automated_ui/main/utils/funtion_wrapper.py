import shutil
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
import os
from ...main.utils import ExcelUtils as exceldata

import logging


def get_logger(file_name):
    
    # log_file_path = '/path/to/logfile/example.log'
    logger = logging.getLogger("")
    
    log_file = f'./test_report/{file_name}.log'
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    fileHandler = logging.FileHandler(log_file, mode="w")
    fileHandler = logging.FileHandler(log_file, mode="w")
    formatter = logging.Formatter("%(asctime)s :%(levelname)s : %(name)s :%(message)s")
    # object of FileHandler gets formatting info from setFormatter #method
    fileHandler.setFormatter(formatter)
    # logger object gets formatting, path of log file info with addHandler #method
    logger.addHandler(fileHandler)
    # setting logging level to INFO
    logger.setLevel(logging.INFO)
    return logger

def wait_for_elm_untill_clickable(driver, xpath):
    try:
        wait = WebDriverWait(driver, 45)
        wait.until(expected_conditions.element_to_be_clickable((By.XPATH, xpath)))
        return True
    except:
        return False
    
def click_on_elm(driver: webdriver, xpath, name, logger):
    try:
        is_Visible = wait_for_elm_untill_clickable(driver, xpath)
        print(is_Visible)
        if not is_Visible:
            logger.info(f'element not present in web page {name}')
            raise Exception(f'element not present in web page {name}')
        driver.find_element(By.XPATH, xpath).click()
        logger.info(f"clicked on {name}")
    except Exception as e:
        logger.info(f'{e} {name}')
        raise Exception(f'{e} {name}')
        # logger.info (f'Issue in clicking the element {name}')
        # raise Exception(f'Issue in clicking the element {name}')


def send_keys(driver, xpath, key, name, logger):
    try:
        is_present = wait_for_elm(driver, xpath)
        if is_present:
            driver.find_element(By.XPATH, xpath).send_keys(key)
            logger.info(f"sent keys to {name}")

        else:
            logger.info(f'Unable to send to key {name}')
    except:
        logger.info(f'Issue in sending the keys {name}')


def wait_for_elm(driver: webdriver, xpath):
    try:
        wait = WebDriverWait(driver, 40)
        wait.until(expected_conditions.visibility_of_element_located((By.XPATH, xpath)))
        return True
    except:
        return False


def get_screenshot(driver, logger,file_name):
    src_name = f'./test_report/{file_name}.png'
    driver.get_screenshot_as_file(filename=src_name)
    logger.info("screenshot taken")

def clean_folder():
    try:
        # Clean the folder
        shutil.rmtree('./test_report/')
        print(f"Folder cleaned successfully.")
    except OSError as e:
        print(f"Error: {e.strerror}")
    

def get_cases_name():
    test_cases_name={}
    file_path =  './test_resource/Apex_test_data.xlsx'
    data_length =  exceldata.getRowCount(file_path,"sample")

    for i in range(1,data_length+1):
        test_id =exceldata.readData(file_path,'sample',i,1)
        test_description =exceldata.readData(file_path,'sample',i,3)
        test_cases_name.update({test_id:test_description})
    return test_cases_name
