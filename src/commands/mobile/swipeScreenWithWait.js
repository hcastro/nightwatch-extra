
/**
 * 📝 TODO: This is a temporary method. Better approach
 *          would be to create a multi-action/touch
 *          action builder
 */
import util from "util";
import BaseCommand from "../../base-mobile-command";
import settings from "../../settings";

const SwipeScreenWithWait = function (nightwatch = null) {
  BaseCommand.call(this, nightwatch);
  this.cmd = "swipescreenwithwait";
};

util.inherits(SwipeScreenWithWait, BaseCommand);

SwipeScreenWithWait.prototype.do = function () {
  const self = this;

  const options = {
    path: `/session/${this.client.sessionId}/touch/perform`,
    method: "POST",
    data: {
      "actions": [
        { "action": "press", "options": { "x": this.fx, "y": this.fy } },
        { "action": "wait", "options": { "ms": 800 } },
        { "action": "moveTo", "options": { "x": this.tx, "y": this.ty } },
        { "action": "wait", "options": { "ms": this.waitInMillis } },
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
SwipeScreenWithWait.prototype.command = function (fx, fy, tx, ty, waitInMillis, cb) {
  this.fx = fx;
  this.fy = fy;
  this.tx = tx;
  this.ty = ty;
  this.waitInMillis = waitInMillis;
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

module.exports = SwipeScreenWithWait
