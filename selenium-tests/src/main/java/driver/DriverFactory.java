package driver;

import java.net.MalformedURLException;
import java.net.URL;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class DriverFactory {
	public static final String DEFAULT_PLATFORM = "Windows 10";
	public static final String DEFAULT_BROWSER = "firefox";
	public static final String DEFAULT_VERSION = "39.0";
	
	
	
	public static WebDriver createDriver(String name)
	{
		WebDriver driver;
		
		if(name.equals("firefox"))
			driver = new FirefoxDriver();
		else if(name.equals("chrome"))
			driver = new ChromeDriver();
		else
			throw new RuntimeException("Unsupported browser " + name);
		
		initialize(driver);
		
		return driver;
	}
	
	public static WebDriver createDriver() throws MalformedURLException {
		String browser = System.getProperty("browser", DEFAULT_BROWSER);
		String remote = System.getProperty("remote", "none");
		
		if(remote.equals("none")){
			return createDriver(browser);
		}else if(remote.equals("sauce")){
			return createSauceDriver(browser);
		}else{
			throw new RuntimeException("Unsupported remote driver type " + remote);
		}
	}
	
	public static WebDriver createSauceDriver(String name) throws MalformedURLException{
		String username = System.getenv("SAUCE_USERNAME");
		String key = System.getenv("SAUCE_ACCESS_KEY");
		String url = "http://" + username + ":" + key + "@ondemand.saucelabs.com:80/wd/hub";
		
		return createRemoteDriver(url, getSauceCapabilities(name));
	}
	private static DesiredCapabilities getSauceCapabilities(String name){
		DesiredCapabilities caps;

		if(name.equals("firefox"))
			caps = DesiredCapabilities.firefox();
		else if(name.equals("chrome"))
			caps = DesiredCapabilities.chrome();
		else
			throw new RuntimeException("Unsupported browser " + name);
		
		caps.setCapability("platform", System.getProperty("platform", DEFAULT_PLATFORM));
	    caps.setCapability("version", System.getProperty("version", DEFAULT_VERSION));
	    caps.setCapability("tunnel-identifier", System.getenv("TRAVIS_JOB_NUMBER"));
	    caps.setCapability("build", System.getenv("TRAVIS_BUILD_NUMBER"));
	    
	    return caps;
	}
	public static WebDriver createRemoteDriver(String url, DesiredCapabilities caps) throws MalformedURLException{
		WebDriver driver = new RemoteWebDriver(new URL(url), caps);
	    initialize(driver);
	    
		return driver;
	 
	}

	public static void initialize(WebDriver driver)
	{
		driver.manage().window().maximize();
	}

}
