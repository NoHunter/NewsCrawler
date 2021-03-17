
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as xml2js from 'xml2js';

import { Feed, Rss, FeedInfo, FeedData } from '../api/feed';

@Injectable()
export class FeedService {

  constructor(private http: HttpClient) { }

  getFeedContent(url: string, mode: Number): Observable<Array<FeedData>> {
    return this.http.get(url, {responseType: 'text'}).pipe(
      map((data : any) => {
        switch(mode)
        {
          case 1:
            return this.extractPrnewswireFeedsResponse(data, mode)
          case 2:
            return this.extractGlobenewswireFeedsResponse(data, mode)
          case 3:
            return this.extractBusinesswireFeedsResponse(data, mode)
          default:
            return [];
        }
      }));
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

  private extractPrnewswireFeedsResponse(response: any, mode: Number): Array<FeedData> {
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
      feedData.title = contentDiv[i]?.innerText;
      feedData.description = desDiv[i]?.innerText;
      feedData.image = imgDiv[i]?.childNodes[1]?.src;
      feedData.link = linkDiv[i]?.href;
      feeds.push(feedData);
    }

    return feeds || [];
  }

  private extractGlobenewswireFeedsResponse(response: any, mode: Number): Array<FeedData> {
    const domParser = new DOMParser();
    let feeds: Array<FeedData> = [];
    let result : any;
    result = domParser.parseFromString(response, "text/html");
    let targetDiv = result.getElementsByClassName("results-link");
    //let imgDiv = result.getElementsByClassName("image_spacer");
    //let contentDiv = result.getElementsByClassName("post-title16px");
    //let linkDiv = result.getElementsByClassName("newsreleaseconsolidatelink display-outline");
    //let desDiv = result.getElementsByClassName("remove-outline");
    for(let i = 0; i < targetDiv.length;i++)
    {
      let feedData = new FeedData();
      feedData.companyTitle = targetDiv[i]?.childNodes[3]?.innerText;
      feedData.title = targetDiv[i]?.childNodes[5]?.innerText;
      feedData.description = targetDiv[i]?.childNodes[7]?.innerText;
      feedData.image = targetDiv[i]?.childNodes[1]?.childNodes[1]?.firstElementChild?.src;
      feedData.link = targetDiv[i]?.childNodes[5]?.childNodes[0]?.href;
      feeds.push(feedData);
    }

    return feeds || [];
  }

  private extractBusinesswireFeedsResponse(response: any, mode: Number): Array<FeedData> {
    const domParser = new DOMParser();
    let feeds: Array<FeedData> = [];
    let result : any;
    //response = response.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
    result = domParser.parseFromString(response, "text/html");
    let bwThumbs = result.getElementsByClassName("bwThumbs");
    let bwTitleLink = result.getElementsByClassName("bwTitleLink");
    let bwTimestamp = result.getElementsByClassName("bwTimestamp");
    for(let i = 0; i < bwThumbs.length;i++)
    {
      let feedData = new FeedData();
      feedData.companyTitle = bwTimestamp[i]?.innerText;
      feedData.title = bwTitleLink[i]?.innerText;
      feedData.description = bwTitleLink[i]?.innerText;
      feedData.image = bwThumbs[i]?.childNodes[1]?.childNodes[0]?.src;
      feedData.link = bwTitleLink[i]?.href;
      feeds.push(feedData);
    }

    return feeds || [];
  }
}
