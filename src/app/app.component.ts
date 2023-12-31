import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AppServiceService } from './app-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'loadingData';
  public nameControl = new UntypedFormControl();
  public unsubscriber$: Subject<void> = new Subject();
  public subscription:Subscription | undefined;
  public userInfo: { login: String, img: String }[] = [];
  public isLoading: Boolean = false;
  page = 1;
  public search: String = '';

  constructor(private getUserInfo: AppServiceService) { }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(
      res => {
        this.search = res;
        console.log('THIS VALUE -> ', res);
        if (res != null && res != "") {
          this.isLoading = true; // Show the loader
          if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
          }
          this.subscription = this.getUserInfo.getUserInfo(res, 1)
            .pipe(debounceTime(500)) // Debounce the API call for 500 milliseconds
            .subscribe(data => {
              console.log("get data");
              
              this.userInfo = data["items"].map((obj: any) => ({ login: obj["login"], img: obj["avatar_url"] }));
              this.isLoading = false; // Show the loader
            },
            error => {
              console.error('Error fetching data:', error);
            }
            );
        } else{
          this.userInfo = [];
        }
      }
    );
  }

  onScroll(): void {
    this.getUserInfo.getUserInfo(this.search, ++this.page)
      .subscribe(data => {
        console.log("get data", data);
        console.log("lohin : "+data["items"].map((obj: any) => ({ login: obj["login"], img: obj["avatar_url"] })));
        this.userInfo.push(...data["items"].map((obj: any) => ({ login: obj["login"], img: obj["avatar_url"] })));
        this.isLoading = false; // Show the loader
      },
      error => {
        console.error('Error fetching data:', error);
      }
      );
  }
}
