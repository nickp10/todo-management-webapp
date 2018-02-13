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
                    <h4 class="my-0 font-weight-normal">Tasks</h4>
                </div>
                <div class="card-body">
                    <div class="text-center">
                        <a href="/admin/tasks/edit" class="btn btn-primary">Add Task</a>
                        <a href="/admin/tasks/import" class="btn btn-primary">Import Tasks</a>
                    </div>
                    <br />
                    <ul class="nav nav-tabs" id="statusTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="notStartedTab" data-toggle="tab" href="#notStarted" role="tab" aria-controls="notStarted" aria-selected="true">Not Started</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="inProgressTab" data-toggle="tab" href="#inProgress" role="tab" aria-controls="inProgress" aria-selected="false">In Progress</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="completedTab" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Completed</a>
                        </li>
                    </ul>
                    <table class="table table-sm table-hover table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th style="width: 1%">Assigned&nbsp;To</th>
                                <th style="width: 1%">Status</th>
                                <th style="width: 1%">Deadline</th>
                                <th style="width: 1%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="task in tasks[currentTasks]">
                            <tr v-bind:data-target="'#task' + task.id" class="clickable" v-bind:key="task.id + 'main'">
                                <td class="text-left">
                                    <i class="fa fa-plus" v-bind:id="'task' + task.id + 'plus'"></i>
                                    <i class="fa fa-minus" style="display: none;" v-bind:id="'task' + task.id + 'minus'"></i>
                                    &nbsp;{{task.title}}
                                </td>
                                <td class="text-left" v-html="formatSpaces(formatUser(task, users))"></td>
                                <td class="text-left" v-html="formatSpaces(task.status)"></td>
                                <td class="text-left" v-html="formatSpaces(formatDate(task.deadline, 'No Deadline'))"></td>
                                <td style="white-space: nowrap">
                                    <a v-if="task.status === 'Completed'" v-bind:href="'/admin/tasks/reopen?id=' + task.id" class="btn btn-sm btn-warning">Reopen Task</a>
                                    <a v-bind:href="'/admin/tasks/edit?id=' + task.id" class="btn btn-sm btn-primary">Edit Task</a>
                                    <a v-bind:href="'/admin/tasks/delete?id=' + task.id" class="btn btn-sm btn-danger">Delete Task</a>
                                </td>
                            </tr>
                            <tr v-bind:id="'task' + task.id" v-bind:key="task.id" style="display: none;">
                                <td>
                                    <pre class="description text-left">{{task.description}}</pre>
                                </td>
                                <td colspan="4">
                                    <div class="text-left"><b>Started: </b><span v-html="formatSpaces(formatDate(task.dateStarted, 'Not Started'))"></span></div>
                                    <div class="text-left"><b>Completed: </b><span v-html="formatSpaces(formatDate(task.dateCompleted, 'Not Completed'))"></span></div>
                                    <div v-for="customField in customFields" class="text-left" v-bind:key="customField.id">
                                        <b>{{customField.name}}: </b>
                                        {{task | formatCustomField(customField)}}
                                    </div>
                                    <div class="text-left"><b>Notes: </b><pre class="description">{{task.notes}}</pre></div>
                                </td>
                            </tr>
                            </template>
                            <tr v-if="!tasks[currentTasks] || !tasks[currentTasks].length">
                                <td colspan="5" class="text-center">There are currently no tasks in this status</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-center">
                        <a href="/admin/tasks/edit" class="btn btn-primary">Add Task</a>
                        <a href="/admin/tasks/import" class="btn btn-primary">Import Tasks</a>
                    </div>
                </div>
            </div>
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
        formatCustomField: function(task, customField) {
            if (!task || !customField) {
                return "";
            }
            return task[customField.id];
        }
    },
    methods: {
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
        formatSpaces: function(value) {
            return value.replace(/\s/g, "&nbsp;");
        }
    },
    mounted: function() {
        var that = this;
        this.$nextTick(function() {
            $(document).on("click", ".clickable", function() {
                var id = $(this).data("target");
                $(id).toggle("fast");
                $(id + "plus").toggle();
                $(id + "minus").toggle();
            });
            $(document).on("click", ".clickable a", function(e) {
                e.stopPropagation();
            });
            $("#statusTabs").on("shown.bs.tab", function (e) {
                var target = $(e.target).attr("href");
                that.$data.currentTasks = target;
            });
        });
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
.clickable {
    cursor: pointer;
}
.table, .table th {
    border-top: 0;
}
pre.description {
    font-family: inherit;
    white-space: pre-wrap; 
    word-wrap: break-word;
}
</style>