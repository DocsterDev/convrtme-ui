import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../../../service/video-search.service';
import {AudioPlayerService} from '../../../global/components/audio-player/audio-player.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {PlaylistService} from '../../../service/playlist.service';
import {UserService} from '../../../service/user.service';
import {NotificationService} from '../../../global/components/notification/notification.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public videoList: any = [];
  public recommendedList: any = [];
  public playlists: any = [];
  public currentPlaylist: any = {id: ''};
  public playlistLoading = false;

  private searchResultsSubscription: Subscription;
  private recommendedResultsSubscription: Subscription;
  private signInEventSubscription: Subscription;
  private playlistActionSubscription: Subscription;
  private playlistUpdateSubscription: Subscription;
  private getPlaylistVideosSubscription: Subscription;

  static updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  constructor(private videoRecommendedService: VideoRecommendedService,
              private audioPlayerService: AudioPlayerService,
              private playlistService: PlaylistService,
              private userService: UserService,
              private notificationService: NotificationService,
              private videoSearchService: VideoSearchService) {
  }

  ngOnInit() {
    this.searchResultsSubscription = this.videoSearchService.getResultList().subscribe((searchResults) => {
      if (searchResults != null) {
        this.videoRecommendedService.recommended(searchResults[0].id);
      }
      this.videoList = [];
      this.loadIncrementally(searchResults, this.videoList);
    });
    this.recommendedResultsSubscription = this.videoRecommendedService.getResultList().subscribe((recommendedResults) => {
      this.recommendedList = [];
      this.loadIncrementally(recommendedResults, this.recommendedList);
    });
    this.signInEventSubscription = this.userService.userSignedInEmitter$.subscribe((response) => {
      const user: any = response;
      if (user.valid) {
        this.playlistService.getPlaylists().subscribe((response) => {
          this.playlists = response;
        });
        this.videoSearchService.search('sandman mgtow');
      }
    });
    this.playlistActionSubscription = this.audioPlayerService.triggerPlaylistActionEventEmitter$.subscribe((resp) => {
      const action: any = resp;
      if (action.action === 'next') {
        console.log('NEXT');
      }
      if (action.action === 'prev') {
        console.log('PREVIOUS');
      }
      console.log('Is Playlist: ' + action.isPlaylist);

    });
  }

  public handleVideoSelect($video) {
    $video.isRecommended = false;
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.id, toggle: true});
  }

  public handleRecommendedVideoSelect($video) {
    $video.isRecommended = true;
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.id, toggle: true});
  }

  public handlePlaylistVideoSort(dropResult) {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos = this.applyDrag(this.currentPlaylist.videos, dropResult);
    this.audioPlayerService.triggerPlaylistUpdateEvent({playlist: this.currentPlaylist.videos});
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {

    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});
      console.log(JSON.stringify(error));
    });
  }

  public handleAddToCurrentPlaylist($video) {
    if (!this.currentPlaylist.videos) {
      console.log('No playlist is set to add to');
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
      console.log(JSON.stringify(error));
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
      console.log(JSON.stringify(error));
    });
  }

  public clearPlaylist() {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos = [];
    this.playlistUpdateSubscription = this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe(() => {

    }, (error) => {
      this.currentPlaylist = originalPlaylist;
      this.notificationService.showNotification({type: 'error', message: 'Uh oh, something went wrong. Try again.'});
      console.log(JSON.stringify(error));
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
      console.log(JSON.stringify(error));
    }, () => {
      this.playlistLoading = false;
    });
    this.currentPlaylist = JSON.parse(JSON.stringify(playlist));
  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1100));
      const maxMillis = 500;
      const minMillis = 100;
      // const delay = Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
      setTimeout(YoutubeComponent.updateComponent, delay, e, index, list);
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
  };

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
    this.recommendedResultsSubscription.unsubscribe();
    this.signInEventSubscription.unsubscribe();
    this.playlistActionSubscription.unsubscribe();
    this.playlistUpdateSubscription.unsubscribe();
    this.getPlaylistVideosSubscription.unsubscribe();
  }

}
