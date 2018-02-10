<template>
    <div class="container">
        <div class="text-center">
            <a href="/admin/tasks" class="btn btn-outline-success">Tasks</a>
            <a href="/admin/customFields" class="btn btn-outline-success">Custom Fields</a>
            <a href="/admin/users" class="btn btn-outline-success">Users</a>
            <a href="/" class="btn btn-outline-primary">Home</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <br />
        <div class="text-center">
            <a href="/admin/tasks/edit" class="btn btn-primary">Add Task</a>
        </div>
        <div class="card-deck text-center">
            <div v-for="task in tasks" v-bind:key="task.id" class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">{{task.title}}</h4>
                </div>
                <div class="card-body">
                    <p class="text-left">{{task.description}}</p>
                    <div class="text-left"><b>Assigned To: </b>{{task | formatUser(users)}}</div>
                    <div class="text-left"><b>Deadline: </b>{{task.deadline | formatDate('No deadline set')}}</div>
                    <div class="text-left"><b>Started: </b>{{task.dateStarted | formatDate('Not yet started')}}</div>
                    <div class="text-left"><b>Completed: </b>{{task.dateCompleted | formatDate('Not yet completed')}}</div>
                    <div class="text-left"><b>Status: </b>{{task.status}}</div>
                    <div class="text-left"><b>Notes: </b>{{task.notes}}</div>
                    <div v-for="customField in customFields" class="text-left" v-bind:key="customField.id">
                        <b>{{customField.name}}: </b>
                        {{task | formatCustomField(customField)}}
                    </div>
                    <div class="bottom">
                        <a v-if="task.status === 'Completed'" v-bind:href="'/admin/tasks/reopen?id=' + task.id" class="btn btn-sm btn-warning">Reopen Task</a>
                        <a v-bind:href="'/admin/tasks/edit?id=' + task.id" class="btn btn-sm btn-primary">Edit Task</a>
                        <a v-bind:href="'/admin/tasks/delete?id=' + task.id" class="btn btn-sm btn-danger">Delete Task</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center">
            <a href="/admin/tasks/edit" class="btn btn-primary">Add Task</a>
        </div>
    </div>
</template>

<script>
var moment = require("moment");
export default {
    data: function () {
        return { }
    },
    filters: {
        formatDate: function(date, failString) {
            if (!date) {
                return failString;
            }
            return moment(date).format("MM/DD/YYYY hh:mm:ss A");
        },
        formatUser: function(task, users) {
            if (!task || !task.assignee) {
                return "Unassigned";
            }
            if (!Array.isArray(users)) {
                return "Unassigned";
            }
            var user = users.find(function(u) { return u.id === task.assignee });
            if (!user) {
                return "Unassigned";
            }
            return user.username;
        },
        formatCustomField: function(task, customField) {
            if (!task || !customField) {
                return "";
            }
            return task[customField.id];
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
.card {
    max-width: 350px;
    min-width: 350px;
    padding-bottom: 50px;
    position: relative;
    width: 350px;
}
.bottom {
    bottom: 15px;
    margin-left: -1.25rem;
    position: absolute;
    width: 100%;
}
</style>