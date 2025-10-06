"use strict";
"var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {"
"    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }"
"    return new (P || (P = Promise))(function (resolve, reject) {"
"        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }"
"        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }"
"        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }"
"        step((generator = generator.apply(thisArg, _arguments || [])).next());"
"    });"
"};"
"Object.defineProperty(exports, \"__esModule\", { value: true });"
"const pg_1 = require(\"pg\");"
"const pool = new pg_1.Pool({"
"    user: 'postgres',"
"    database: 'gms_db',"
"    password: 'Batates123',"
"    host: 'localhost',"
"    port: 5432"
"});"
"function checkTable() {"
"    return __awaiter(this, void 0, void 0, function* () {"
"        try {"
"            const client = yield pool.connect();"
"            const result = yield client.query(`"
"      SELECT "
"        column_name, "
"        data_type, "
"        character_maximum_length, "
"        column_default, "
"        is_nullable"
"      FROM information_schema.columns "
"      WHERE table_name = 'members'"
"      ORDER BY ordinal_position;"
"    `);"
"            console.log('Table structure:');"
"            console.log(JSON.stringify(result.rows, null, 2));"
"            client.release();"
"        }"
"        catch (err) {"
"            console.error('Error:', err);"
"        }"
"        finally {"
"            yield pool.end();"
"        }"
"    });"
"}"
"checkTable();"
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    database: 'gms_db',
    password: 'Batates123',
    host: 'localhost',
    port: 5432
});
function checkTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield pool.connect();
            const result = yield client.query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length, 
        column_default, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'members'
      ORDER BY ordinal_position;
    `);
            console.log('Table structure:');
            console.log(JSON.stringify(result.rows, null, 2));
            client.release();
        }
        catch (err) {
            console.error('Error:', err);
        }
        finally {
            yield pool.end();
        }
    });
}
checkTable();
