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
var Model;
(function (Model) {
    const RA = "11118316";
    const HOST = "https://pw2021q1-todo-spa.herokuapp.com/api";
    /**
     * Domain object
     */
    class ToDoItem {
        constructor(description) {
            this.id = 0;
            this.description = description;
            this.tags = [];
            this.deadline = "";
        }
    }
    Model.ToDoItem = ToDoItem;
    /**
     * DAO
     */
    class ToDoItemDAO {
        /**
         * List all elements from the database
         * @returns a list of ToDoItem
         */
        listAll() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${HOST}/${RA}/list`);
                    if (response.ok) {
                        return (yield response.json()).items;
                    }
                    console.error("Server status: "
                        + JSON.stringify(yield response.json()));
                    throw new Error("Failed to retrieved elements from the server");
                }
                catch (error) {
                    console.log("Failed to list elements");
                    throw error;
                }
            });
        }
        /**
         * Insert an element in the service
         * @param item a ToDoItem
         * @returns a boolean promise
         */
        insert(item) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${HOST}/${RA}/add`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(item)
                    });
                    if (response.ok) {
                        return true;
                    }
                    console.error("Server-side error. Failed to insert.");
                    console.error("Server.status: " + JSON.stringify(yield response.json()));
                    throw new Error("Failed to insert element");
                }
                catch (error) {
                    console.error("Failed to insert element");
                    throw error;
                }
            });
        }
        /**
         * Remove an element from the service
         * @param id the element id
         * @returns true if element could be removed, false otherwise
         */
        removeById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${HOST}/${RA}/remove/${id}`);
                    if (response.ok) {
                        return true;
                    }
                    console.error("Server-side error. Failed to remove");
                    console.error("Server status: " + JSON.stringify(yield response.json()));
                    return false;
                }
                catch (error) {
                    console.error("Faield to remove element");
                    throw error;
                }
            });
        }
        get(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${HOST}/${RA}/item/${id}`);
                    if (response.ok) {
                        return (yield response.json()).item;
                    }
                    console.error("Server-side error. Failed to get.");
                    console.error("Server.status: " + JSON.stringify(yield response.json()));
                    throw new Error("Failed to get element");
                }
                catch (error) {
                    console.log("Failed to get element");
                    throw error;
                }
            });
        }
        /**
         * Update an element with the given id.
         * @param updatedItem the item to update. Element id should be valid.
         * @returns
         */
        update(updatedItem) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${HOST}/${RA}/update`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedItem)
                    });
                    if (response.ok) {
                        return true;
                    }
                    console.error("Server-side error. Failed to update.");
                    console.error("Server.status: " + JSON.stringify(yield response.json()));
                    throw new Error("Failed to update element");
                }
                catch (error) {
                    console.error("Failed to update element");
                    throw error;
                }
            });
        }
    }
    Model.ToDoItemDAO = ToDoItemDAO;
})(Model || (Model = {}));
