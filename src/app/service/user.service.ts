import {Injectable} from '@angular/core';

@Injectable()
export class UserService {

  constructor() {
  }

  public getCurrentUser() {
    return 'TestUser1';
  }

}
