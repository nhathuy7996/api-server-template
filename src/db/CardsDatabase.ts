import { Low, LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

// Định nghĩa kiểu dữ liệu
export type Card = {
    id: number;
    location: string;
    activity: string;
    time: string;
    cost: number;
    note: string;
};
 

type DataSchema = {
    Cards: Card[];
};

export class CardsDatabase {
    private db: LowSync<DataSchema>;

    constructor() {

        const adapter = new JSONFileSync<DataSchema>('Cards.json');
        this.db = new LowSync<DataSchema>(adapter, { Cards: [] }) 
        
        this.db.read();
        this.db.data ||= { Cards: [] };  
        this.db.write();
    }

    // Getter để truy cập database
    public getDB(): LowSync<DataSchema> {
        return this.db;
    }

    public getCard(idCard: number): Card|null{
        const card = this.db.data?.Cards.find(c => c.id === idCard);
        if (card) {
          return card;
        }
  
        return null;
      }

    public addCard(card: Card): boolean {
      this.db.data?.Cards.push(card);
      this.db.write();
      return true;
    }

    public removeCard(idCard: number): void {
      const card = this.db.data?.Cards.find(c => c.id === idCard);
      if (card) {
        this.db.data?.Cards.splice(idCard,1);
        this.db.write();
      }
    }
}