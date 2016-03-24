import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import driver.CGC;
import model.Node;

public class ChromeTest {
	private static CGC driver;
	@BeforeClass
	public static void setUp() throws IOException
	{
		driver = CGC.create(CGC.HOME_PAGE, "chrome");

	}
	@AfterClass
	public static void tearDown()
	{
		driver.close();
	}
	
	public void testGoogleSearch() throws InterruptedException {
	  // Optional, if not specified, WebDriver will search your path for chromedriver.
	  

	  WebDriver driver = new ChromeDriver();
	  
	  driver.get("http://www.google.com/xhtml");
	  //Thread.sleep(000);  // Let the user actually see something!
	  WebElement searchBox = driver.findElement(By.name("q"));
	  
	  String screenshot1 = ((TakesScreenshot)driver).getScreenshotAs(OutputType.BASE64);
	  
	  String screenshot2 = ((TakesScreenshot)driver).getScreenshotAs(OutputType.BASE64);
	  
	  assertEquals(screenshot1, screenshot2);
	  searchBox.sendKeys("ChromeDriver");
	  searchBox.submit();
	  Thread.sleep(5000);  // Let the user actually see something!
	  driver.quit();
	}
	
	public void testAll() throws Exception {
		Node node1 = driver.createNode(33, 33);

		//robot.save_screenshot('1_expected.png')
		driver.assertScreenshot("1_expected.png");
		Node node2 = driver.createNode(84, 84);

		driver.drawEdge(node1, node2);


		//driver.select(node1);
		//node3 = robot.createNode(180, 180)

		//robot.save_screenshot('2_expected.png')
		driver.assertScreenshot("2_expected.png");

		//driver.select(node1);
		//driver.select(node2, 10, 10);

		//robot.save_screenshot('3_expected.png')
		driver.assertScreenshot("3_expected.png");
	}
}