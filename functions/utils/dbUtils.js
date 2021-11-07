const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@acex-iot.h1p28.mongodb.net/acex-iot?retryWrites=true&w=majority`;
const db_name = "acex-iot";

const client = new MongoClient(uri);

module.exports = {
  findDoc: async function (coll, query) {
      try {
          await client.connect();
          const db = client.db(db_name);
          const dbres = await db.collection(coll).find(query).toArray();
          return dbres;
      } catch(err) {
          console.log(err)
      } finally {
          await client.close();
      };
  },
  addDoc: async function (coll, obj) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const dbres = await db.collection(coll).insertOne(obj);
        console.log("Document inserted");
        return dbres;
    } catch(err) {
        console.log(err)
    } finally {
        await client.close();
    };
  },
  addManyDocs: async function (coll, obj) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const dbres = await db.collection(coll).insertMany(obj);
        console.log("Documents inserted");
        return dbres;
    } catch(err) {
        console.log(err)
    } finally {
        await client.close();
    };
  },
  updateDoc: async function (coll, query, obj) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const setObj = { $set: obj };
        const dbres = await db.collection(coll).updateOne(query, setObj);
        console.log("Document updated");
        return dbres;
    } catch(err) {
        console.log(err)
    } finally {
        await client.close();
    };
  },
  deleteDoc: async function (coll, query) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const dbres = await db.collection(coll).deleteMany(query);
        console.log("Document(s) deleted");
        return dbres;
    } catch(err) {
        console.log(err)
    } finally {
        await client.close();
    };
   }
};
