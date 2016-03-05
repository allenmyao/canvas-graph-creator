package driver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.awt.image.BufferedImage;

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

	public boolean match(BufferedImage template, BufferedImage screenshot)
    {
        Java2DFrameConverter javaConverter = new Java2DFrameConverter();
        OpenCVFrameConverter.ToIplImage cvConverter = new OpenCVFrameConverter.ToIplImage();
        OpenCVFrameConverter.ToMat cvConverter2 = new OpenCVFrameConverter.ToMat();
        
        Frame tmp_f = javaConverter.getFrame(template);
        Frame src_f = javaConverter.getFrame(screenshot);
        
        Mat src_m = cvConverter2.convert(src_f);
        Mat tmp_m = cvConverter2.convert(tmp_f);
        cvtColor(src_m, src_m, CV_32F);
        cvtColor(tmp_m, tmp_m, CV_32F);
        src_f = cvConverter2.convert(src_m);
        tmp_f = cvConverter2.convert(tmp_m);
        
        IplImage tmp = cvConverter.convert(tmp_f);
        IplImage src = cvConverter.convert(src_f);
        
        IplImage result = cvCreateImage(cvSize(src.width() - tmp.width() + 1, src.height() - tmp.height() + 1), IPL_DEPTH_32F,0);
        
        cvMatchTemplate(src, tmp, result, CV_TM_CCOEFF_NORMED);
        
        cvThreshold(result, result, 0.5, 1.0, 0);
        
        DoublePointer min_v = new DoublePointer();
        DoublePointer max_v = new DoublePointer();
        
        CvPoint min_p = new CvPoint();
        CvPoint max_p = new CvPoint();
        
        cvMinMaxLoc(result,min_v, max_v, min_p, max_p,null);
        
        CvScalar point = cvGet2D(result, max_p.y(), max_p.x());
        
        return point.get() == 1.0;
	}
}
