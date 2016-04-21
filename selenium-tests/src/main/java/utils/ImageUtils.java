package utils;

import static org.bytedeco.javacpp.opencv_core.CV_32F;
import static org.bytedeco.javacpp.opencv_core.IPL_DEPTH_32F;
import static org.bytedeco.javacpp.opencv_core.cvCreateImage;
import static org.bytedeco.javacpp.opencv_core.cvGet2D;
import static org.bytedeco.javacpp.opencv_core.cvSize;
import static org.bytedeco.javacpp.opencv_imgproc.CV_TM_CCOEFF_NORMED;
import static org.bytedeco.javacpp.opencv_imgproc.cvMatchTemplate;
import static org.bytedeco.javacpp.opencv_imgproc.cvThreshold;
import static org.bytedeco.javacpp.opencv_imgproc.cvtColor;


import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.bytedeco.javacpp.opencv_core.CvPoint;
import org.bytedeco.javacpp.opencv_core.CvScalar;
import org.bytedeco.javacpp.opencv_core.IplImage;
import org.bytedeco.javacpp.opencv_core.Mat;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.openqa.selenium.Point;

public class ImageUtils {
	private static IplImage match(BufferedImage template, BufferedImage screenshot)
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
        return result;		
	}
	public static Point bestMatch(BufferedImage template, BufferedImage screenshot)
	{
		IplImage result = match(template, screenshot);
	
		Point point = null;
		double bestMatch = 0;

		for(int i = 0; i < result.height(); i++)
		{
			for(int j = 0; j < result.width(); j++)
			{
				double currentMatch = cvGet2D(result, i, j).get();
				if(currentMatch > bestMatch)
				{
					point = new Point(i, j);
					bestMatch = currentMatch;
				}
			}
		}
		
		return point;
	}
	public static List<Point> templateMatch(BufferedImage template, BufferedImage screenshot)
    {

		IplImage result = match(template, screenshot);
		double bestMatch = 0;

		for(int i = 0; i < result.height(); i++)
		{
			for(int j = 0; j < result.width(); j++)
			{
				double currentMatch = cvGet2D(result, i, j).get();
				if(currentMatch > bestMatch)
				{
					bestMatch = currentMatch;
				}
			}
		}
        cvThreshold(result, result, Math.max(0.3, bestMatch * .8), 1.0, 0);
        
        
        ArrayList<Point> points = new ArrayList<Point>();
        for(int i=0; i<result.height(); i++){
        	for(int j =0; j<result.width(); j++){
        		CvScalar point = cvGet2D(result, i,j);
        		if (point.get() == 1.0){
        			points.add(new Point(i, j));
        		}
        	}
        }
        return points;
	}
	
	public static boolean imageEquals(BufferedImage image1, BufferedImage image2)
	{
		DataBufferByte dbActual = (DataBufferByte)image1.getRaster().getDataBuffer();
		DataBufferByte dbExpected = (DataBufferByte)image2.getRaster().getDataBuffer();
		
		for (int bank = 0; bank < dbActual.getNumBanks(); bank++) {
		   byte[] actual = dbActual.getData(bank);
		   byte[] expected = dbExpected.getData(bank);

		   if(!Arrays.equals(actual, expected))				   
			   return false;
		}
		return true;
	}

	public static BufferedImage getDifferenceImage(BufferedImage img1, BufferedImage img2) {
	    int width1 = img1.getWidth(); // Change - getWidth() and getHeight() for BufferedImage
	    int width2 = img2.getWidth(); // take no arguments
	    int height1 = img1.getHeight();
	    int height2 = img2.getHeight();
	    if ((width1 != width2) || (height1 != height2)) {
	        return null;
	    }

	    // NEW - Create output Buffered image of type RGB
	    BufferedImage outImg = new BufferedImage(width1, height1, BufferedImage.TYPE_BYTE_INDEXED);

	    // Modified - Changed to int as pixels are ints
	    int diff;
	    int result; // Stores output pixel
	    for (int i = 0; i < height1; i++) {
	        for (int j = 0; j < width1; j++) {
	            int rgb1 = img1.getRGB(j, i);
	            int rgb2 = img2.getRGB(j, i);
	            int r1 = (rgb1 >> 16) & 0xff;
	            int g1 = (rgb1 >> 8) & 0xff;
	            int b1 = (rgb1) & 0xff;
	            int r2 = (rgb2 >> 16) & 0xff;
	            int g2 = (rgb2 >> 8) & 0xff;
	            int b2 = (rgb2) & 0xff;
	            diff = Math.abs(r1 - r2); // Change
	            diff += Math.abs(g1 - g2);
	            diff += Math.abs(b1 - b2);
	            diff /= 3; // Change - Ensure result is between 0 - 255
	            // Make the difference image gray scale
	            // The RGB components are all the same
	            result = (diff << 16) | (diff << 8) | diff;
	            outImg.setRGB(j, i, result); // Set result
	        }
	    }

	    // Now return
	    return outImg;
	}
}
