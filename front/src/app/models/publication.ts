export class Publication{

  constructor(
    public _id: string,
    public user: string,
    public text: string,
    public created_at: string,
    public file: string
  ){  }
  
}
