const express = require('express');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "anusuyacomputers.db");
app.use(express.json());

let db = null;

const initializaDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        });
    } catch (e) {
        console.log(`DB Error:  ${e.message}`);
        process.exit(1);
    }
};

// Get Categories API

app.get("/categories/", async (request, response) => {
    const getCategoriesQuery = `SELECT * FROM Category ORDER BY id;`;
    const categoriesArray = await db.all(getCategoriesQuery);
    response.send(categoriesArray);
});

// Add Category API

app.post("/categories/", async (request, response) => {
    const categoryDetails = request.body;
    const { id, name, quantity, image, description } = categoryDetails;
    const addCategoryQuery = `INSERT INTO Category(id, name, quantity, image, description)
        VALUES(${id},'${name}', ${quantity}, '${image}', '${description}');
    `;
    const dbResponse = await db.run(addCategoryQuery);
    response.send({ categoryId: id });
});

//Update Category API

app.put("/categories/:categoryId", async (request, response) => {
    const { categoryId } = request.params;
    const categoryDetails = request.body;
    const { id, name, quantity, image, description } = categoryDetails;
    const updateCategoryQuery = `UPDATE Category
    SET 
    id=${id},
    name='${name}',
    quantity= ${quantity},
    image='${image}',
    description='${description}'
    WHERE id=${categoryId};
    `;
    await db.run(updateCategoryQuery);
    response.send(`Category ${categoryId} updated Successfully`);
});

// Delete Category API

app.delete("/categories/:categoryId", async (request, response) => {
    const { categoryId } = request.params;
    const deleteCategoryQuery = `DELETE FROM Category WHERE id= ${categoryId};`;
    await db.run(deleteCategoryQuery);
    response.send(`Category ${categoryId} Deleted Successfully`);

});


initializaDBAndServer();