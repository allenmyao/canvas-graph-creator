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
	public static final String DEFAULT_BROWSER = "chrome";
	public static final String DEFAULT_VERSION = "49.0";
	
	
	
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
	
	public static WebDriver createDriver() {
		return createDriver(System.getProperty("browser", DEFAULT_BROWSER));
	}
	
	public static WebDriver createRemoteDriver(String name, String url) throws MalformedURLException
	{
		DesiredCapabilities caps;
		WebDriver driver;
		
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
		
	    driver = new RemoteWebDriver(new URL(url), caps);
	    initialize(driver);
	    
		return driver;
	 
	}

	public static void initialize(WebDriver driver)
	{
		driver.manage().window().maximize();
	}

}
