<template>
    <div class="container">
        <div class="text-right">
            <a v-if="isAdmin" href="/admin/tasks" class="btn btn-outline-success">Admin</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">{{task.title}}</h4>
                </div>
                <div class="card-body">
                    <pre class="text-left description">{{task.description}}</pre>
                    <div class="text-left"><b>Deadline: </b>{{task | formatDeadline}}</div>
                    <div v-for="customField in customFields" class="text-left" v-bind:key="customField.id">
                        <b>{{customField.name}}: </b>
                        {{task | formatCustomField(customField)}}
                    </div>
                    <div class="text-left">
                        <b>Notes:</b>
                        <form v-bind:action="'/saveNotes?id=' + task.id" method="POST">
                            <textarea v-model="task.notes" name="notes" id="notes" rows="5" class="form-control" placeholder="Notes"></textarea>
                            <div class="text-center">
                                <input type="submit" class="btn btn-sm btn-secondary" value="Save Notes" />
                            </div>
                        </form>
                    </div>
                    <br />
                    <br />
                    <a v-if="task.status === 'Not Started'" v-bind:href="'/start?id=' + task.id" class="btn btn-lg btn-primary">Start Task</a>
                    <a v-if="task.status === 'Started'" v-bind:href="'/complete?id=' + task.id" class="btn btn-lg btn-primary">Complete Task</a>
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
        formatDeadline: function(task) {
            if (!task || !task.deadline) {
                return "No Deadline";
            }
            return moment(task.deadline).format("MM/DD/YYYY hh:mm:ss A");
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
    max-width: 500px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
pre.description {
    font-family: inherit;
    white-space: pre-wrap; 
    word-wrap: break-word;
}
</style>