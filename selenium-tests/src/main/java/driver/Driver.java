package driver;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;

import javax.imageio.ImageIO;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Point;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


import ru.yandex.qatools.ashot.AShot;
import ru.yandex.qatools.ashot.coordinates.WebDriverCoordsProvider;
import ru.yandex.qatools.ashot.shooting.ShootingStrategies;
import utils.ImageUtils;

public class Driver {
	public static final String DEFAULT_PLATFORM = "Windows 10";
	public static final String DEFAULT_BROWSER = "chrome";
	public static final String DEFAULT_VERSION = "49.0";


	//#TODO load from file
	public static final String USERNAME = System.getenv("SAUCE_USERNAME");
	public static final String ACCESS_KEY = System.getenv("SAUCE_ACCESS_KEY");
	public static final String URL = "http://" + USERNAME + ":" + ACCESS_KEY + "@ondemand.saucelabs.com:80/wd/hub";
	
	
	protected WebDriver driver;
	protected String name;
	protected WebElement canvas;

	protected BufferedImage initialScreenshot;
	protected HashMap<String, Point> elements;
	
	public Driver(){
		this(System.getProperty("browser", DEFAULT_BROWSER));
	}
	
	public Driver(String name) {
		this.name = name;
		
		elements = new HashMap<String, Point>();

		if(name.startsWith("remote"))
			driver = createRemoteDriver(name);
		else if(name.equals("firefox"))
			driver = new FirefoxDriver();
		else if(name.equals("chrome"))
			driver = new ChromeDriver();
		else
			throw new RuntimeException("Unsupported browser " + name);
	}
	private DesiredCapabilities getCapabilities(String browserName)
	{
		DesiredCapabilities caps;
		
		if(browserName.equals("firefox"))
			caps = DesiredCapabilities.firefox();
		else if(browserName.equals("chrome"))
			caps = DesiredCapabilities.chrome();
		else
			throw new RuntimeException("Unsupported browser " + name);
		
	    caps.setCapability("platform", System.getProperty("platform", DEFAULT_PLATFORM));
	    caps.setCapability("version", System.getProperty("version", DEFAULT_VERSION));
	    caps.setCapability("tunnel-identifier", System.getenv("TRAVIS_JOB_NUMBER"));
	    caps.setCapability("build", System.getenv("TRAVIS_BUILD_NUMBER"));
	    
		return caps;	
	}
	private WebDriver createRemoteDriver(String name) {
		name = name.replaceFirst("remote-", "");
	    
	    try{
	    	return new RemoteWebDriver(new URL(URL), getCapabilities(name));
	    }catch(Exception e)
	    {
	    	e.printStackTrace();
	    	return null;
	    }
	}

	public void clickElement(String element)
	{
		Point coordinate = elements.get(element);
		clickCanvas(coordinate.x, coordinate.y);
	}
	public void addElement(BufferedImage element, String name)
	{
		Point best = ImageUtils.bestMatch(element, initialScreenshot);
		best.x += element.getWidth()/2;
		best.y += element.getHeight()/2;
		elements.put(name, best);
	}
	public void takeInitialScreenshot() throws IOException
	{
		//initialImage = getCanvas();
		initialScreenshot = getScreenshot();
	}
	public void assertScreenshot(String path) throws IOException, URISyntaxException {
		//BufferedImage diff = ImageUtils.getDifferenceImage(initialImage, getCanvas());
		BufferedImage diff = ImageUtils.getDifferenceImage(initialScreenshot, getScreenshot());
		BufferedImage expected = getResource(path);
		assertTrue(ImageUtils.imageEquals(diff, expected));
	}
	
	public void switchToFrame(String name)
	{
		driver.switchTo().frame(name);
	}
	public void selectCanvas(String xPath)
	{

		canvas = (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xPath)));
	}
	public void clickCanvas(int x, int y)
	{
		
		new Actions(driver).moveToElement(canvas, x, y).click().build().perform();   
	}
	public void clickCanvas(String xPath, int x, int y)
	{
		new Actions(driver).moveToElement(driver.findElement(By.xpath(xPath)), x, y).click().build().perform();
	}
	
	public BufferedImage getResource(String path) throws URISyntaxException, IOException
	{
		File file = new File(path);
		if(!file.exists())
		{
			System.err.println(path + " does not exist, creating file from screenshot");
			BufferedImage difference = ImageUtils.getDifferenceImage(initialScreenshot, getScreenshot());
			ImageIO.write(difference, "png", file);
		}
		return ImageIO.read(file);
	}

	public void close() 
	{
		driver.close();
		driver.quit();
	}
	//http://stackoverflow.com/questions/5868439/wait-for-page-load-in-selenium
	public void waitUntilLoaded()
	{
		WebDriverWait wait = new WebDriverWait(driver, 900);

	    wait.until(new ExpectedCondition<Boolean>() {
	        public Boolean apply(WebDriver wdriver) {
	            return ((JavascriptExecutor) driver).executeScript(
	                "return document.readyState"
	            ).equals("complete");
	        }
	    });
	}

	public void assertContains(BufferedImage template, int count) throws IOException
	{
		BufferedImage screenshot = this.getScreenshot();
		assertEquals(count, ImageUtils.templateMatch(template, screenshot).size());
	}
	
	public void loadSite(String website) {
		waitUntilLoaded();
		driver.get(website);
		driver.manage().window().maximize();
		driver.manage().window().setPosition(new Point(0,0));
		driver.manage().window().setSize(new Dimension(1600,2400));
	}
	private BufferedImage getScreenshot() throws IOException
	{
	    /*
		TakesScreenshot screenshot=(TakesScreenshot)driver; 
        byte[] arrScreen = screenshot.getScreenshotAs(OutputType.BYTES);
        
        return ImageIO.read(new ByteArrayInputStream(arrScreen));
        */
		//return new AShot().coordsProvider(new WebDriverCoordsProvider())
		  //.takeScreenshot(driver, canvas).getImage();
		return new AShot().shootingStrategy(ShootingStrategies.viewportPasting(100)).takeScreenshot(driver).getImage();
	}
	/*
	public BufferedImage cropCanvas(int x1, int y1, int x2, int y2) throws IOException
	{
        BufferedImage image = getScreenshot();
        
        Point location = canvas.getLocation();
        return image.getSubimage(location.x + x1, location.y + y1, location.x + x2, location.y + y2);
	}
	public BufferedImage getCanvas() throws IOException
	{
		BufferedImage image = getScreenshot();
		
		Dimension dimension = canvas.getRect().getDimension();
		Point location = canvas.getLocation();
		return image.getSubimage(location.x, location.y, location.x + dimension.width, location.y + dimension.height);
	}
	*/
}
