import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError,tap } from "rxjs/operators";
import { IPost } from "./post.model";

@Injectable({
  providedIn: "root"
})
export class PostService {
  fetchNeeded = new Subject<void>();
  error = new Subject<HttpErrorResponse>();
  baseUrl:string='https://angular-2037c-default-rtdb.asia-southeast1.firebasedatabase.app';
  constructor(private http:HttpClient) {}

  createPost(title:string,content:string){
    let postData = {title,content};
    this.http.post<Omit<IPost,'id'>>(
      `${this.baseUrl}/posts.json`,
      postData,
      {headers:{'Content-Type':'application/json'}, observe: 'response'}
      )
      .subscribe(responseData => {
        console.log(responseData);
      this.fetchNeeded.next();
    }, error => this.error.next(error) )
  }

  fetchPosts(){
    let searchParams =new HttpParams();
    searchParams = searchParams.append('print','pretty')
    searchParams = searchParams.append('custom','key')
   return this.http.get<{[key:string] : IPost}>(`${this.baseUrl}/posts.json`,{
     headers: new HttpHeaders({"Custom-Header":'Asadbek'}),
     params: searchParams,
   })
    .pipe(map((responseData) => {
        const posts:IPost[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            posts.push({...responseData[key],id:key});
          }
        }
        return posts
    }),catchError((err)=>{
      err.message = 'Cannot Fetch data From Database!'
     return throwError(err)
    })
    )

  }

  clearPosts(){
   return this.http.delete(`${this.baseUrl}/posts.json`)
  }

  onDelete(id:string){

  return this.http.delete(`${this.baseUrl}/posts/${id}.json`, {observe: 'events'}).pipe(tap(event=>{
    if(event.type === HttpEventType.Response){
      console.log(event.body);
    }
  }))
  }
}
