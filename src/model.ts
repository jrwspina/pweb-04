namespace Model {
    const RA = "11118316"
    const HOST = "https://pw2021q1-todo-spa.herokuapp.com/api"

    /**
     * Domain object
     */
    export class ToDoItem {
        id?: number
        description: string
        tags?: string[]
        deadline?: string

        constructor(description: string) {
            this.id = 0
            this.description = description
            this.tags = []
            this.deadline = ""
        }
    }

    /**
     * DAO
     */
    export class ToDoItemDAO {
        /**
         * List all elements from the database
         * @returns a list of ToDoItem
         */
        async listAll(): Promise<ToDoItem[]> {
            try {
                const response = await fetch(`${HOST}/${RA}/list`)

                if (response.ok) {
                    return (await response.json()).items as ToDoItem[]
                }
                console.error("Server status: " 
                    + JSON.stringify(await response.json()))
                throw new Error("Failed to retrieved elements from the server")
            } catch(error) {
                console.log("Failed to list elements")
                throw error
            }
        }

        /**
         * Insert an element in the service
         * @param item a ToDoItem
         * @returns a boolean promise
         */
        async insert(item: ToDoItem): Promise<boolean> {
            try {
                const response = await fetch(`${HOST}/${RA}/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(item)
                })
                if (response.ok) {
                    return true
                }
                console.error("Server-side error. Failed to insert.")
                console.error("Server.status: " + JSON.stringify(await response.json()))

                throw new Error("Failed to insert element")
            } catch(error) {
                console.error("Failed to insert element")
                throw error
            }
        }

        /**
         * Remove an element from the service
         * @param id the element id
         * @returns true if element could be removed, false otherwise
         */
        async removeById(id: number): Promise<boolean> {
            try {
                const response = await fetch(`${HOST}/${RA}/remove/${id}`)

                if (response.ok) {
                    return true
                }

                console.error("Server-side error. Failed to remove")
                console.error("Server status: " + JSON.stringify(await response.json()))
                return false
            } catch(error) {
                console.error("Faield to remove element")

                throw error
            }
        }

        async get(id: number): Promise<ToDoItem> {
            try {
                const response = await fetch(`${HOST}/${RA}/item/${id}`)
                if(response.ok) {
                    return (await response.json()).item as ToDoItem
                }
                console.error("Server-side error. Failed to get.")
                console.error("Server.status: " + JSON.stringify(await response.json()))

                throw new Error("Failed to get element")
            } catch (error) {
                console.log("Failed to get element")
                throw error
            }
        } 

        /**
         * Update an element with the given id. 
         * @param updatedItem the item to update. Element id should be valid.
         * @returns 
         */
        async update(updatedItem: ToDoItem): Promise<boolean> {
            try {
                const response = await fetch(`${HOST}/${RA}/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedItem)                    
                })
                if (response.ok) {
                    return true
                }
                console.error("Server-side error. Failed to update.")
                console.error("Server.status: " + JSON.stringify(await response.json()))

                throw new Error("Failed to update element")
            } catch (error) {
                console.error("Failed to update element")
                throw error
            }
        }
    }
}