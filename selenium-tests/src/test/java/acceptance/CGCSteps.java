package acceptance;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;

import cucumber.api.Transform;
import cucumber.api.java.After;
import cucumber.api.java.Before;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import driver.CGCPage;
import driver.DriverFactory;
import model.Node;
import utils.Utils;

public class CGCSteps {
	private HashMap<String, String> shortcuts;
	private HashMap<String, Node> nodes;
	private CGCPage cgc;
	private WebDriver driver;

	@Before
	public void setUp() throws IOException
	{
		shortcuts = new HashMap<String, String>();
		nodes = new HashMap<String, Node>();
		driver = DriverFactory.createDriver();
		cgc = new CGCPage(driver);

		shortcuts.put("Edge", "#toolbar .tool[data-tool=\"edge\"]");
	}
	@After
	public void tearDown()
	{
		driver.quit();
	}
	@Given("I navigate to the home page")
	public void navigateTo() throws Throwable
	{

	}
	@When("^.*do nothing$")
	public void doNothing()
	{

	}
	@when("^.*scroll (out|in) by (.+) ticks$")
	public void scroll(String direction,String magnitude)
	{

	}
	@when("I press the reset button")
	public void resetClick()
	{

	}
	@When("^.*node (?:named (.+) |)at (.*)$")
	public void createNode(String name, @Transform(PointTransformer.class) Point point)
	{
		Node node = cgc.createNode(point);
		nodes.put(name, node);
	}
	@When("^.*add an edge between (.+) and (.+)$")
	public void addEdge(String source, String destination)
	{
    	cgc.drawEdge(nodes.get(source), nodes.get(destination));
	}

	@When("^.*click on (.+)$")
	public void clickNode(String node) throws Throwable {
		cgc.clickNode(nodes.get(node));
	}

	@When("^.*I select the (.+) tool$")
	public void selectTool(String name) throws Throwable
	{
		cgc.selectTool(shortcuts.get(name));
	}
	@When("^.*click and drag from (.*)$")
	public void clickAndDrag(@Transform(PointListTransformer.class) List<Point> points) throws Throwable
	{
		//When I click and drag from (0, 1) to (1, 2) to (2, 3)
		for(Point p:points)
			System.out.println(p);
	}

	@Then("^*the screen should match '(.+)'$")
	public void checkScreenshot(String path) throws Throwable
	{
		Thread.sleep(420);
		cgc.assertContains("src/test/resources/" + path);
	}
	@Then("^.*there (?:is|are|should be) (.+) nodes?$")
	public void checkNodes(String nodes) throws Throwable
	{
		cgc.assertContains(CGCPage.NODE_IMAGE, Utils.inNumerals(nodes));
	}
}