import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingridient } from '../shared/ingridient.model';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  reicpesUpdated = new Subject<Recipe[]>();
  private recipes:Recipe[] = [
    // new Recipe(
    //    1,
    //   'Italian Maccoroni',
    //   'This is simply a test',
    //   'https://i.pinimg.com/originals/b3/23/08/b3230875aedd5cdadcee0e3dfa433a33.jpg',
    //   [
    //     new Ingridient('Macaroni', 2),
    //     new Ingridient('Meat', 2),
    //   ]
    // ),
    // new Recipe(
    //    2,
    //   'New Swedish Meatballs',
    //   'This is simply a test',
    //   'https://i.pinimg.com/originals/09/6f/00/096f00a0739815e14a1be086e811b0c9.jpg',
    //   [
    //     new Ingridient('Pasta', 2),
    //     new Ingridient('Bread', 2),
    //   ]
    // )
  ];

  constructor() { }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(id:number){
    const recipe = this.recipes.find(c=> c.id === id);
    return recipe;
  }

  addRecipe(recipe:Omit<Recipe,'id'>){
    let newRecipe = {...recipe,id:this.recipes.length+1}
    this.recipes.push(newRecipe)
    this.reicpesUpdated.next(this.recipes.slice())
  }

  deleteRecipe(id:number){
    this.recipes = this.recipes.filter(c=> c.id !== +id)
    this.reicpesUpdated.next(this.recipes.slice())
  }

  updateRecipe(id:number, newRecipe:Omit<Recipe,'id'>){
    let index = this.recipes.findIndex(c=> c.id == id)
    let recipe = new Recipe(
      id,
      newRecipe.name,
      newRecipe.description,
      newRecipe.imagePath,
      newRecipe.ingridients
    );
    this.recipes[index] = recipe;
    this.reicpesUpdated.next(this.recipes.slice())
  }

  serRecipes(recipes:Recipe[]){
    this.recipes = recipes
    this.reicpesUpdated.next(this.recipes.slice())
  }

}
