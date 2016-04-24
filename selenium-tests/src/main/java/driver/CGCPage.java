package driver;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;


import model.Node;
public class CGCPage extends CanvasPage{

	public static String CANVAS_CSS_SELECTOR = "#canvas";
	public static String RESET_ZOOM_SELECTOR = "#reset-transform";
	
	public static String HOME_PAGE = "http://127.0.0.1:8080/";

	public static String NODE_IMAGE = "src/test/resources/UnselectedNode.png";
	public static BufferedImage EDGE_TOOL;
	
	public static Map<String, String> shortcuts;

	static{
	    try{
	        //EDGE_TOOL = ImageIO.read(new File("src/test/resources/add_edge_tool.png"));
	    	shortcuts = new HashMap<String, String>();
	    	shortcuts.put("Edge", "#toolbar .tool[data-tool=\"edge\"]");
	    	shortcuts.put("Toggle Directed Edge", "#context-menu > ul:nth-child(2) > li");
	    	
	    	shortcuts.put("Toggle Start State", "#context-menu > ul:nth-child(1) > li:nth-child(2)");
	    	shortcuts.put("Toggle Accepting State", "#context-menu > ul:nth-child(1) > li:nth-child(1)");
	    	
	    	shortcuts.put("Delete Edge", "#context-menu > ul:nth-child(3) > li");
	    	shortcuts.put("Delete Node", "#context-menu > ul:nth-child(3) > li");
	    	
	    	shortcuts.put("Add Circle Node", "#context-menu > ul.context-menu__section.context-menu__section--visible > li:nth-child(1)");
	    }catch(final Exception ex){
	        throw new RuntimeException("Failed to load resources", ex);
	    }
	}
	private Node selected;

	public CGCPage(WebDriver driver) throws IOException{
		super(driver, HOME_PAGE);
		selected = null;
	}


	public Node createNode(Point point) {
		deselect();
		clickCanvas(point);
		Node node = new Node(point);
		return node;
	}
	public void deselect()
	{
		if(selected != null)
		{
			clickCanvas(selected.point);
			selected = null;
		}
	}
	public void selectTool(String cssSelector)
	{
		if(shortcuts.containsKey(cssSelector))
			cssSelector = shortcuts.get(cssSelector);
		click(cssSelector, new Point(10, 10));
	}
	public void zoomIn(int ticks)
	{
		scroll(new Point(0, -1 * ticks));
	}
	public void zoomOut(int ticks)
	{
		scroll(new Point(0, ticks));
	}
	public void resetZoom()
	{
		selectTool(RESET_ZOOM_SELECTOR);
	}

	public void drawEdge(Node source, Node destination) {
		selectTool("#toolbar .tool[data-tool=\"edge\"]");
		//clickElement("edge tool");
		if (source != selected)
		{
			deselect();
			clickNode(source);
		}
		clickNode(destination);

		selected = null;
	}
	
	public void clickNode(Node node) {
		clickCanvas(node.point);
	}
	@Override
	public void initialize(String website)
	{
		super.initialize(website);
		
		selectCanvas(CANVAS_CSS_SELECTOR);
		//addElement(EDGE_TOOL, "edge tool");
	}
}
