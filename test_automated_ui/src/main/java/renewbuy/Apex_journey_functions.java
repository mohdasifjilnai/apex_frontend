package renewbuy;

import java.io.IOException;
import java.util.logging.Logger;

import com.microsoft.playwright.Page;

import renewbuy.utils.Functions_wrapper;

public class Apex_journey_functions {

    public void select_product_type(Page page, Logger logger, Functions_wrapper f_obj, String product_name)
            throws IOException {
        if (product_name.toLowerCase().contentEquals("two_vehicle")) {
            logger.info(product_name + " selected");
            page.locator(f_obj.get_xpath("two_wheel")).click();
        } else if (product_name.toLowerCase().contentEquals("four_vehicle")) {
            page.locator(f_obj.get_xpath("four_wheel")).click();
            logger.info(product_name + " selected");
        } else if (product_name.toLowerCase().contentEquals("commercial_vehicle")) {
            page.locator(f_obj.get_xpath("commercial_wheel")).click();
            logger.info(product_name + " selected");
        }
    }

    public void get_partner_login(Page page, Logger logger, Functions_wrapper f_obj) throws Exception {
        page.navigate(f_obj.get_test_data("staging_url_partner_login"));
        page.locator(f_obj.get_xpath("sign_with_password")).click();
        page.locator(f_obj.get_xpath("enter_email_partner")).fill(f_obj.get_test_data("partner_login_email"));
        page.locator(f_obj.get_xpath("etner_password_partner")).fill(f_obj.get_test_data("partner_login_password"));
        page.locator(f_obj.get_xpath("sign_in")).click();
        logger.info("clicked on sign-button ");
        page.waitForSelector(f_obj.get_xpath("wait_for_login_success"));
        // throw new Exception("Test exception");
    }

    public void enter_mmv_details(Page page, Logger logger, Functions_wrapper f_obj, String mmv) throws Exception {
        page.locator(f_obj.get_xpath("search_vehicle")).click();
        page.locator(f_obj.get_xpath("search_vehicle")).fill(mmv);
        Thread.sleep(3000);
        page.locator(f_obj.get_xpath("select_drop_down_option")).first().click();
        logger.info(mmv + " selected");
    }

    public void enter_rto(Page page, Logger logger, Functions_wrapper f_obj, String rto)
            throws IOException, InterruptedException {
        page.locator(f_obj.get_xpath("search_rto")).click();
        page.locator(f_obj.get_xpath("search_rto")).fill(rto);
        Thread.sleep(3000);
        page.locator(f_obj.get_xpath("select_drop_down_option")).first().click();
        logger.info(rto + " selected");
    }

    public void enter_registration_month_year(Page page, Logger logger, Functions_wrapper f_obj,
            String registration_month_year)
            throws IOException, InterruptedException {
        page.locator(f_obj.get_xpath("enter_reg_year")).fill(registration_month_year);
        logger.info(registration_month_year + " entered");
    }

    public void select_previous_insurer(Page page, Logger logger, Functions_wrapper f_obj, String previous_insurer)
            throws IOException, InterruptedException {
        page.locator(f_obj.get_xpath("search_previous_insurer")).click();
        page.locator(f_obj.get_xpath("search_previous_insurer")).fill(previous_insurer);
        Thread.sleep(3000);
        page.locator(f_obj.get_xpath("select_drop_down_option")).first().click();
        logger.info(previous_insurer + " selected");
    }

}
