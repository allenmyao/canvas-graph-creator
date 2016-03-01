import java.awt.Image;
import org.springframework.util.ResourceUtils;
import java.awt.image.BufferedImage;
import java.awt.image.DataBuffer;
import java.awt.image.DataBufferByte;
import java.awt.image.DataBufferInt;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Paths;
import java.util.Arrays;


import javax.imageio.ImageIO;

import static org.junit.Assert.*;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Driver {
	public static final String DEFAULT_BROWSER = "firefox";
	
	protected WebDriver driver;
	protected String name;
	protected WebElement canvas;

	public Driver(){
		this(System.getProperty("browser", DEFAULT_BROWSER));
	}
	
	public Driver(String name) {
		this.name = name;

		if(name.equals("firefox"))
			driver = new FirefoxDriver();
		else if(name.equals("chrome"))
			driver = new ChromeDriver();
		else
			throw new RuntimeException("Unsupported browser " + name);
	}
	public void switchToFrame(String name)
	{
		driver.switchTo().frame(name);
	}
	public void selectCanvas(String xPath)
	{
		canvas = driver.findElement(By.xpath(xPath));
	}
	public void click(int x, int y)
	{
		new Actions(driver).moveToElement(canvas, x, y).click().build().perform();   
	}
	public void click(String xPath, int x, int y)
	{
		new Actions(driver).moveToElement(driver.findElement(By.xpath(xPath)), x, y).click().build().perform();
	}
	public BufferedImage getResource(String path) throws URISyntaxException, IOException
	{
		
		File file = new File(path);
		if(!file.exists())
		{
			System.err.println(path + " does not exist, creating file from screenshot");
			FileUtils.copyFile(getScreenshotAsFile(), file);
		}
		return ImageIO.read(file);
	}
	public void assertScreenshot(String path) throws IOException, URISyntaxException {		
		DataBufferByte dbActual = (DataBufferByte)getScreenshot().getRaster().getDataBuffer();
		DataBufferByte dbExpected = (DataBufferByte)getResource(path).getRaster().getDataBuffer();
		
		for (int bank = 0; bank < dbActual.getNumBanks(); bank++) {
		   byte[] actual = dbActual.getData(bank);
		   byte[] expected = dbExpected.getData(bank);

		   assertTrue(Arrays.equals(actual, expected));
		}
	}

	public void close() 
	{
		driver.close();
	}
	//http://stackoverflow.com/questions/5868439/wait-for-page-load-in-selenium
	public void waitUntilLoaded()
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);

	    wait.until(new ExpectedCondition<Boolean>() {
	        public Boolean apply(WebDriver wdriver) {
	            return ((JavascriptExecutor) driver).executeScript(
	                "return document.readyState"
	            ).equals("complete");
	        }
	    });
	}
	public void loadSite(String website) {
		waitUntilLoaded();
		driver.get(website);
	}
	public String getScreenshotAsString()
	{
		return ((TakesScreenshot)driver).getScreenshotAs(OutputType.BASE64);
	}
	public BufferedImage getScreenshot() throws IOException
	{
		return ImageIO.read(getScreenshotAsFile());
	}
	public File getScreenshotAsFile()
	{
		return ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
	}
}
