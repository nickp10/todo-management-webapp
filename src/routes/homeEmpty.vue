<template>
    <div class="container">
        <div class="text-right">
            <a v-if="isAdmin" href="/admin/tasks" class="btn btn-outline-success">Admin</a>
            <a href="/changePassword" class="btn btn-outline-primary">Change Password</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Congratulations</h4>
                </div>
                <div class="card-body">
                    <p class="text-left">You currently have no tasks assigned to you!</p>
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
    max-width: 500px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.card-deck {
    margin-top: 10px;
}
</style>