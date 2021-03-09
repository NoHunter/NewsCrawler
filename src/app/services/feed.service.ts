
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as xml2js from 'xml2js';

import { Feed, Rss, FeedInfo, FeedData } from '../api/feed';

@Injectable()
export class FeedService {

  constructor(private http: HttpClient) { }

  getFeedContent(url: string): Observable<Array<FeedData>> {
    return this.http.get(url, {responseType: 'text'}).pipe(
      map(this.extractFeedsResponse));
  }

/**
 * Converts the feed response to json
 *
 * @private
 * @param {any} response
 * @returns {Feed}
 * @memberof FeedService
 */
private extractFeeds(response: any): Feed {
    const parser = new xml2js.Parser({explicitArray : false, mergeAttrs : true});
    let feed: any;
    parser.parseString(response, function(err: any, result: any) {
      if (err) {
        console.warn(err);
      }
      feed = result;
    });

    return feed || { };
  }

  private extractFeedsResponse(response: any): Array<FeedData> {
    const domParser = new DOMParser();
    let feeds: Array<FeedData> = [];
    let result : any;
    result = domParser.parseFromString(response, "text/html");
    let imgDiv = result.getElementsByClassName("img-ratio-element");
    let contentDiv = result.getElementsByClassName("col-sm-8 col-lg-9 pull-left card");
    let linkDiv = result.getElementsByClassName("newsreleaseconsolidatelink display-outline");
    let desDiv = result.getElementsByClassName("remove-outline");
    for(let i = 0; i < contentDiv.length;i++)
    {
      let feedData = new FeedData();
      feedData.title = contentDiv[i].innerText;
      feedData.description = desDiv[i].innerText;
      feedData.image = imgDiv[i].childNodes[1].src;
      feedData.link = linkDiv[i].href;
      feeds.push(feedData);
    }

    return feeds || [];
  }

}
