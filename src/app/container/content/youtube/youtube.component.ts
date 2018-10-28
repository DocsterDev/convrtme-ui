import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../../../service/video-search.service';
import {AudioPlayerService} from '../../../global/components/audio-player/audio-player.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {PlaylistService} from '../../../service/playlist.service';
import {UserService} from '../../../service/user.service';
import {NotificationService} from '../../../global/components/notification/notification.service';
import {ActivatedRoute} from '@angular/router';
import {EventBusService} from '../../../service/event-bus.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public videoList: any = [];
  public recommendedList: any = [];
  public playlists: any = [];
  public playlistLoading = false;
  public isPlaying: boolean;

  private searchResultsSubscription: Subscription;
  private recommendedResultsSubscription: Subscription;
  private signInEventSubscription: Subscription;
  private playlistActionSubscription: Subscription;
  private playlistUpdateSubscription: Subscription;
  private getPlaylistVideosSubscription: Subscription;
  private audioPlayingEventSubscription: Subscription;
  private eventBusSubscription: Subscription;
  private eventNowPlayingVideoSubscription: Subscription;

  public query: string;
  public previousQuery: string;
  public videoId: string;
  public upNextVideoId: string;
  public nowPlayingVideoId: string;

  public isMobile: boolean;
  public isSearchModeEnabled: boolean;
  public isNotificationCenterModeEnabled: boolean;

  public loaded: boolean;

  static updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  constructor(private videoRecommendedService: VideoRecommendedService,
              private audioPlayerService: AudioPlayerService,
              private playlistService: PlaylistService,
              private userService: UserService,
              private notificationService: NotificationService,
              private videoSearchService: VideoSearchService,
              private route: ActivatedRoute,
              private eventBusService: EventBusService) {
  }

  ngOnInit() {
      this.isMobile = this.eventBusService.isDeviceMobile();
      this.eventBusSubscription = this.eventBusService.deviceListenerEvent$.subscribe((isMobile) => this.isMobile = isMobile);
      this.eventBusSubscription = this.eventBusService.searchModeEvent$.subscribe((isSearchModeEnabled) => this.isSearchModeEnabled = isSearchModeEnabled);
      this.eventBusSubscription = this.eventBusService.notificationCenterEvent$.subscribe((isNotificationCenterModeEnabled) => this.isNotificationCenterModeEnabled = isNotificationCenterModeEnabled);
      this.searchResultsSubscription = this.videoSearchService.getResultList().subscribe((searchResults) => {
        setTimeout(()=>{
          this.loaded = true;
        }, 15);

        if (searchResults.length > 0 && this.nowPlayingList.length === 0) {
          this.videoRecommendedService.recommended(searchResults[0].id);
          this.recommendedList = [];
        }
        this.previousQuery = this.query;
        this.videoList = [];
        this.loadIncrementally(searchResults, this.videoList);
      });
      this.recommendedResultsSubscription = this.videoRecommendedService.getResultList().subscribe((recommendedResults) => {
        this.recommendedList = [];
        if (this.nowPlayingList.length > 0) {
          this.loadUpNextVideo(recommendedResults.nextUpVideo);
        }
        this.loadIncrementally(recommendedResults.recommendedVideos, this.recommendedList);
      });
      this.route.queryParams.subscribe(params => {
        this.query = params.q;
        const video = {id: params.v};
        this.audioPlayerService.triggerVideoEvent(video);
        this.videoSearchService.search(this.query ? this.query : 'cnn');
      });
      this.audioPlayingEventSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
        this.isPlaying = e.toggle;
        if (this.nowPlayingList.length === 0) {
          this.upNextList = [];
        }
      });
      this.eventNowPlayingVideoSubscription = this.audioPlayerService.triggerNowPlayingVideoEmitter$.subscribe((e) => {
        this.nowPlayingList = e;
      });
      // this.signInEventSubscription = this.userService.userSignedInEmitter$.subscribe((response) => {
      //   const user: any = response;
      //   if (user.valid) {
      //     this.playlistService.getPlaylists().subscribe((resp) => {
      //       this.playlists = resp;
      //     });
      //   }
      // });
      // this.playlistActionSubscription = this.audioPlayerService.triggerPlaylistActionEventEmitter$.subscribe((resp) => {
      //   const action: any = resp;
      //   if (action.action === 'next') {
      //     console.log('NEXT');
      //   }
      //   if (action.action === 'prev') {
      //     console.log('PREVIOUS');
      //   }
      // });
  }

  private loadUpNextVideo(video: any) {
    const upNextList = [];
    this.upNextList = [];
    upNextList.push(video);
    this.audioPlayerService.triggerNextUpVideoEvent(upNextList);
    this.loadIncrementally(upNextList, this.upNextList);
  }

  public handleVideoSelect(video: any) {
    this.audioPlayerService.triggerVideoEvent(video);
  }

  private loadIncrementally(data, list) {
    let totalTime = 0;
    data.forEach((e, index) => {
      const maxMillis = 200;
      const minMillis = 15;
      let delay = Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
      if (index === 0) {
        delay = 0;
      }
      totalTime = totalTime + delay;
      setTimeout(YoutubeComponent.updateComponent, totalTime, e, index, list);
    });
  }

  private applyDrag = (arr, dragResult) => {
    const {removedIndex, addedIndex, payload} = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
    const result = [...arr];
    let itemToAdd = payload;
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
    return result;
  }

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
    this.recommendedResultsSubscription.unsubscribe();
    this.signInEventSubscription.unsubscribe();
    this.playlistActionSubscription.unsubscribe();
    this.playlistUpdateSubscription.unsubscribe();
    this.getPlaylistVideosSubscription.unsubscribe();
    this.audioPlayingEventSubscription.unsubscribe();
    this.eventBusSubscription.unsubscribe();
    this.eventNowPlayingVideoSubscription.unsubscribe();
  }

}


