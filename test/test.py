#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

def main(robot):

	robot.loadSite('http://localhost:8080/index.html', '//*[@id="canvas"]')

	test(robot)

	data.close()
	return


def test(robot):
	node1 = robot.createNode(30, 30)
	robot.screenshot('1')

	node2 = robot.createNode(180, 180)
	robot.screenshot('2')

	node1.select()
	node2.select(10, 10)
	return


class Node:
	def __init__(self, parent, x, y):
		self.parent = parent;
		self.x = x
		self.y = y

		parent.click(x, y)


	def select(self,  offset_x = 0, offset_y = 0):
		self.parent.click(self.x + offset_x, self.y + offset_y)
		

class Robot:
	def __init__(self, driver, name):
		self.driver = driver
		self.name = name
		self.nodes = []

	def click(self, x, y):
		ActionChains(self.driver).move_to_element_with_offset(self.canvas, x , y).click().perform()

	def loadSite(self, url, canvas_xpath):
		self.driver.get(url);
		self.canvas = self.driver.find_element_by_xpath(canvas_xpath);

	def createNode(self, x, y):
		node = Node(self, x, y)
		self.nodes.append(node)
		return node

	def close(self):
		self.driver.close()

	def screenshot(self, name):
		self.driver.get_screenshot_as_file(self.name + '_' + name + '.png')


if __name__ == "__main__":
	main(Robot(webdriver.Firefox(), "Firefox"))
	main(Robot(webdriver.Chrome(), "Chrome"))

