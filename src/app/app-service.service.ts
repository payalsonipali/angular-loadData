import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient) { }

  getUserInfo(search:String, page:number):Observable<any>{
    return this.http.get(
      `https://api.github.com/search/users?q=${search}&page=${page}&per_page=10`
    )
  }
}
