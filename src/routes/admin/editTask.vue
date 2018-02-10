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
                    <h4 class="my-0 font-weight-normal">Add/Edit Task</h4>
                </div>
                <div class="card-body">
                    <form v-bind:action="'/admin/tasks/edit?id=' + task.id" method="POST" class="form-edittask">
                        <div class="form-group row">
                            <label for="title" class="col-sm-2 col-form-label">Title:</label>
                            <div class="col-sm-10">
                                <input v-model="task.title" type="text" id="title" name="title" class="form-control" placeholder="Title" required autofocus />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="description" class="col-sm-2 col-form-label">Description:</label>
                            <div class="col-sm-10">
                                <input v-model="task.description" type="text" id="description" name="description" class="form-control" placeholder="Description" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="assignee" class="col-sm-2 col-form-label">Assigned To:</label>
                            <div class="col-sm-10">
                                <select v-model="task.assignee" id="assignee" name="assignee" class="form-control">
                                    <option value="">Unassigned</option>
                                    <option v-for="user in users" v-bind:key="user.id" v-bind:value="user.id">{{user.username}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <input type="hidden" name="deadline" id="deadlineValue" />
                            <label for="deadline" class="col-sm-2 col-form-label">Deadline:</label>
                            <div class="col-sm-10 input-group date" id="deadline" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-target="#deadline" />
                                <div class="input-group-append" data-target="#deadline" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                        </div>
                        <div v-for="customField in customFields" class="form-group row" v-bind:key="customField.id">
                            <label for="title" class="col-sm-2 col-form-label">{{customField.name}}:</label>
                            <div class="col-sm-10">
                                <input v-model="task[customField.id]" type="text" v-bind:id="customField.id" v-bind:name="customField.id" class="form-control" v-bind:placeholder="customField.name" />
                            </div>
                        </div>
                        <div v-if="error" class="alert alert-danger">{{error}}</div>
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
    },
    mounted: function() {
        var syncDeadline = function(date) {
            $("#deadlineValue").val(date && date.toISOString ? date.toISOString() : date || "");
        };
        this.$nextTick(function() {
            var opts = { };
            if (this.$data.task.deadline) {
                opts.date = this.$data.task.deadline;
            }
            $("#deadline").datetimepicker(opts);
            $("#deadline").on("change.datetimepicker", function(e) {
                syncDeadline(e.date);
            });
            syncDeadline(this.$data.task.deadline);
        });
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