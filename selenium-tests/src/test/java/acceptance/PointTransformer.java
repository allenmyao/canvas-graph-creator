package acceptance;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openqa.selenium.Point;

import cucumber.api.Transformer;

public class PointTransformer extends Transformer<Point>{
	Pattern pattern;
	
	public PointTransformer()
	{
		pattern = Pattern.compile("\\D*(\\d+)\\D*(\\d+)\\D*");
	}
	@Override
	public Point transform(String s) {
		Matcher matcher = pattern.matcher(s);
		
		if(!matcher.matches())
		{
			throw new IllegalStateException("No coordinate match found for: " + s);
		}
				
		return new Point(Integer.parseInt(matcher.group(1)), Integer.parseInt(matcher.group(2)));
	}
}