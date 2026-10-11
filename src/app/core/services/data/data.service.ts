import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take, timeout } from "rxjs";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;
const DEFAULT_TIMEOUT_MS = 3000;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getData(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    return this.http.get(baseUrl + url).pipe(
      timeout(timeoutMs),
      take(1)
    );
  }

  postData<T>(url: string, body: any, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    return this.http.post<T>(baseUrl + url, body).pipe(
      timeout(timeoutMs),
      take(1)
    );
  }

  deleteData(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    return this.http.delete(baseUrl + url).pipe(
      timeout(timeoutMs),
      take(1)
    );
  }

  updateData(url: string, body: any, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
    return this.http.patch(baseUrl + url, body).pipe(
      timeout(timeoutMs),
      take(1)
    );
  }
}
