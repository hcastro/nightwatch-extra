import util from "util";
import BaseCommand from "../../base-mobile-command";
import settings from "../../settings";

 /**
  * This command is useful for more precise horizontal
  * swiping in iOS.
  */
const SwipeScreenWithLongPress = function (nightwatch = null) {
  BaseCommand.call(this, nightwatch);
  this.cmd = "swipescreenwithlongpress";
};

util.inherits(SwipeScreenWithLongPress, BaseCommand);

SwipeScreenWithLongPress.prototype.do = function () {
  const self = this;

  const options = {
    path: `/session/${this.client.sessionId}/touch/perform`,
    method: "POST",
    data: {
      "actions": [
        { "action": "longPress", "options": { "x": this.fx, "y": this.fy } },
        { "action": "wait", "options": { "ms": 800 } },
        { "action": "moveTo", "options": { "x": this.tx, "y": this.ty } },
        { "action": "release", "options": {} }]
    }
  };

  this.protocol(options, (result) => {
    if (result.status === 0) {
      self.pass({ actual: result.value });
    } else {
      self.fail({
        code: settings.FAILURE_REASONS.BUILTIN_ELEMENT_NOT_OPERABLE,
        message: self.failureMessage
      });
    }
  });
};

/*eslint max-params:["error", 5] */
SwipeScreenWithLongPress.prototype.command = function (fx, fy, tx, ty, cb) {
  this.fx = fx;
  this.fy = fy;
  this.tx = tx;
  this.ty = ty;
  this.cb = cb;

  this.successMessage = `Screen was swiped from {x:${fx}, y:${fy}} `
    + `towards {x:${tx}, y:${ty}} after %d milliseconds.`;
  this.failureMessage = `Screen wasn't swiped from {x:${fx}, y:${fy}} `
    + `towards {x:${tx}, y:${ty}} after %d milliseconds.`;

  this.startTime = (new Date()).getTime();

  // Track how many times selector is successfully checked by /element protocol
  this.seenCount = 0;
  this.do();

  return this;
};

module.exports = SwipeScreenWithLongPress;