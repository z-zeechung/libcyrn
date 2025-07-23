

console.warn(`[WARNING] Using dummy module internal/bootstrap/realm at lib/internal/bootstrap/realm.js`)

return {
    BuiltinModule: class {
        static exists(id) {
            return true;
        }
    }
}