package utils;

public class Utils {
	/**
	 * Converts a given word to an integer
	 * 
	 * @param inwords
	 *            an english representation of a number
	 * @return an integer representing the given input
	 */
	// http://stackoverflow.com/questions/4062022/how-to-convert-words-to-a-number
	public static int inNumerals(String inwords) {
		try {
			return Integer.parseInt(inwords);
		} catch (Exception e) {
		}
		int wordnum = 0;
		String[] arrinwords = inwords.split(" ");
		int arrinwordsLength = arrinwords.length;
		if (inwords.equals("zero") || inwords.equals("no")) {
			return 0;
		}
		if (inwords.contains("thousand")) {
			int indexofthousand = inwords.indexOf("thousand");
			// System.out.println(indexofthousand);
			String beforethousand = inwords.substring(0, indexofthousand);
			// System.out.println(beforethousand);
			String[] arrbeforethousand = beforethousand.split(" ");
			int arrbeforethousandLength = arrbeforethousand.length;
			// System.out.println(arrbeforethousandLength);
			if (arrbeforethousandLength == 2) {
				wordnum = wordnum + 1000 * (wordtonum(arrbeforethousand[0]) + wordtonum(arrbeforethousand[1]));
				// System.out.println(wordnum);
			}
			if (arrbeforethousandLength == 1) {
				wordnum = wordnum + 1000 * (wordtonum(arrbeforethousand[0]));
				// System.out.println(wordnum);
			}

		}
		if (inwords.contains("hundred")) {
			int indexofhundred = inwords.indexOf("hundred");
			// System.out.println(indexofhundred);
			String beforehundred = inwords.substring(0, indexofhundred);

			// System.out.println(beforehundred);
			String[] arrbeforehundred = beforehundred.split(" ");
			int arrbeforehundredLength = arrbeforehundred.length;
			wordnum = wordnum + 100 * (wordtonum(arrbeforehundred[arrbeforehundredLength - 1]));
			String afterhundred = inwords.substring(indexofhundred + 8);// 7 for
																		// 7
																		// char
																		// of
																		// hundred
																		// and 1
																		// space
			// System.out.println(afterhundred);
			String[] arrafterhundred = afterhundred.split(" ");
			int arrafterhundredLength = arrafterhundred.length;
			if (arrafterhundredLength == 1) {
				wordnum = wordnum + (wordtonum(arrafterhundred[0]));
			}
			if (arrafterhundredLength == 2) {
				wordnum = wordnum + (wordtonum(arrafterhundred[1]) + wordtonum(arrafterhundred[0]));
			}
			// System.out.println(wordnum);

		}
		if (!inwords.contains("thousand") && !inwords.contains("hundred")) {
			if (arrinwordsLength == 1) {
				wordnum = wordnum + (wordtonum(arrinwords[0]));
			}
			if (arrinwordsLength == 2) {
				wordnum = wordnum + (wordtonum(arrinwords[1]) + wordtonum(arrinwords[0]));
			}
			// System.out.println(wordnum);
		}

		return wordnum;
	}

	public static int wordtonum(String word) {
		int num = 0;

		if (word.equals("one")) {
			num = 1;

		} else if (word.equals("two")) {
			num = 2;

		} else if (word.equals("three")) {
			num = 3;

		} else if (word.equals("four")) {
			num = 4;

		} else if (word.equals("five")) {
			num = 5;

		} else if (word.equals("six")) {
			num = 6;

		} else if (word.equals("seven")) {
			num = 7;

		} else if (word.equals("eight")) {
			num = 8;

		} else if (word.equals("nine")) {
			num = 9;

		} else if (word.equals("ten")) {
			num = 10;

		} else if (word.equals("eleven")) {
			num = 11;

		} else if (word.equals("twelve")) {
			num = 12;

		} else if (word.equals("thirteen")) {
			num = 13;

		} else if (word.equals("fourteen")) {
			num = 14;

		} else if (word.equals("fifteen")) {
			num = 15;

		} else if (word.equals("sixteen")) {
			num = 16;

		} else if (word.equals("seventeen")) {
			num = 17;

		} else if (word.equals("eighteen")) {
			num = 18;

		} else if (word.equals("nineteen")) {
			num = 19;

		} else if (word.equals("twenty")) {
			num = 20;

		} else if (word.equals("thirty")) {
			num = 30;

		} else if (word.equals("forty")) {
			num = 40;

		} else if (word.equals("fifty")) {
			num = 50;

		} else if (word.equals("sixty")) {
			num = 60;

		} else if (word.equals("seventy")) {
			num = 70;

		} else if (word.equals("eighty")) {
			num = 80;

		} else if (word.equals("ninety")) {
			num = 90;

		} else if (word.equals("hundred")) {
			num = 100;

		} else if (word.equals("thousand")) {
			num = 1000;

		}
		/*
		 * default: num = "Invalid month"; break;
		 */
		return num;
	}
}
