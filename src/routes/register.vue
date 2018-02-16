<template>
    <div class="container">
        <div class="card-deck text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">Register</h4>
                </div>
                <div class="card-body">
                    <form action="/register" method="POST" class="form-register">
                        <div class="form-group row">
                            <label for="username" class="col-sm-5 col-form-label">Username:</label>
                            <div class="col-sm-7">
                                <input type="text" id="username" name="username" class="form-control" placeholder="Username" required autofocus>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-5 col-form-label">Password:</label>
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
                            <input type="submit" class="btn btn-primary" value="Register" />
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
label {
    text-align: left;
}
</style>