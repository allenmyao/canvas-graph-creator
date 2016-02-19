#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

def main(robot):

	robot.loadSite('http://localhost:8080/index.html', '//*[@id="canvas"]')

	test(robot)

	robot.close()
	return


def test(robot):
	node1 = robot.createNode(30, 30)
	robot.screenshot('1')

	robot.select(node1)
	node2 = robot.createNode(180, 180)
	robot.screenshot('2')

	robot.select(node1)
	robot.select(node2, 10, 10)
	return


class Node:
	def __init__(self, parent, x, y):
		self.parent = parent;
		self.x = x
		self.y = y




		
#Generic wrapper for Selenium web driver canvas
class CanvasDriver:
	def __init__(self, driver, browser):
		self.driver = driver
		self.browser = browser

	def click(self, x, y):
		ActionChains(self.driver).move_to_element_with_offset(self.canvas, x , y).click().perform()

	def loadSite(self, url, canvas_xpath):
		self.driver.get(url);
		self.canvas = self.driver.find_element_by_xpath(canvas_xpath);

	def close(self):
		self.driver.close()

	def screenshot(self, browser):
		self.driver.get_screenshot_as_file(self.browser + '_' + browser + '.png')

class CGC(CanvasDriver):
	def __init__(self, driver, browser):
		CanvasDriver.__init__(self, driver, browser)
		self.nodes = []
		self.selected = None

	def createNode(self, x, y):
		self.deselect()
		self.click(x, y)

		node = Node(self, x, y)
		self.nodes.append(node)
		return node

	def deselect(self):
		if self.selected != None:
			self.click(self.selected.x, self.selected.y)
			self.selected = None

	def selected(self, node):
		return self.selected == None

	def select(self, node, offset_x = 0, offset_y = 0):
		self.deselect()
		self.click(node.x + offset_x, node.y + offset_y)
		self.selected = node

if __name__ == "__main__":
	main(CGC(webdriver.Firefox(), "Firefox"))
	main(CGC(webdriver.Chrome(), "Chrome"))