/*


  public handlePlaylistVideoSort(dropResult) {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos = this.applyDrag(this.currentPlaylist.videos, dropResult);
    this.audioPlayerService.triggerPlaylistUpdateEvent({playlist: this.currentPlaylist.videos});
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {

    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});

    });
  }

  public handleAddToCurrentPlaylist($video) {
    if (!this.currentPlaylist.videos) {
      return;
    }
    if (this.currentPlaylist.videos.length > 0) {
      for (const video of this.currentPlaylist.videos) {
        if (video.id === $video.id) {
          this.notificationService.showNotification({type: 'warn', message: 'Sorry, can\'t add the same video more than once: ' + $video.title});
          return;
        }
      }
    }
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos.push($video);
    this.audioPlayerService.triggerPlaylistUpdateEvent({playlist: this.currentPlaylist.videos});
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {
      this.notificationService.showNotification({type: 'success', message: 'Added to playlist'});
    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});
    });
  }

  public handleRemoveFromPlaylist($event) {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos = this.currentPlaylist.videos.filter(video => video.id !== $event.video.id);
    this.audioPlayerService.triggerPlaylistUpdateEvent({playlist: this.currentPlaylist.videos});
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {

    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});
    });
  }

  public clearPlaylist() {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos = [];
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {

    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});
    });
  }

  public setPlaylistActive(playlist) {
    this.playlistLoading = true;
    this.getPlaylistVideosSubscription = this.playlistService.getPlaylistVideos(playlist.uuid).subscribe((videos) => {
      this.currentPlaylist.videos = [];
      this.currentPlaylist.videos = videos;
      this.audioPlayerService.triggerPlaylistUpdateEvent({playlist: videos});
    }, (error) => {
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, couldn\'t retrieve playlist videos. Try again.'});

    }, () => {
      this.playlistLoading = false;
    });
    this.currentPlaylist = JSON.parse(JSON.stringify(playlist));
  }


 */
