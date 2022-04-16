import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub:Subscription;
  isLoggedIn = false;
  constructor(private dataStorageService:DataStorageService, private authService: AuthService){
  }

  ngOnInit(): void {
   this.userSub = this.authService.userSubject.subscribe((user)=>{
        this.isLoggedIn = !!user;
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }

  onSaveData(){
    this.dataStorageService.storeRecipes()
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe()
  }

  onLogout(){
    this.authService.logout();
  }

}
