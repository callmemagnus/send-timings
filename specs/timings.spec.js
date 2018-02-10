import { test } from "tape";
import sinon from "sinon";

import Timings from "../src/timings";

const url = "/test/url";

const document = {
  createElement: () => ({}),
  body: {
    removeChild: () => {},
    appendChild: () => {}
  }
};

const window = {
  performance: {
    timing: {
      navigationStart: 10,
      testA: 48
    }
  }
};

test("sendTiming - does not work when timing API does not work", assert => {
  const doc = { createElement: sinon.spy() };

  const Timings = Timings(url, doc, {});
  Timings.sendTiming();

  assert.false(doc.createElement.called);
  assert.end();
});

test("sendTiming - creates an image", assert => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy()
    }
  };

  const Timings = Timings(url, doc, window);
  Timings.sendTiming();

  assert.true(doc.body.appendChild.called);
  assert.equal(imgElement.src, `${url}?timing&navigationStart=10&testA=48`);
  assert.end();
});

test("sendMeasures - does not work when timing API does not work", assert => {
  const doc = { createElement: sinon.spy() };

  const Timings = Timings(url, doc, {});
  Timings.sendMeasures();

  assert.false(doc.createElement.called);
  assert.end();
});

test("sendMeasures - creates an image", assert => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy()
    }
  };

  const Timings = Timings(url, doc, window);
  Timings.sendMeasures();
  assert.true(doc.body.appendChild.called);
  assert.equal(imgElement.src, `${url}?measures&navigationStart=10&testA=38`);
  assert.end();
});

test("sendMarks - does not work when timing API does not work", assert => {
  const doc = { createElement: sinon.spy() };

  const Timings = Timings(url, doc, {});
  Timings.sendMarks();

  assert.false(doc.createElement.called);
  assert.end();
});

test("sendMarks - creates an image", assert => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy()
    }
  };
  const win = {
    performance: {
      getEntriesByType: sinon.stub().returns([
        {
          name: "testA",
          startTime: 1234
        },
        {
          name: "testB",
          startTime: 4321
        }
      ])
    }
  };
  const Timings = Timings(url, doc, win);
  Timings.sendMarks();

  assert.true(doc.body.appendChild.called);
  assert.equal(imgElement.src, `${url}?marks&testA=1234&testB=4321`);
  assert.end();
});

test("sendCustomMeasures - does not work when timing API does not work", assert => {
  const doc = { createElement: sinon.spy() };

  const Timings = Timings(url, doc, {});
  Timings.sendCustomMeasures();

  assert.false(doc.createElement.called);
  assert.end();
});

test("sendCustomMeasures - creates an image", assert => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy()
    }
  };
  const win = {
    performance: {
      getEntriesByType: sinon.stub().returns([
        {
          name: "testA",
          duration: 1234
        },
        {
          name: "testB",
          duration: 4321
        }
      ])
    }
  };

  const Timings = Timings(url, doc, win);
  Timings.sendCustomMeasures();

  assert.true(doc.body.appendChild.called);
  assert.equal(imgElement.src, `${url}?customMeasures&testA=1234&testB=4321`);
  assert.end();
});