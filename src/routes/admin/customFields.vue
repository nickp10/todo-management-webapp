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
                    <h4 class="my-0 font-weight-normal">Custom Fields</h4>
                </div>
                <div class="card-body">
                    <table class="table table-sm table-hover table-bordered">
                        <thead>
                            <tr>
                                <th class="col" scope="col">Field</th>
                                <th class="col" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-if="!customFields || !customFields.length">
                            <tr>
                                <td colspan="2" class="text-center">There are currently no custom fields</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="customField in customFields" v-bind:key="customField.id">
                                <td>{{customField.name}}</td>
                                <td>
                                    <a v-bind:href="'/admin/customFields/delete?id=' + customField.id" class="btn btn-sm btn-danger">Delete Field</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <form action="/admin/customFields" method="POST" class="form-editcustomfield">
                        <div class=" input-group text-center">
                            <input type="text" name="name" id="name" class="form-control" placeholder="Custom Field Name" required autofocus />
                            <div class="input-group-append">
                                <input type="submit" class="btn btn-primary" value="Add Field" />
                            </div>
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
    max-width: 1150px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
.col {
    width: 50%;
}
</style>