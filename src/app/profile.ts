import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Profile {

    public displayName: string;
    public href: string;

    constructor() { }
}
