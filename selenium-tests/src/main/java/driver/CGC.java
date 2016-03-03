package driver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import model.Node;

public class CGC extends Driver{

	public static String CANVAS_XPATH = "//*[@id=\"canvas\"]";
	public static String HOME_PAGE = "http://localhost:8080/webpack-dev-server/index.html";
	public static final String IFRAME = "iframe";
	
	private Node selected;
	
	public CGC(){
		super();
		selected = null;
	}

	public CGC(String name) {
		super(name);
		selected = null;
	}
	
	public Node createNode(int x, int y) {
		deselect();
		click(x, y);
		Node node = new Node(x, y);
		return node;
	}
	public void deselect()
	{
		if(selected != null)
		{
			click(selected.x, selected.y);
			selected = null;
		}
	}
	public void selectTool(String xPath)
	{
		click(xPath, 20, 20);
	}
	public void drawEdge(Node source, Node destination) {
		//
		selectTool("//*[@id=\"tools-container\"]/ul/li[2]/div");
		if (source != selected)
		{
			deselect();
			clickNode(source);
		}
		clickNode(destination);

		selected = null;
	}

	public void clickNode(Node node) {
		// TODO Auto-generated method stub
		click(node.x, node.y);
	}


	public static CGC create()
	{
		CGC driver = new CGC();
		driver.loadSite(HOME_PAGE);
		driver.switchToFrame(IFRAME);
		driver.selectCanvas(CANVAS_XPATH);
		
		return driver;	
	}
	public static CGC create(String website, String browser)
	{
		//System.setProperty("webdriver.chrome.driver", "C:\\Users\\ndlu2\\Desktop\\CS 428\\selenium-2.52.0\\chromedriver.exe");
		
		CGC driver = new CGC(browser);
		driver.loadSite(website);
		driver.switchToFrame(IFRAME);
		driver.selectCanvas(CANVAS_XPATH);
		
		return driver;
	}

	
}
