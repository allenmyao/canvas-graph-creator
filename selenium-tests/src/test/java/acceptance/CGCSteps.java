package acceptance;
import java.awt.Image;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.imageio.ImageIO;

import cucumber.api.java.Before;
import cucumber.api.java.After;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import cucumber.api.Delimiter;
import cucumber.api.Format;
import cucumber.api.Transform;
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
	private CGC cgc;
	@Before
	public void setUp() throws IOException
	{
		shortcuts = new HashMap<String, String>();
		nodes = new HashMap<String, Node>();
		shortcuts.put("Edge", "//*[@id=\"toolbar\"]/ul/li[2]/div");
		cgc = new CGC();
	}
	@After
	public void tearDown()
	{
		cgc.close();
	}
	@Given("I navigate to the home page")
	public void navigateTo() throws Throwable
	{
		cgc.load();
	}
	@When("^.*do nothing$")
	public void doNothing()
	{

	}
	@When("^.*node (?:named (.+) |)at (.*)$")
	public void createNode(String name, @Transform(CoordinateTransformer.class) Coordinate coord)
	{
		Node node = cgc.createNode(coord.x, coord.y);
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
	public void clickAndDrag(@Transform(CoordinateListTransformer.class) List<Coordinate> coordinates) throws Throwable
	{
		//When I click and drag from (0, 1) to (1, 2) to (2, 3)
		for(Coordinate s:coordinates)
			System.out.println(s);
	}
	
	@Then("^*the screen should match '(.+)'$")
	public void checkScreenshot(String path) throws Throwable
	{
	    cgc.assertContains(ImageIO.read(new File("src/test/resources/" + path)), 1);
	}
	@Then("^.*there (?:is|are|should be) (.+) nodes?$")
	public void checkNodes(String nodes) throws Throwable
	{
		cgc.assertContains(CGC.NODE_IMAGE, Utils.inNumerals(nodes));
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
