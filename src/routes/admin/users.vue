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
                    <h4 class="my-0 font-weight-normal">Users</h4>
                </div>
                <div class="card-body">
                    <table class="table table-sm table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Max Tasks</th>
                                <th scope="col">Is Admin?</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" v-bind:key="user.id">
                                <td>{{user.username}}</td>
                                <td>{{user.maxTasks}}</td>
                                <td>{{user.isAdmin | formatIsAdmin}}</td>
                                <td>
                                    <a v-if="!user.isRoot" v-bind:href="'/admin/users/edit?id=' + user.id" class="btn btn-sm btn-primary">Edit User</a>
                                    <a v-if="!user.isRoot" v-bind:href="'/admin/users/delete?id=' + user.id" class="btn btn-sm btn-danger">Delete User</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center">
                        <a href="/admin/users/edit" class="btn btn-primary">Add User</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return { }
    },
    filters: {
        formatIsAdmin: function(isAdmin) {
            return isAdmin ? "Yes" : "No"
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 1150px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
</style>