import { Component, OnInit, AfterViewInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild } from '@angular/core';

import { delay } from 'rxjs/internal/operators';

import { FeedService } from './services/feed.service';
import { FeedEntry } from './api/feed-entry';
import { environment } from '../environments/environment';
import { FeedData } from './api/feed';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ck-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
              '../assets/addtohomescreen.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, AfterViewInit {
  prnewswireFeedLocation = environment.prnewswireFeedLocation + '?v=' + Math.random();  // prevent browser caching
  globenewswireFeedLocation = environment.globenewswireFeedLocation + '?v=' + Math.random();  // prevent browser caching
  businesswireFeedLocation = environment.businesswireFeedLocation + '?v=' + Math.random();  // prevent browser caching

  title: string;
  prnewswireFeeds: Array<FeedData> = [];
  globenewswireFeeds: Array<FeedData> = [];
  businesswireFeeds: Array<FeedData> = [];
  
  @ViewChild('lghost') lghost: ElementRef;

  constructor(
    private feedService: FeedService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.refreshFeed();
  }

  ngAfterViewInit() {
      // const addtohomescript = document.createElement('script');
      // addtohomescript.type = 'text/javascript';
      // addtohomescript.innerHTML = 'addToHomescreen();';
      // this.elementRef.nativeElement.appendChild(addtohomescript);

      // const lgscript = document.createElement('script');
      // lgscript.type = 'module';
      // lgscript.src = 'https://djjb.foehst.net/lehrgangsanmeldung.js';
      // this.elementRef.nativeElement.appendChild(lgscript);

      // let lglist = document.createElement('x-lehrgangsanmeldung');
      // lglist.style.cssText='font-size: .8em; overflow-y: auto;'
      // this.lghost.nativeElement.appendChild(lglist)
  }

  refreshFeed() {
    this.prnewswireFeeds.length = 0;
    this.globenewswireFeeds.length = 0;
    this.businesswireFeeds.length = 0;

    this.feedService.getFeedContent(this.prnewswireFeedLocation, 1).pipe(delay(500))
        .subscribe(
          prnewswireFeedData => {
              this.prnewswireFeeds = prnewswireFeedData;
            } ,
            error => console.log(error));
    this.feedService.getFeedContent(this.globenewswireFeedLocation, 2).pipe(delay(500))
    .subscribe(
      globenewswireFeedData => {
          this.globenewswireFeeds = globenewswireFeedData;
        } ,
        error => console.log(error));

    this.feedService.getFeedContent(this.businesswireFeedLocation, 3).pipe(delay(500))
    .subscribe(
      businesswireFeedData => {
          this.businesswireFeeds = businesswireFeedData;
        } ,
        error => console.log(error));
  }

  openLinkInBrowser(feed: { link: string; }) {
    window.open(feed.link);
  }
}
