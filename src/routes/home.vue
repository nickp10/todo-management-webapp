<template>
    <div class="container">
        <div class="text-right">
            <a href="./logout" class="btn btn-sm btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">{{task.title}}</h4>
                </div>
                <div class="card-body">
                    <p class="text-left">{{task.description}}</p>
                    <p class="text-left"><b>Deadline: </b>{{deadline}}</p>
                    <div class="text-left">
                        <b>Notes:</b>
                        <form v-bind:action="'./saveNotes?id=' + task.id" method="POST">
                            <textarea name="notes" id="notes" v-model="task.notes" rows="5" cols="45"></textarea>
                            <div class="text-center">
                                <input type="submit" class="btn btn-sm btn-secondary" value="Save Notes" />
                            </div>
                        </form>
                    </div>
                    <br />
                    <br />
                    <a v-if="task.status === 'Not Started'" v-bind:href="'./start?id=' + task.id" class="btn btn-lg btn-primary">Start Task</a>
                    <a v-if="task.status === 'Started'" v-bind:href="'./complete?id=' + task.id" class="btn btn-lg btn-primary">Complete Task</a>
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
    max-width: 400px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
</style>