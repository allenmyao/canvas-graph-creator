/* eslint-disable no-loop-func */

import chai from 'chai';
chai.should();

import Tool from '../../src/js/tool/tool';

describe('Tool', () => {
  let tool;

  beforeEach(() => {
    tool = new Tool();
  });

  describe('#constructor', () => {
    it('should create instance of Tool', () => {
      tool.should.be.instanceOf(Tool);
    });
  });

  describe('#hasModes', () => {
    it('should return false', () => {
      (tool.hasModes()).should.be.false;
    });
  });

  describe('#hasInputs', () => {
    it('should return false', () => {
      (tool.hasInputs()).should.be.false;
    });
  });

  describe('#preSelectObject', () => {
    it('should return true', () => {
      (tool.preSelectObject()).should.be.true;
    });
  });

  describe('#preDragObject', () => {
    it('should return true', () => {
      (tool.preDragObject()).should.be.true;
    });
  });

  let functions = [
    'activate',
    'cancel',

    'selectObject',
    'dragObject',
    'dropOnObject',
    'dragOverObject',

    'abortSelect',
    'preSelectNone',
    'preDragNone',

    'selectNone',
    'dragNone',
    'dropOnNone'
  ];

  for (let fn of functions) {
    describe('#' + fn, () => {
      it('should be a function', () => {
        (tool[fn]).should.be.a('function');
      });

      it('should be callable', () => {
        (function () {
          tool[fn]();
        }).should.not.throw(Error);
      });
    });
  }
});
