package driver;

import static org.junit.Assert.assertEquals;

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
		clickCanvas(elements.get(element));
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

	public void selectCanvas(String cssSelector)
	{
		canvas = (new WebDriverWait(driver, 900)).until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(cssSelector)));
	}
	public void clickCanvas(Point point)
	{
		click(canvas, point);   
	}
	public void openContextMenu(Point point)
	{
		new Actions(driver).moveToElement(canvas, point.x, point.y).contextClick().build().perform();   
	}
	
	public void click(String cssSelector, Point offset)
	{
		click(driver.findElement(By.cssSelector(cssSelector)), offset);
	}
	
	public void click(WebElement element, Point offset)
	{
		new Actions(driver).moveToElement(element, offset.x, offset.y).click().build().perform();
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
	public void scroll(Point ticks)
	{
		JavascriptExecutor jse = (JavascriptExecutor) driver;
		jse.executeScript("document.getElementById('canvas').dispatchEvent(new WheelEvent('wheel', {clientX: 500,clientY: 500,deltaY: " + ticks.y + "}));");
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
