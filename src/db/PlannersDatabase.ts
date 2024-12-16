import { Low, LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

export type Planner = {
    id: number;
    name: string;
    timeStart:string;
    totalCost:string;
    cards: number[];
};


type DataSchema = {
    Planners: Planner[];
};

export class PlannersDatabse {
    private db: LowSync<DataSchema>;

    constructor() {

        const adapter = new JSONFileSync<DataSchema>('Planners.json');
        this.db = new LowSync<DataSchema>(adapter, { Planners: [] }) 
        
        this.db.read();
        this.db.data ||= { Planners: [] };  
        this.db.write();
    }

    // Getter để truy cập database
    public getDB(): LowSync<DataSchema> {
        return this.db;
    }

    public getPlanner(idPlanner: number): Planner|null{
      const planner = this.db.data?.Planners.find(p => p.id === idPlanner);
      if (planner) {
        return planner;
      }

      return null;
    }

    public addPlanner(planner: Planner): boolean {
      this.db.data?.Planners.push(planner);
      this.db.write();
      return true;
    }


    public removePlanner(idPlanner: number): void {
      const planner = this.db.data?.Planners.find(p => p.id === idPlanner);
      if (planner) {
        this.db.data?.Planners.splice(idPlanner,1);
        this.db.write();
      }
    }
}