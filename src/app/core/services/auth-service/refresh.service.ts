import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })

export class RefreshService {

    private refresher = new BehaviorSubject<string>("")

    constructor() { this.emittNew = 'home' }

    set emittNew(url: string) {
        this.refresher.next(url);
    }

}
