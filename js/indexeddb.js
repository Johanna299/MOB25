const dbName = "MyRecipesDB";
const storeName = "savedRecipes";


/**
 * Opens the IndexedDB database (or creates it if it doesn't exist).
 * Returns a Promise that resolves with the database instance.
 */
function openDB() {
    return new Promise((resolve, reject) => {
        //open (or create) DB version 1
        const request = indexedDB.open(dbName, 1);

        //handle connection error
        request.onerror = () => reject(request.error);
        //return DB instance
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = () => {
            const db = request.result;
            //create object store if it doesn't exist yet
            if (!db.objectStoreNames.contains(storeName)) {
                //use recipe ID as primary key
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
    });
}


/**
 * Saves a recipe to IndexedDB.
 * If a recipe with the same ID exists, it will be overwritten.
 */
export async function saveRecipe(recipe) {
    //open DB
    const db = await openDB();
    //start write transaction
    const tx = db.transaction(storeName, "readwrite");
    //save or update recipe
    tx.objectStore(storeName).put(recipe);
    //wait for transaction to finish
    await tx.complete;
    //close DB connection
    db.close();
}

/**
 * Removes a recipe from IndexedDB by its ID.
 */
export async function removeRecipe(id) {
    //open DB
    const db = await openDB();
    //start write transaction
    const tx = db.transaction(storeName, "readwrite");
    //delete recipe by ID
    tx.objectStore(storeName).delete(id);
    //wait for transaction to finish
    await tx.complete;
    //close DB connection
    db.close();
}

/**
 * Retrieves all saved recipes from IndexedDB.
 * Returns a Promise that resolves to an array of recipes.
 */
export async function getAllRecipes() {
    //open DB
    const db = await openDB();
    //start read-only transaction
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    //get all recipes
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        //return all recipes
        request.onsuccess = () => resolve(request.result);
        //handle error
        request.onerror = () => reject(request.error);
    });
}

/**
 * Checks if a recipe with the given ID exists in IndexedDB.
 * Returns a Promise that resolves to true or false.
 */
export async function isRecipeSaved(id) {
    //open DB
    const db = await openDB();
    //start read-only transaction
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    //try to get recipe by ID
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            //recipe exists if result is not undefined
            resolve(request.result !== undefined);
            //close DB
            db.close();
        };
        request.onerror = () => {
            //handle error
            reject(request.error);
            //close DB
            db.close();
        };
    });
}