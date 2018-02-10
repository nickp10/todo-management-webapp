<template>
    <div class="container">
        <div class="text-center">
            <a href="/admin/tasks" class="btn btn-outline-success">Tasks</a>
            <a href="/admin/customFields" class="btn btn-outline-success">Custom Fields</a>
            <a href="/admin/users" class="btn btn-outline-success">Users</a>
            <a href="/" class="btn btn-outline-primary">Home</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Add/Edit User</h4>
                </div>
                <div class="card-body">
                    <form v-bind:action="'/admin/users/edit?id=' + user.id" method="POST" class="form-edituser">
                        <div class="form-group row">
                            <label for="username" class="col-sm-2 col-form-label">Username:</label>
                            <div class="col-sm-10">
                                <input v-model="user.username" type="text" id="username" name="username" class="form-control" placeholder="Username" required autofocus>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-2 col-form-label">Password:</label>
                            <div v-if="user.id" class="col-sm-10">
                                <input type="password" id="password" name="password" class="form-control" placeholder="Password">
                            </div>
                            <div v-else class="col-sm-10">
                                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="maxTasks" class="col-sm-2 col-form-label">Max Tasks:</label>
                            <div class="col-sm-10">
                                <input v-model="user.maxTasks" type="text" id="maxTasks" name="maxTasks" class="form-control" placeholder="Max Tasks" required>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-sm-2 text-left">Admin</div>
                            <div class="col-sm-10 form-check text-left">
                                <input v-model="user.isAdmin" class="form-check-input" type="checkbox" id="isAdmin" name="isAdmin" />
                                <label class="form-check-label" for="isAdmin">Is Admin</label>
                            </div>
                        </div>
                        <div class="text-center">
                            <input type="submit" class="btn btn-primary" value="Save" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return { }
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
.form-check-input {
    margin-left: 0;
    margin-right: 2px;
    position: static;
}
label {
    text-align: left;
}
</style>