package acceptance;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.Point;

import cucumber.api.Transformer;

public class PointListTransformer extends Transformer<List<Point>>{
	private static final String DELIMITER = " to ";
	private static final PointTransformer COORDINATE_TRANSFORMER = new PointTransformer();
	
	
	@Override
	public List<Point> transform(String s) {
		List<Point> points = new ArrayList<Point>();
		for(String point:s.split(DELIMITER))
		{
			points.add(COORDINATE_TRANSFORMER.transform(point));
		}
		return points;
	}

}
