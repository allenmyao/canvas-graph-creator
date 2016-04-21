package acceptance;

import java.util.ArrayList;
import java.util.List;

import cucumber.api.Transformer;

public class CoordinateListTransformer extends Transformer<List<Coordinate>>{
	private static final String DELIMITER = " to ";
	private static final CoordinateTransformer COORDINATE_TRANSFORMER = new CoordinateTransformer();
	
	
	@Override
	public List<Coordinate> transform(String s) {
		List<Coordinate> coordinates = new ArrayList<Coordinate>();
		for(String coordinate:s.split(DELIMITER))
		{
			coordinates.add(COORDINATE_TRANSFORMER.transform(coordinate));
		}
		return coordinates;
	}

}
