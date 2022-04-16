import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, take, exhaustMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
  providedIn:'root'
})
export class DataStorageService {
  private baseUrl = 'https://recipe-app-654b7-default-rtdb.firebaseio.com';
  constructor(private http:HttpClient,private reicpeService:RecipeService, private authService:AuthService){
  }

  storeRecipes(){
    const recipes = this.reicpeService.getRecipes();
    this.http.put(`${this.baseUrl}/recipes.json`, recipes).subscribe((response)=>{
      console.log(response);
    })
  }

  fetchRecipes(){
    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap(user =>{
       return this.http.get<Recipe[]>(`${this.baseUrl}/recipes.json`)
      }),
      map(recipes=>{
        return recipes.map(recipe=> {
         return {...recipe, ingridients: recipe.ingridients ? recipe.ingridients : []}
        })
      }),
      tap(recipes=> {
        this.reicpeService.serRecipes(recipes)
      }) )


  }

}
