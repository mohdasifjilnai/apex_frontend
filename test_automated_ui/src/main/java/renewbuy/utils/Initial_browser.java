package renewbuy.utils;

import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.BrowserType.LaunchOptions;

public class Initial_browser {
    
    public void get_browser(){
        Playwright play_wright = Playwright.create();
        LaunchOptions launch_options = new LaunchOptions();
        launch_options.setChannel("chrome");
        launch_options.setHeadless(false);
        play_wright.chromium().launch(launch_options);
    }
}
