<template>
    <div class="container">
        <div class="text-right">
            <a v-if="isAdmin" href="/admin/tasks" class="btn btn-outline-success">Admin</a>
            <a href="/home" class="btn btn-outline-primary">Home</a>
            <a href="/logout" class="btn btn-outline-primary">Logout</a>
        </div>
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Change Password</h4>
                </div>
                <div class="card-body">
                    <form action="/changePassword" method="POST" class="form-changepassword">
                        <div class="form-group row">
                            <label for="currentPassword" class="col-sm-5 col-form-label">Current Password:</label>
                            <div class="col-sm-7">
                                <input type="password" id="currentPassword" name="currentPassword" class="form-control" placeholder="Current Password" required autofocus>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-5 col-form-label">New Password:</label>
                            <div class="col-sm-7">
                                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="confirmPassword" class="col-sm-5 col-form-label">Confirm Password:</label>
                            <div class="col-sm-7">
                                <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="Confirm Password" required>
                            </div>
                        </div>
                        <div v-if="error" class="alert alert-danger">{{error}}</div>
                        <div class="text-center">
                            <input type="submit" class="btn btn-primary" value="Change Password" />
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
    max-width: 500px;
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