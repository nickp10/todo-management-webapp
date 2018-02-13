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
                    <div class="input-group search-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Search:</span>
                        </div>
                        <input v-model="searchText" type="text" name="search" id="search" class="form-control" placeholder="Search" autofocus />
                    </div>
                    <ul class="nav nav-tabs" id="statusTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link" id="notStarted" data-toggle="tab" href="#notStarted" role="tab" aria-controls="notStarted" aria-selected="false">Not Started</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="inProgress" data-toggle="tab" href="#inProgress" role="tab" aria-controls="inProgress" aria-selected="false">In Progress</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="inReview" data-toggle="tab" href="#inReview" role="tab" aria-controls="inReview" aria-selected="false">In Review</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="completed" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Completed</a>
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
                            <template v-for="task in filterTasks(tasks[currentTasks], searchText)">
                            <tr v-bind:data-target="'#task' + task.id" class="clickable" v-bind:key="task.id + 'main'">
                                <td class="text-left">
                                    <i class="fa fa-plus" v-bind:id="'task' + task.id + 'plus'"></i>
                                    <i class="fa fa-minus" style="display: none;" v-bind:id="'task' + task.id + 'minus'"></i>
                                    &nbsp;{{task.title}}
                                </td>
                                <td class="text-left" v-html="formatSpaces(formatUser(task.assignee, users, 'Unassigned'))"></td>
                                <td class="text-left" v-html="formatSpaces(task.status)"></td>
                                <td class="text-left" v-html="formatSpaces(formatDate(task.deadline, 'No Deadline'))"></td>
                                <td style="white-space: nowrap">
                                    <a v-if="task.status === 'Completed' || task.status === 'In Review'" v-bind:href="'/admin/tasks/reopen?id=' + task.id" class="btn btn-sm btn-warning">Reopen Task</a>
                                    <a v-if="task.status === 'In Review'" v-bind:href="'/admin/tasks/complete?id=' + task.id" class="btn btn-sm btn-warning">Complete Task</a>
                                    <a v-bind:href="'/admin/tasks/edit?id=' + task.id" class="btn btn-sm btn-primary">Edit Task</a>
                                    <a v-bind:href="'/admin/tasks/delete?id=' + task.id" class="btn btn-sm btn-danger">Delete Task</a>
                                </td>
                            </tr>
                            <tr v-bind:id="'task' + task.id" v-bind:key="task.id" style="display: none;">
                                <td colspan="2">
                                    <pre class="description text-left">{{task.description}}</pre>
                                </td>
                                <td colspan="3">
                                    <div class="text-left"><b>Started: </b><span v-html="formatSpaces(formatDate(task.dateStarted, 'Not Started'))"></span></div>
                                    <div class="text-left"><b>Sent for Review: </b><span v-html="formatSpaces(formatDate(task.dateSentForReview, 'Not Sent for Review'))"></span></div>
                                    <div class="text-left"><b>Completed: </b><span v-html="formatSpaces(formatDate(task.dateCompleted, 'Not Completed'))"></span></div>
                                    <div class="text-left"><b>Completed By: </b><span v-html="formatSpaces(formatUser(task.completedBy, users, 'Not Completed'))"></span></div>
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
        formatUser: function(userID, users, failString) {
            if (!userID) {
                return failString;
            }
            if (!Array.isArray(users)) {
                return failString;
            }
            var user = users.find(function(u) { return u.id === userID });
            if (!user) {
                return failString;
            }
            return user.username;
        },
        formatSpaces: function(value) {
            return value.replace(/\s/g, "&nbsp;");
        },
        filterTasks: function(tasks, searchText) {
            if (!searchText) {
                return tasks;
            }
            searchText = searchText.toLowerCase();
            return tasks.filter(function(t) { return t.title.toLowerCase().indexOf(searchText) > -1; });
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
            $(that.$data.currentTasks).tab("show");
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
.search-group {
    margin-bottom: 1rem;
    margin-top: 1rem;
}
</style>