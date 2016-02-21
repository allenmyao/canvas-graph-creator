#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from PIL import Image
from io import BytesIO
import base64
import ImageChops

def main(robot):

	robot.loadSite('http://localhost:8080/webpack-dev-server/index.html', )
	robot.switch_to_frame('iframe')
	robot.select_canvas('//*[@id="canvas"]')

	test(robot)

	robot.close()
	return


def test(robot):
	node1 = robot.createNode(33, 33)

	robot.save_screenshot('1_expected.png')
	#robot.assertScreenshot('1_expected.png')
	node2 = robot.createNode(84, 84)

	robot.edge(node1, node2)

	robot.assertNode(node1)


	robot.select(node1)
	#node3 = robot.createNode(180, 180)


	robot.save_screenshot('2_expected.png')
	#robot.assertScreenshot('2_expected.png')

	#robot.assertNode(node2)

	robot.select(node1)
	robot.select(node2, 10, 10)



	robot.save_screenshot('3_expected.png')
	#robot.assertScreenshot('3_expected.png')
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

	def loadSite(self, url):
		self.driver.get(url);

	def switch_to_frame(self, iframe):
		self.driver.switch_to_frame(self.driver.find_element_by_tag_name(iframe))

	def select_canvas(self, xpath):
		self.canvas = self.driver.find_element_by_xpath(xpath);

	def close(self):
		self.driver.close()

	def screenshot(self):
		return Image.open(BytesIO(base64.decodestring(self.driver.get_screenshot_as_base64())))

	def save_screenshot(self, name):
		self.driver.get_screenshot_as_file(self.browser + '_' + name)

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

	def assertNode(self, node):
		location = self.canvas.location_once_scrolled_into_view
		img = self.screenshot()

		left = int(location['x']) + node.x - 40
		right = int(location['x']) + node.x + 40
		top = int(location['y']) + node.y - 40
		bottom = int(location['y']) + node.y + 40
		img = img.crop((left, top, right, bottom))
		img.save('surrounding.png')
		#TODO use opencv to see if node actually exists

	def assertScreenshot(self, name):
		img1 = self.screenshot()
		img2 = Image.open(self.browser + '_' + name)
		if ImageChops.difference(img1, img2).getbbox() is not None:
			img1.save(self.browser + '_Error_' + name)
			print 'Assertion Error: current state does not match ' + name


	def deselect(self):
		if self.selected != None:
			self.click(self.selected.x, self.selected.y)
			self.selected = None

	def is_selected(self, node):
		return self.selected != None

	def edge(self, node1, node2):
		if not self.is_selected(node1):
			self.select(node1)
		self.click(node2.x, node2.y)
		self.selected = None

	def select(self, node, offset_x = 0, offset_y = 0):
		self.deselect()
		self.click(node.x + offset_x, node.y + offset_y)
		self.selected = node

if __name__ == "__main__":
	main(CGC(webdriver.Firefox(), "Firefox"))
	main(CGC(webdriver.Chrome(), "Chrome"))

