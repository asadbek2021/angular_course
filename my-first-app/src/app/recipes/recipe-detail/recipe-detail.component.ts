import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingService } from 'src/app/shopping-list/shopping.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  constructor(
    private shoppingService:ShoppingService,
    private route:ActivatedRoute,
    private recipeService:RecipeService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
     this.recipe = this.recipeService.getRecipe(+params['id'])
     if(!this.recipe){
       this.router.navigate(['../'],{relativeTo: this.route})
     }
    })
  }

  addToShopping(){
    this.shoppingService.addIngridients(this.recipe.ingridients);
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.recipe.id)
    console.log(this.recipe.id);
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo:this.route, queryParamsHandling: 'preserve'})
  }

}
