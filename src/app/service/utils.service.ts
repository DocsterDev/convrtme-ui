import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UtilsService {

  constructor() {
  }

  public static generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  public static formatDuration (duration) {
    if (!duration) {
      return 0;
    }
    if (duration.length > 5) {
      return moment(duration, 'h:mm:ss').diff(moment().startOf('day'), 'seconds');
    }
    return moment(duration, 'm:ss').diff(moment().startOf('day'), 'seconds');
  }

  public static formatTime (seconds) {
    if (seconds >= 3600) {
      return moment.utc(seconds * 1000).format('h:mm:ss');
    }
    return moment.utc(seconds * 1000).format('m:ss');
  }
}
