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
                        <a class="btn btn-primary reassign-selected">Reassign Selected Tasks</a>
                        <a class="btn btn-danger delete-selected">Delete Selected Tasks</a>
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
                    <table class="table table-sm table-hover table-bordered table-striped"></table>
                    <div v-for="task in tasks[currentTasks]" v-bind:id="'task' + task.id" v-bind:key="task.id" style="display: none;">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <pre class="description text-left">{{task.description}}</pre>
                                </div>
                                <div class="col">
                                    <div class="text-left"><b>Started: </b><span v-html="formatSpaces(formatDate(task.dateStarted, 'Not Started'))"></span></div>
                                    <div class="text-left"><b>Sent for Review: </b><span v-html="formatSpaces(formatDate(task.dateSentForReview, 'Not Sent for Review'))"></span></div>
                                    <div class="text-left"><b>Completed: </b><span v-html="formatSpaces(formatDate(task.dateCompleted, 'Not Completed'))"></span></div>
                                    <div class="text-left"><b>Completed By: </b><span v-html="formatSpaces(formatUser(task.completedBy, users, 'Not Completed'))"></span></div>
                                    <div v-for="customField in customFields" class="text-left" v-bind:key="customField.id">
                                        <b>{{customField.name}}: </b>
                                        {{task | formatCustomField(customField)}}
                                    </div>
                                    <div class="text-left"><b>Notes: </b><pre class="description">{{task.notes}}</pre></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <a href="/admin/tasks/edit" class="btn btn-primary">Add Task</a>
                        <a href="/admin/tasks/import" class="btn btn-primary">Import Tasks</a>
                        <a class="btn btn-primary reassign-selected">Reassign Selected Tasks</a>
                        <a class="btn btn-danger delete-selected">Delete Selected Tasks</a>
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
        }
    },
    mounted: function() {
        var that = this;
        var table = undefined;
        var createTable = function() {
            table = $(".table").DataTable({
                data: that.$data.tasks[that.$data.currentTasks],
                language: {
                    emptyTable: "There are currently no tasks in this status"
                },
                createdRow: function(row, data, index) {
                    $("td", row).first().addClass("expandable").addClass("text-center");
                    $("td", row).last().addClass("text-center").css("white-space", "nowrap");
                    $("td", row).addClass("td-fixed-width");
                    $("td", row).eq(1).removeClass("td-fixed-width");
                },
                columns: [
                    {
                        title: "",
                        render: function(data, type, task) {
                            return `<i class="fa fa-plus"></i><i class="fa fa-minus"></i>`
                        }
                    },
                    {
                        title: "Title",
                        data: "title"
                    },
                    {
                        title: "Assigned&nbsp;To",
                        data: "assignee",
                        render: function(data, type, task) {
                            return that.formatSpaces(that.formatUser(data, that.$data.users, "Unassigned"));
                        }
                    },
                    {
                        title: "Status",
                        data: "status",
                        render: function(data, type, task) {
                            return that.formatSpaces(data);
                        }
                    },
                    {
                        title: "Deadline",
                        data: "deadline",
                        render: function(data, type, task) {
                            return that.formatSpaces(that.formatDate(data, "No&nbsp;Deadline"));
                        }
                    },
                    {
                        title: "Actions",
                        render: function(data, type, task) {
                            var html = "";
                            if (task.status === "Completed" || task.status === "In Review") {
                                html += ` <a href="/admin/tasks/reopen?id=${task.id}" class="btn btn-sm btn-warning">Reopen Task</a>`;
                            }
                            if (task.status === "In Review") {
                                html += ` <a href="/admin/tasks/complete?id=${task.id}" class="btn btn-sm btn-warning">Complete Task</a>`;
                            }
                            html += ` <a href="/admin/tasks/edit?id=${task.id}" class="btn btn-sm btn-primary">Edit Task</a>`;
                            html += ` <a href="/admin/tasks/delete?id=${task.id}" class="btn btn-sm btn-danger">Delete Task</a>`;
                            return html;
                        }
                    }
                ],
                lengthMenu: [[10, 50, 100, -1], [10, 50, 100, "All"]],
                ordering: false
            });
        };
        that.$nextTick(function() {
            $(document).on("click", "a", function(e) {
                e.stopPropagation();
            });
            $("#statusTabs").on("shown.bs.tab", function (e) {
                if (table) {
                    table.destroy();
                }
                that.$data.currentTasks = $(e.target).attr("href");
                that.$nextTick(function() {
                    createTable();
                });
            });
            $(that.$data.currentTasks).tab("show");
            $(document).on("click", ".table td.expandable", function () {
                var tr = $(this).closest("tr");
                var row = table.row(tr);
                var div = $(`#task` + row.data().id);
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass("shown");
                } else {
                    row.child(div.html()).show();
                    tr.addClass("shown");
                }
            });
            var isCtrlKey = false;
            var isShiftKey = false;
            var lastSelectedRow = undefined;
            $(document).on("keyup keydown", function(e) {
                isCtrlKey = e.ctrlKey;
                isShiftKey = e.shiftKey;
            });
            var getElementsInBetween = function(from, to) {
                if (from.index() > to.index()) {
                    var tmp = from;
                    from = to;
                    to = tmp;
                }
                if (from.is(to)) {
                    return $([]);
                } else {
                    return from.nextUntil(to);
                }
            };
            $(document).on("mousedown", ".table td", function(e) {
                if ($(this).is(".expandable")) {
                    return;
                }
                var tr = $(this).closest("tr");
                if (!isCtrlKey) {
                    $(table.rows().nodes()).removeClass("selected");
                }
                tr.toggleClass("selected");
                var isSelected = tr.is(".selected");
                if (lastSelectedRow && isShiftKey) {
                    getElementsInBetween(lastSelectedRow, tr).toggleClass("selected", isSelected);
                    lastSelectedRow.toggleClass("selected", isSelected);
                }
                lastSelectedRow = tr;
                e.stopPropagation();
                e.preventDefault();
            });
            $(".delete-selected").click(function() {
                var ids = "";
                table.rows(".selected").data().each(function(row) {
                    if (ids) {
                        ids += ",";
                    }
                    ids += row.id;
                });
                window.location.href = "/admin/tasks/deleteMany?ids=" + ids;
            });
            $(".reassign-selected").click(function() {
                var ids = "";
                table.rows(".selected").data().each(function(row) {
                    if (ids) {
                        ids += ",";
                    }
                    ids += row.id;
                });
                window.location.href = "/admin/tasks/reassignMany?ids=" + ids;
            });
        });
    }
}
</script>

<style scoped>
body>.container {
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
.nav-tabs {
    margin-bottom: 1rem;
    margin-top: 1rem;
}
.table {
    border-spacing: 0;
}
.table td {
    cursor: pointer;
    text-align: left;
    vertical-align: middle;
}
.dataTables_length {
    text-align: left;
}
pre.description {
    font-family: inherit;
    white-space: pre-wrap; 
    word-wrap: break-word;
}
.fa-minus, .shown .fa-plus {
    display: none;
}
.shown .fa-minus, .fa-plus {
    display: block;
}
.td-fixed-width {
    width: 1% !important;
}
tr.selected:hover {
    background-color: rgb(175, 215, 255) !important;
}
tr.selected {
    background-color: rgb(105, 145, 185) !important;
}
.btn-primary {
    color: #FFF !important;
}
.btn-danger {
    color: #FFF !important;
}
</style>