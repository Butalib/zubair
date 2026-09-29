import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl

@Injectable({ providedIn: 'root' })

export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getData(url: string) {
    return this.http.get(baseUrl + url).pipe(take(1))
  }

  postData<T>(url: string, body: any) {
    return this.http.post<T>(baseUrl + url, body).pipe(take(1))
  }

  deleteData(url: string) {
    return this.http.delete(baseUrl + url).pipe(take(1))
  }


  updateData(url: string, body: any) {
    return this.http.patch(baseUrl + url, body).pipe(take(1))
  }



}
