package driver;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;


import model.Node;
public class CGCPage extends CanvasPage{

	public static String CANVAS_CSS_SELECTOR = "#canvas";
	public static String HOME_PAGE = "http://127.0.0.1:8080/";

	public static String NODE_IMAGE = "src/test/resources/UnselectedNode.png";
	public static BufferedImage EDGE_TOOL;

	static{
	    try{
	        EDGE_TOOL = ImageIO.read(new File("src/test/resources/add_edge_tool.png"));
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
		clickCanvas(cssSelector, new Point(20, 20));
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
