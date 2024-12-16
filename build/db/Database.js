import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
export class Database {
    constructor() {
        var _a;
        const adapter = new JSONFileSync('db.json');
        this.db = new LowSync(adapter, { users: [] });
        // Đọc và thiết lập dữ liệu mặc định
        this.db.read();
        (_a = this.db).data || (_a.data = { users: [] }); // Nếu không có dữ liệu, tạo mảng rỗng
        this.db.write();
    }
    // Getter để truy cập database
    getDB() {
        return this.db;
    }
    // Thêm người dùng
    addUser(user) {
        var _a;
        (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users.push(user);
        this.db.write();
    }
    // Thêm planner cho user
    addPlanner(userId, planner) {
        var _a;
        const user = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users.find(u => u.id === userId);
        if (user) {
            user.planners.push(planner);
            this.db.write();
        }
    }
    // Thêm thẻ vào planner của user
    addCard(userId, plannerId, card) {
        var _a;
        const user = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users.find(u => u.id === userId);
        if (user) {
            const planner = user.planners.find(p => p.id === plannerId);
            if (planner) {
                planner.cards.push(card);
                this.db.write();
            }
        }
    }
    // Lấy tất cả người dùng
    getUsers() {
        var _a, _b;
        return (_b = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users) !== null && _b !== void 0 ? _b : [];
    }
    // Lấy planner của user
    getPlanners(userId) {
        var _a;
        const user = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users.find(u => u.id === userId);
        return user ? user.planners : [];
    }
    // Lấy các thẻ của một planner
    getCards(userId, plannerId) {
        var _a;
        const user = (_a = this.db.data) === null || _a === void 0 ? void 0 : _a.users.find(u => u.id === userId);
        if (user) {
            const planner = user.planners.find(p => p.id === plannerId);
            return planner ? planner.cards : [];
        }
        return [];
    }
}
//# sourceMappingURL=Database.js.map