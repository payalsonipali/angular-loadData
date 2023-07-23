import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})

export class LoadDataComponent implements OnInit{

	constructor(private http: HttpClient) {}
  
  ngOnInit(): void {

    this.http
			.get<any>('https://api.github.com/search/users?q=Q')
			.subscribe(data => {
				console.log(data);
			}
      );
  }


}
