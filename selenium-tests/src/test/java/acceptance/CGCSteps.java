package acceptance;
import java.io.IOException;
import java.util.HashMap;

import cucumber.api.java.Before;
import cucumber.api.java.After;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import cucumber.api.Format;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import driver.CGC;
import model.Node;
import utils.Utils;

public class CGCSteps {
	public static String IFRAME_NAME = "iframe";
	public static String CANVAS_XPATH = "//*[@id=\"canvas\"]";
	private HashMap<String, String> shortcuts;
	private HashMap<String, Node> nodes;
	private CGC driver;
	@Before
	public void setUp()
	{
		shortcuts = new HashMap<String, String>();
		nodes = new HashMap<String, Node>();
		shortcuts.put("Edge", "//*[@id=\"toolbar\"]/ul/li[2]/div");
	}
	@After
	public void tearDown()
	{
		driver.close();
	}
	//and, bug, given, when
	@Given("I navigate to the home page")
	public void navigateTo() throws IOException
	{
		driver = CGC.create();
	}
	@When("^.*do nothing$")
	public void doNothing()
	{

	}
	@When("^.*node (?:named (.+) |)at (\\d+), (\\d+)$")
	public void createNode(String name, int x, int y)
	{
		Node node = driver.createNode(x, y);
		nodes.put(name, node);
	}
	@When("^.*add an edge between (.+) and (.+)$")
	public void addEdge(String source, String destination)
	{
    	driver.drawEdge(nodes.get(source), nodes.get(destination));
	}

	@When("^.*click on (.+)$")
	public void clickNode(String node) throws Throwable {
		driver.clickNode(nodes.get(node));
	}

	@When("^.*I select the (.+) tool$")
	public void selectTool(String name) throws Throwable
	{
		driver.selectTool(shortcuts.get(name));
	}
	@Then("^*the screen should match '(.+)'$")
	public void checkScreenshot(String path) throws Throwable
	{
	    driver.assertScreenshot("src/test/resources/" + path);
	}
	@Then("^.*there (?:is|are|should be) (.+) nodes?$")
	public void checkNodes(String nodes) throws Throwable
	{
		driver.assertContains(CGC.NODE_IMAGE, Utils.inNumerals(nodes));
	}

 /**
  * 	node1 = robot.createNode(33, 33)

	#robot.save_screenshot('1_expected.png')
	robot.assertScreenshot('1_expected.png')
	node2 = robot.createNode(84, 84)

	robot.edge(node1, node2)

	robot.assertNode(node1)


	robot.select(node1)
	#node3 = robot.createNode(180, 180)


	#robot.save_screenshot('2_expected.png')
	robot.assertScreenshot('2_expected.png')

	#robot.assertNode(node2)

	robot.select(node1)
	robot.select(node2, 10, 10)



	#robot.save_screenshot('3_expected.png')
	robot.assertScreenshot('3_expected.png')
	return
  */
}
