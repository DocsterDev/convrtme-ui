import {Injectable} from '@angular/core';

@Injectable()
export class UserService {

  constructor() {
  }

  private currentUser = 'c5cf388e-261f-46d9-aa83-3d9764e36983'; // TODO Temp user id to simulate user being signed in

  /**
   * Get current user id signed in
   */
  getCurrentUser() {
    return this.currentUser;
  }

}
