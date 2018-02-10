# send-timings

This module enables you to just send the navigation timing API available info to a configured url.

## Usage

Install it;

```sh
npm i @magnus/send-metrics
```

Use it:

```javascript
import Timings from "@magnus/send-timings";

const url = "/some/path/somewhere/not/cached";

const timingsSender = Timings(url);

// later in the code
timingsSender.sendTimings();

// or
timingsSender.sendMeasures();

// or if you have mark
timingsSender.sendMarks();

// or if you have existing measure:
timingsSender.sendCustomMeasures();
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

## Collecting the metrics

This module only sends the data to a remote url by adding an image to the body of the current document. You'll need to implement a collector.

Obviously, the target url must not be cached, although it probably won't be because of the complexity of the query string built.

A collector can be a dedicated location on you nginx server or an application server, you choose.

I start with an special nginx configured as follows:

```
http {
  ...
  log_format timing '"$http_referer" $time_iso8601 "$http_x_forwarded_for" "$request" "$http_user_agent"';
  access_log /var/log/nginx/access.log timing
  ...

  location =/no-cache {
    return 204;
  }
}
```

You can do that with the nginx docker image as a basis.
