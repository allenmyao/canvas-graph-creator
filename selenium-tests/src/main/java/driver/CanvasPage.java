package driver;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;

import javax.imageio.ImageIO;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Point;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import utils.ImageUtils;

public abstract class CanvasPage {
	protected WebElement html;
	protected WebElement canvas;

	protected BufferedImage initialScreenshot;
	protected HashMap<String, Point> elements;
	protected WebDriver driver;
	
	public CanvasPage(WebDriver driver, String website) throws IOException
	{
		this.driver = driver;
		elements = new HashMap<String, Point>();
		
		initialize(website);
		initialScreenshot = getScreenshot();
	}
	
	public void clickElement(String element)
	{
		Point coordinate = elements.get(element);
		clickCanvas(coordinate.x, coordinate.y);
	}
	/**
	 * Finds an element on a page by locating its best match.
	 * The element is stored internally with the given name
	 * @param image an image of the element to locate
	 * @param name name of the element
	 */
	public void addElement(BufferedImage image, String name)
	{
		Point best = ImageUtils.bestMatch(image, initialScreenshot);
		best.x += image.getWidth()/2;
		best.y += image.getHeight()/2;
		elements.put(name, best);
	}


	
	public void switchToFrame(String name)
	{
		driver.switchTo().frame(name);
	}
	public void selectCanvas(String xPath)
	{

		canvas = (new WebDriverWait(driver, 900)).until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xPath)));
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
			//BufferedImage difference = ImageUtils.getDifferenceImage(initialScreenshot, getScreenshot());
			BufferedImage image = getScreenshot();
			ImageIO.write(image, "png", file);
		}
		return ImageIO.read(file);
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
	public void assertContains(String path) throws IOException, URISyntaxException {
		assertContains(path, 1);
	}
	public void assertContains(String path, int count) throws IOException, URISyntaxException
	{
		BufferedImage template = getResource(path);
		//BufferedImage screenshot = ImageUtils.getDifferenceImage(initialScreenshot, getScreenshot());;
		BufferedImage screenshot = getScreenshot();
		assertEquals(count, ImageUtils.templateMatch(template, screenshot).size());
	}
	
	public void initialize(String website) {
		waitUntilLoaded();
		driver.get(website);

		canvas = (new WebDriverWait(driver, 900)).until(ExpectedConditions.visibilityOfElementLocated(By.tagName("html")));
	}
	private BufferedImage getScreenshot() throws IOException
	{
	    
		TakesScreenshot screenshot=(TakesScreenshot)driver; 
        byte[] arrScreen = screenshot.getScreenshotAs(OutputType.BYTES);
        
        return ImageIO.read(new ByteArrayInputStream(arrScreen));
        
		//return new AShot().coordsProvider(new WebDriverCoordsProvider())
		  //.takeScreenshot(driver, canvas).getImage();
		//return new AShot().shootingStrategy(ShootingStrategies.viewportPasting(100)).takeScreenshot(driver).getImage();
	}

}
