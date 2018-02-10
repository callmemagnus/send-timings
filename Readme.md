# send-metrics

This module enables you to just send the navigation timing API available info to a configured url.

## Usage

Install it;

```sh
npm i @magnus/send-metrics
```

Use it:

```javascript
import Metric from "@magnus/send-metrics";

const url = "/some/path/somewhere/not/cached";

const metric = Metric(url);

// later in the code
metric.sendTimings();

// or
metric.sendMeasures();

// or if you have mark
metric.sendMarks();

// or if you have existing measure:
metric.sendCustomMeasures();
```

## Available methods

All the methods build a query string from values depending on method. It add the query string to the image url.

### sendTimings

Just take all numeric values in `window.performance.timing` to build the query string. It also add a `timings` parameter.

### sendMeasures

Takes all numeric values in `ŵindow.performance.timing` and substract the value of `navigationStart` (except when the value is 0).

### sendMarks

Takes all marks in `window.performance.timing.getEntriesByType('mark')` and their respective`startTime`.

### sendMeasures

Takes all measures in `window.performance.timing.getEntriesByType('measure')` and their respective`duration`.
