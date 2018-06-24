import {Injectable} from '@angular/core'
import * as moment from 'moment';

@Injectable()
export class UtilsService {

  constructor() {
  }

  public generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  public formatDuration (duration) {
    if (duration.length > 5) {
      return moment(duration, 'h:mm:ss').diff(moment().startOf('day'), 'seconds');
    }
    return moment(duration, 'm:ss').diff(moment().startOf('day'), 'seconds');
  }

  public findNewBadge(video: any) {
    if (video.badges && video.badges.length > 0) {
      video.badges.forEach((e) => {
        if (e.metadataBadgeRenderer.label === 'NEW') {
          return true;
        }
      });
    }
    return false;
  }

}
