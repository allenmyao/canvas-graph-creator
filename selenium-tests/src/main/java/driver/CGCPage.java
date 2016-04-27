package driver;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import model.Node;

public class CGCPage extends CanvasPage {

	public static String CANVAS_CSS_SELECTOR = "#canvas";
	public static String RESET_ZOOM_SELECTOR = "#reset-transform";

	public static String HOME_PAGE = "http://127.0.0.1:8080/";

	public static String NODE_IMAGE = "src/test/resources/UnselectedNode.png";
	public static BufferedImage EDGE_TOOL;

	public static Map<String, String> shortcuts;

	static {
		try {
			// EDGE_TOOL = ImageIO.read(new
			// File("src/test/resources/add_edge_tool.png"));
			shortcuts = new HashMap<String, String>();
			shortcuts.put("Edge", "#toolbar .tool[data-tool=\"edge\"]");
			shortcuts.put("Node", "#toolbar .tool[data-tool=\"node\"]");
			shortcuts.put("Erase", "#toolbar .tool[data-tool=\"erase\"]");
			shortcuts.put("Toggle Directed Edge", "#context-menu > ul:nth-child(2) > li");

      shortcuts.put("Add Edge", "#context-menu > ul:nth-child(1) > li:nth-child(1)");
			shortcuts.put("Toggle Start State", "#context-menu > ul:nth-child(1) > li:nth-child(3)");
			shortcuts.put("Toggle Accepting State", "#context-menu > ul:nth-child(1) > li:nth-child(2)");

			shortcuts.put("Delete", "#context-menu > ul:nth-child(3) > li");

			shortcuts.put("Add Circle Node",
					"#context-menu > ul.context-menu__section.context-menu__section--visible > li:nth-child(1)");
		} catch (final Exception ex) {
			throw new RuntimeException("Failed to load resources", ex);
		}
	}
	private Node selected;

	/**
	 * Creates a page object that handles interaction with the CGC page
	 * @param driver
	 * @throws IOException
	 */
	public CGCPage(WebDriver driver) throws IOException{
		super(driver, HOME_PAGE);
		selected = null;
	}

	/**
	 * Creates a node on the canvas at a given coordinate
	 * @param point
	 * @return object that represents the created node
	 */
	public Node createNode(Point point) {
		deselect();
		clickCanvas(point);
		Node node = new Node(point);
		return node;
	}

	/**
	 * Deselects the currently selected node if there is one
	 */
	public void deselect()
	{
		if(selected != null)
		{
			clickCanvas(selected.point);
			selected = null;
		}
	}

	/**
	 * Selects the current tool based on a given css selector or shortcut
	 * @param cssSelector
	 */
	public void selectTool(String cssSelector)
	{
		if(shortcuts.containsKey(cssSelector))
			cssSelector = shortcuts.get(cssSelector);
		click(cssSelector, new Point(10, 10));
	}
	/**
	 * Zooms the canvas in by using the mouse wheel
	 * @param ticks 
	 */
	public void zoomIn(int ticks)
	{
		zoomOut(-1 * ticks);
	}
	/**
	 * Zooms the canvas out by using the mouse wheel
	 * @param ticks 
	 */
	public void zoomOut(int ticks)
	{
		scroll(new Point(0, ticks));
	}
	/**
	 * Resets the zoom by clicking on the reset button
	 */
	public void resetZoom()
	{
		selectTool(RESET_ZOOM_SELECTOR);
	}

	/**
	 * Draws an edge between two nodes
	 * @param source
	 * @param destination
	 */
	public void drawEdge(Node source, Node destination) {
		selectTool("Edge");

		if (source != selected)
		{
			deselect();
			clickNode(source);
		}
		clickNode(destination);

		selected = null;
	}
	
	/**
	 * Clicks on a given node 
	 * @param node
	 */
	public void clickNode(Node node) {
		clickCanvas(node.point);
	}
	
	/**
	 * Triggers a Quicksave
	 */
	public void quickSave() {
		click("button[id=export-graph-button]", new Point(10, 10));
	}

	/**
	 * Triggers a Quickload
	 */
	public void quickLoad() {
		click("button[id=import-graph-button]", new Point(10, 10));
	}

	@Override
	public void initialize(String website) {
		super.initialize(website);

		selectCanvas(CANVAS_CSS_SELECTOR);
	}

	public WebElement getToolInput(String name) {
		return driver.findElement(By.cssSelector("#tool-inputs input[name=\"" + name + "\"]"));
	}

	public void setColor(String name, String color) {
		WebElement colorSelection = getToolInput(name);
		JavascriptExecutor jse = (JavascriptExecutor) driver;
		jse.executeScript("arguments[0].setAttribute('value', '" + color
				+ "'); arguments[0].dispatchEvent(new UIEvent('input', { bubbles: true }));", colorSelection);
	}

	public void setText(String name, String text) {
		WebElement textBox = getToolInput(name);
		textBox.clear();
		textBox.sendKeys(text);
	}

	public void setCheckbox(String name, boolean selected) {
		WebElement checkbox = getToolInput(name);
		if ((selected && !checkbox.isSelected()) || (!selected && checkbox.isSelected()))
			checkbox.click();
	}

	public void setToolMode(String name) {
		driver.findElement(By.cssSelector("#tool-modes .dropdown")).click();
		driver.findElement(By.cssSelector("#tool-modes .dropdown__menu__list__item[data-value=\"" + name + "\"]"))
				.click();
	}
}
