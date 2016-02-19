#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

def main(driver, browser):
	driver.get("http://localhost:8080/index.html")
	canvas = driver.find_element_by_xpath('//*[@id="canvas"]')

	test(driver, canvas, browser)

	driver.close()
	return


def test(driver, canvas , browser):
	ActionChains(driver).move_to_element_with_offset(canvas, 30, 30).click().perform()
	driver.get_screenshot_as_file(browser + '_1.png')

	ActionChains(driver).move_to_element_with_offset(canvas, 180, 180).click().perform()
	driver.get_screenshot_as_file(browser + "_2.png")

	ActionChains(driver).move_to_element_with_offset(canvas, 50, 50).click().perform()
	driver.get_screenshot_as_file(browser + '_3.png')
	return

if __name__ == "__main__":
    main(webdriver.Firefox(), "Firefox")
    main(webdriver.Chrome(), "Chrome")