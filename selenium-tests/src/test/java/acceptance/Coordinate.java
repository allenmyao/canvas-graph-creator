package acceptance;

public class Coordinate {
	public int x;
	public int y;
	
	public Coordinate(int x, int y)
	{
		this.x = x;
		this.y = y;
	}

	public Coordinate() {

	}
	public String toString()
	{
		return "(" + x + ", " + y + ")";
	}
}
