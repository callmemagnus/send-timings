import { test } from "tape";
import sinon from "sinon";

import Timings from "../src/timings";

const url = "/test/url";

const document = {
  createElement: () => ({}),
  body: {
    removeChild: () => {},
    appendChild: () => {},
  },
};

const window = {
  performance: {
    timing: {
      navigationStart: 10,
      testA: 48,
    },
  },
  encodeURIComponent: (value) => value,
};

test("Graceful degradation when timings are not available", (assert) => {
  const doc = { createElement: sinon.spy() };

  const timings = Timings(url, doc, {
    encodeURIComponent: window.encodeURIComponent,
  });
  timings.sendTiming();
  timings.sendCustomMeasures();
  timings.sendMarks();

  assert.false(doc.createElement.called, "createElement has not been called");
  assert.end();
});

test("sendTiming", (assert) => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy(),
    },
    location: "example.com",
  };

  const timings = Timings(url, doc, window);
  timings.sendTiming();

  assert.true(doc.body.appendChild.called, "appendChild has been called");
  assert.equal(
    imgElement.src,
    `${url}?timing&page=example.com&navigationStart=10&testA=48`,
    "url is correct"
  );
  assert.end();
});

test("sendMeasures", (assert) => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy(),
    },
    location: "example.test",
  };

  const timings = Timings(url, doc, window);
  timings.sendMeasures();
  assert.true(doc.body.appendChild.called, "appendChild has been called");
  assert.equal(
    imgElement.src,
    `${url}?measures&page=example.test&navigationStart=10&testA=38`,
    "url is correct"
  );
  assert.end();
});

test("sendMarks", (assert) => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy(),
    },
    location: "example.test",
  };
  const win = {
    performance: {
      getEntriesByType: sinon.stub().returns([
        {
          name: "testA",
          startTime: 1234,
        },
        {
          name: "testB",
          startTime: 4321,
        },
      ]),
    },
    encodeURIComponent: window.encodeURIComponent,
  };
  const timings = Timings(url, doc, win);
  timings.sendMarks();

  assert.true(doc.body.appendChild.called, "appendChild has been called");
  assert.equal(
    imgElement.src,
    `${url}?marks&page=example.test&testA=1234&testB=4321`,
    "url is correct"
  );
  assert.end();
});

test("sendCustomMeasures", (assert) => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy(),
    },
    location: "example.test",
  };
  const win = {
    performance: {
      getEntriesByType: sinon.stub().returns([
        {
          name: "testA",
          duration: 1234,
        },
        {
          name: "testB",
          duration: 4321,
        },
      ]),
    },
    encodeURIComponent: window.encodeURIComponent,
  };

  const timings = Timings(url, doc, win);
  timings.sendCustomMeasures();

  assert.true(doc.body.appendChild.called, "appendChild has beend called");
  assert.equal(
    imgElement.src,
    `${url}?customMeasures&page=example.test&testA=1234&testB=4321`,
    "url is correct"
  );
  assert.end();
});

test("setCurrentPage", (assert) => {
  const imgElement = {};
  const doc = {
    createElement: sinon.stub().returns(imgElement),
    body: {
      appendChild: sinon.spy(),
    },
    location: "example.test/first",
  };

  const timings = Timings("/test-url", doc, window);

  timings.sendTiming();

  assert.match(
    imgElement.src,
    new RegExp("page=example.test/first"),
    "First page log correctly generated"
  );

  timings.setCurrentPage("example.test/second");

  timings.sendTiming();

  assert.match(
    imgElement.src,
    new RegExp("page=example.test/second"),
    "Second page call log correctly generated"
  );

  assert.end();
});
