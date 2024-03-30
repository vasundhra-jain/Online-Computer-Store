const express = require('express');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
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

//Authenticate Token Middleware

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "MY_SECRET", async (error, payload) => {
            if (error) {
                response.status(401);
                response.send("Invalid JWT Token");
            } else {
                request.username = payload.username;
                next();
            }
        });
    }
}

//Register User API

app.post("/register/", async (request, response) => {
    const userDetails = request.body;
    const { username, name, email_id, password, gender, contact_number, address, city, country, age } = userDetails;
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = `SELECT * FROM User WHERE username='${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        if (password.length < 6) {
            response.status(400);
            response.send("Password is too short");
        } else {
            const createUserQuery = `
            INSERT INTO 
            User(username, name, email_id, password, gender, contact_number, address, city, country, age)
            VALUES('${username}', '${name}', '${email_id}', '${hashedPassword}', '${gender}', ${contact_number}, '${address}', '${city}', '${country}', ${age})
            ;`;
            const dbResponse = await db.run(createUserQuery);
            response.send("User created successfully");
        }
    } else {
        response.status(400);
        response.send("User already exists");
    }
});

//Login User API

app.post("/login/", async (request, response) => {
    const { username, password } = request.body;
    const selectUserQuery = `SELECT * FROM User WHERE username='${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        response.status(400);
        response.send("Invalid Username");
    } else {
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if (isPasswordMatched) {
            const payload = { username: username };
            const jwtToken = jwt.sign(payload, "MY_SECRET");
            response.send({ jwtToken });
        } else {
            response.status(400);
            response.send("Invalid password");
        }
    }

});

//Get User Profile API

app.get("/profile/", authenticateToken, async (request, response) => {
    let { username } = request;
    const selectUserQuery = `SELECT * FROM User WHERE username='${username}' `;
    const userDetails = await db.get(selectUserQuery);
    response.send(userDetails);
});

// Get Categories API

app.get("/categories/", authenticateToken, async (request, response) => {
    const getCategoriesQuery = `SELECT * FROM Category ORDER BY id;`;
    const categoriesArray = await db.all(getCategoriesQuery);
    response.send(categoriesArray);
});

// Add Category API

app.post("/categories/", authenticateToken, async (request, response) => {
    const categoryDetails = request.body;
    const { id, name, quantity, image, description } = categoryDetails;
    const addCategoryQuery = `INSERT INTO Category(id, name, quantity, image, description)
        VALUES(${id},'${name}', ${quantity}, '${image}', '${description}');
    `;
    await db.run(addCategoryQuery);
    response.send({ categoryId: id });
});

//Update Category API

app.put("/categories/:categoryId", authenticateToken, async (request, response) => {
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
    response.send(`Category ${categoryId} updated successfully`);
});

// Delete Category API

app.delete("/categories/:categoryId", authenticateToken, async (request, response) => {
    const { categoryId } = request.params;
    const deleteCategoryQuery = `DELETE FROM Category WHERE id= ${categoryId};`;
    await db.run(deleteCategoryQuery);
    response.send(`Category ${categoryId} deleted successfully`);

});

// Get Products API

app.get("/products/", authenticateToken, async (request, response) => {
    const getProductsQuery = `SELECT * FROM Product ORDER BY id;`;
    const productsArray = await db.all(getProductsQuery);
    response.send(productsArray);
});

// Add Product API

app.post("/products/", authenticateToken, async (request, response) => {
    const productDetails = request.body;
    const { id, name, category_name, quantity, image, description, price } = productDetails;
    const addProductQuery = `INSERT INTO Product(id, name, category_name, quantity, image, description, price)
        VALUES(${id},'${name}','${category_name}', ${quantity}, '${image}', '${description}', ${price});
    `;
    await db.run(addProductQuery);
    response.send({ productId: id });
});

//Update Product API

app.put("/products/:productId", authenticateToken, async (request, response) => {
    const { productId } = request.params;
    const productDetails = request.body;
    const { id, name, category_name, quantity, image, description, price } = productDetails;
    const updateProductQuery = `UPDATE Product
    SET 
    id=${id},
    name='${name}',
    category_name='${category_name}',
    quantity= ${quantity},
    image='${image}',
    description='${description}',
    price=${price}
    WHERE id=${productId};
    `;
    await db.run(updateProductQuery);
    response.send(`Product ${productId} updated successfully`);
});

// Delete Product API

app.delete("/products/:productId", authenticateToken, async (request, response) => {
    const { productId } = request.params;
    const deleteProductQuery = `DELETE FROM Product WHERE id= ${productId};`;
    await db.run(deleteProductQuery);
    response.send(`Product ${productId} deleted successfully`);

});

// Get Products In cart API

app.get("/cart-products/", authenticateToken, async (request, response) => {
    const getProductsQuery = `SELECT * FROM Cart ORDER BY id;`;
    const productsArray = await db.all(getProductsQuery);
    response.send(productsArray);
});

// Add Product In Cart API

app.post("/cart-products/", authenticateToken, async (request, response) => {
    const productDetails = request.body;
    const { id, name, category_name, quantity, image, description, price } = productDetails;
    const addProductQuery = `INSERT INTO Cart(id, name, category_name, quantity, image, description, price)
        VALUES(${id},'${name}','${category_name}', ${quantity}, '${image}', '${description}', ${price});
    `;
    await db.run(addProductQuery);
    response.send({ cartProductId: id });
});

//Update Product In Cart API

app.put("/cart-products/:productId", authenticateToken, async (request, response) => {
    const { productId } = request.params;
    const productDetails = request.body;
    const { quantity } = productDetails;
    const updateProductQuery = `UPDATE Cart
    SET 
    quantity= ${quantity}
    WHERE id=${productId};
    `;
    await db.run(updateProductQuery);
    response.send(`Product ${productId} updated successfully in cart`);
});

// Delete Product In Cart API

app.delete("/cart-products/:productId", authenticateToken, async (request, response) => {
    const { productId } = request.params;
    const deleteProductQuery = `DELETE FROM Cart WHERE id= ${productId};`;
    await db.run(deleteProductQuery);
    response.send(`Product ${productId} deleted successfully`);

});

//Search Product By Category,Name Or Filter By Offset, Limit, Order, Order_By API

app.get("/filtered-products/", authenticateToken, async (request, response) => {
    const { offset = 0, limit = 2, order = "ASC", order_by = "id", search_q = "" } = request.query;
    const getFilteredProductsQuery = `
    SELECT *
    FROM Product
    WHERE
    name LIKE '%${search_q}%' OR category_name LIKE '%${search_q}%'
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};
    `;
    const filteredProductsArray = await db.all(getFilteredProductsQuery);
    response.send(filteredProductsArray);

});

initializaDBAndServer();