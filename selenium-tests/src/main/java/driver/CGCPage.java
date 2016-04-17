package driver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import javax.imageio.ImageIO;

import org.bytedeco.javacv.*;
import org.bytedeco.javacpp.*;
import org.bytedeco.javacpp.opencv_core.CvPoint;
import org.bytedeco.javacpp.opencv_core.CvScalar;
import org.bytedeco.javacpp.opencv_core.IplImage;
import org.bytedeco.javacpp.opencv_core.Mat;

import static org.bytedeco.javacpp.opencv_core.*;
import static org.bytedeco.javacpp.opencv_imgproc.*;
import static org.bytedeco.javacpp.opencv_highgui.*;
import static org.bytedeco.javacpp.opencv_imgcodecs.*;
import static org.bytedeco.javacpp.opencv_calib3d.*;
import static org.bytedeco.javacpp.opencv_objdetect.*;

import model.Node;
import utils.ImageUtils;

import static org.junit.Assert.*;
public class CGCPage extends CanvasPage{

	public static String CANVAS_XPATH = "//*[@id=\"canvas\"]";
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


	public Node createNode(int x, int y) {
		deselect();
		clickCanvas(x, y);
		Node node = new Node(x, y);
		return node;
	}
	public void deselect()
	{
		if(selected != null)
		{
			clickCanvas(selected.x, selected.y);
			selected = null;
		}
	}
	public void selectTool(String xPath)
	{
		clickCanvas(xPath, 20, 20);
	}


	public void drawEdge(Node source, Node destination) {
		selectTool("//*[@id=\"toolbar\"]/ul/li[2]/div");
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
		clickCanvas(node.x, node.y);
	}
	@Override
	public void initialize(String website)
	{
		super.initialize(website);
		selectCanvas(CANVAS_XPATH);
	}
/*
	public static CGC create() throws IOException
	{
		CGC driver = new CGC();
		driver.reload();

		//driver.addElement(EDGE_TOOL, "edge tool");

		return driver;
	}
	public static CGC create(String website, String browser) throws IOException
	{
		CGC driver = new CGC(browser);
		driver.reload();
		//driver.addElement(EDGE_TOOL, "edge tool");

		return driver;
	}
*/








}
/*
public class ChromeConsoleLogging {
    private WebDriver driver;


    @BeforeMethod
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "c:\\path\\to\\chromedriver.exe");
        DesiredCapabilities caps = DesiredCapabilities.chrome();
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        caps.setCapability(CapabilityType.LOGGING_PREFS, logPrefs);
        driver = new ChromeDriver(caps);
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }

    public void analyzeLog() {
        LogEntries logEntries = driver.manage().logs().get(LogType.BROWSER);
        for (LogEntry entry : logEntries) {
            System.out.println(new Date(entry.getTimestamp()) + " " + entry.getLevel() + " " + entry.getMessage());
            //do something useful with the data
        }
    }

    @Test
    public void testMethod() {
        driver.get("http://mypage.com");
        //do something on page
        analyzeLog();
    }
}
*/
