namespace Controller {
    let newestView: View.NewestView
    let oldestView: View.OldestView
    let tagsView: View.TagsView
    let addView: View.AddView
    let editView: View.EditView
    let addButton: View.ActionButtonView
    let removeButton: View.ActionButtonView
    let editButton: View.ActionButtonView
    let notification: View.NotificationView
    const dynamicViews: View.TabView[] = []
    const dao = new Model.ToDoItemDAO()

    /**
     * Determines which view component is being shown currently
     * @returns the active view
     */
    const getActiveView = () => dynamicViews.find(el => el.isActive())

    /**
     * Instantiate all UI components
     */
    function createComponents() {
        newestView = new View.NewestView(document.querySelector("#newest-tab"), document.querySelector("#newest-content"))
        oldestView = new View.OldestView(document.querySelector("#oldest-tab"), document.querySelector("#oldest-content"))
        tagsView = new View.TagsView(document.querySelector("#tags-tab"), document.querySelector("#tags-content")) 
        
        addView = new View.AddView(document.querySelector("#form-modal"))
        addButton = new View.ActionButtonView(document.querySelector("#btn-add"))

        removeButton = new View.ActionButtonView(document.querySelector("#btn-remove"))

        editView = new View.EditView(document.querySelector("#form-modal-edit"))
        editButton = new View.ActionButtonView(document.querySelector("#btn-edit"))

        notification = new View.NotificationView()

        dynamicViews.push(newestView, oldestView, tagsView)
    }

    /**
     * Refresh the list of tasks (currently we have only one implemented)
     */
    function refreshActiveView() {
        dao.listAll()
            .then(items => getActiveView()?.render(items))
            .catch(error => {
                console.error(error)
                notification.error("Failed to load data from the server")
            })
    }

    /**
     * Process the batch removal of items
     */
    async function handleRemoval() {
        const checkedIds = getActiveView()?.getCheckedIds() || []
        const status: boolean[] = []

        try {
            for (const id of checkedIds) {
                status.push(await dao.removeById(id))
            }
        } catch(error) {
            console.error("Failed to perform removal operation")
            console.error(error)
        }

        if (status.length < 1) {
            notification.info("Please, select an element to remove")
        }
        else if (status.reduce((acc, s) => acc && s)) {
            notification.success("ToDo item(s) removed successfully")
        } else {
            notification.error("Failed to remove ToDo item(s)")
        }
        refreshActiveView()
    }

    /**
     * Configure the toolbar components
     */
    function initToolbar() {
        addButton.container?.addEventListener("click", () =>
            addView.render(null))
        removeButton.container?.addEventListener("click", async () => {
            removeButton.disable()
            await handleRemoval()
            removeButton.enable()
        })
        editButton.container?.addEventListener("click", async () => {
            const checkedIds = getActiveView()?.getCheckedIds() || []

            if(checkedIds.length > 0) {
                editView.render(await dao.get(checkedIds[0]))
            } else {
                notification.info("No items selected")
            }
        })
    }

    /**
     * Handle the update operation
     */
    async function handleEdit() {
        try {
            const checkedIds = getActiveView()?.getCheckedIds() || []
            const status = await dao.update(editView.parse(checkedIds[0]))
            refreshActiveView()
            notification.success("ToDo item updated")
        } catch(error) {
            console.error("Failed to process update operation")
            notification.error("Failed to update item")
        }
        editView.dismiss()
    }

    async function handleInsert() {
        try {
            const status = await dao.insert(addView.parse())
            refreshActiveView()
            notification.success("Element added successfully")
        } catch(error) {
            console.error("Failed to process update operation")
            notification.error("Failed to add element")
        }
        addView.dismiss()
    }

    /**
     * Configure the AddView component
     */
    function initAddView() {
        addView.form.addEventListener("submit", async (ev) => {
            ev.preventDefault()
            addView.disable()
            await handleInsert()
            addView.enable()
        })
    }
    
    function initEditView() {
        editView.form.addEventListener("submit", async(ev) => {
            console.log("editou")
            ev.preventDefault()
            editView.disable()
            await handleEdit()
            editView.enable()
        })
    }

    /**
     * Refresh the active tab when a tab change occurs
     */
     const initDynamicViews = () => dynamicViews.forEach(
        view => view.tabEl?.addEventListener("show.bs.tab", refreshActiveView))

    /**
     * "Main" code, launch and configure the SPA
     */
    window.addEventListener("load", function () {
        createComponents()
        initToolbar()
        initDynamicViews()
        initAddView()
        initEditView()
        refreshActiveView()
    })
}