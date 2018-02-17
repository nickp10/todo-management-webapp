<template>
    <div class="container">
        <div class="text-center">
            <a href="/admin/tasks" class="btn" v-bind:class="[ nav.isTasks ? 'btn-success' : 'btn-outline-success' ]">Tasks</a>
            <a href="/admin/customFields" class="btn" v-bind:class="[ nav.isCustomFields ? 'btn-success' : 'btn-outline-success' ]">Custom Fields</a>
            <a href="/admin/users" class="btn" v-bind:class="[ nav.isUsers ? 'btn-success' : 'btn-outline-success' ]">Users</a>
            <a href="/" class="btn btn-outline-primary">Home</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Reassign Selected Tasks</h4>
                </div>
                <div class="card-body">
                    <form v-bind:action="'/admin/tasks/reassignMany?ids=' + taskIds" method="POST" class="form-reassigntasks">
                        <div class="form-group row">
                            <label for="assignee" class="col-sm-2 col-form-label">Reassign To:</label>
                            <div class="col-sm-10">
                                <select id="assignee" name="assignee" class="form-control">
                                    <option value="">Unassigned</option>
                                    <option v-for="user in users" v-bind:key="user.id" v-bind:value="user.id">{{user.username}}</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="error" class="alert alert-danger">{{error}}</div>
                        <div class="text-center">
                            <input type="submit" class="btn btn-primary" value="Reassign" />
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
label {
    text-align: left;
}
</style>