import { Low, LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { Planner, PlannersDatabse } from './PlannersDatabase.js';
import { Card, CardsDatabase } from './CardsDatabase.js';


export type User = {
    id: number;
    username: string;
    planners: number[];
};

type DataSchema = {
    users: User[];
};

export class UsersDatabase {
    private db: LowSync<DataSchema>;
    private PlannerDB = new PlannersDatabse();
    private CardDB = new CardsDatabase();

    constructor() {

        const adapter = new JSONFileSync<DataSchema>('Users.json');
        this.db = new LowSync<DataSchema>(adapter, { users: [] })

        // Đọc và thiết lập dữ liệu mặc định
        this.db.read();
        this.db.data ||= { users: [] }; // Nếu không có dữ liệu, tạo mảng rỗng
        this.db.write();
    }

    // Getter để truy cập database
    public getDB(): LowSync<DataSchema> {
        return this.db;
    }
    // Thêm người dùng
  public addUser(user: User): void {
    this.db.data?.users.push(user);
    this.db.write();
  }

  // Thêm planner cho user
  public addPlanner(userId: number, planner: number): void {
    const user = this.db.data?.users.find(u => u.id === userId);
    if (user) {
      user.planners.push(planner);
      this.db.write();
    }
  } 
  // Lấy tất cả người dùng
  public getUsers(): User[] {
    return this.db.data?.users ?? [];
  }

  // Lấy planner của user
  public getPlanners(userId: number): Planner[] {
    const user = this.db.data?.users.find(u => u.id === userId);
    let planners = [];
    if(user){
      for(let id of user.planners){
        let planner = this.PlannerDB.getPlanner(id);
        if(!planner)
            continue;
          planners.push(planner);
      }

      return planners;
    }
    return [];
  }

  public getCards(plannerID:number): Card[]{
    const planner = this.PlannerDB.getPlanner(plannerID);
    if(!planner)
      return [];
    
    let Cards = [];
    for(let id of planner.cards){
      let card = this.CardDB.getCard(id);
      if(!card)
          continue;
      Cards.push(card);
    }

    return Cards;
  }

 
}