package acceptance;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cucumber.api.Transformer;

public class CoordinateTransformer extends Transformer<Coordinate>{
	Pattern pattern;
	
	public CoordinateTransformer()
	{
		pattern = Pattern.compile("\\D*(\\d+)\\D*(\\d+)\\D*");
	}
	@Override
	public Coordinate transform(String s) {
		Matcher matcher = pattern.matcher(s);
		
		if(!matcher.matches())
		{
			throw new IllegalStateException("No coordinate match found for: " + s);
		}
		
		Coordinate coordinate = new Coordinate();
		
		coordinate.x = Integer.parseInt(matcher.group(1));
		coordinate.y = Integer.parseInt(matcher.group(2));
		
		return coordinate;
	}
}