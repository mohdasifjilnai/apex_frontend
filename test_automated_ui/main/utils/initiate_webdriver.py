from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

opt= Options()

def get_driver():
   
    # opt.add_argument("--headless")
    opt.add_argument("--disable-gpu")
    opt.add_argument("--no-sandbox")
    opt.add_argument("--window-size=1920x1080")
    opt.add_argument("incognito")
#    # driver = webdriver.Remote(command_executor='http://selenium-hub-health:4444/wd/hub',options=opt)
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.implicitly_wait(40)
    driver.delete_all_cookies()
    driver.maximize_window()
    return driver