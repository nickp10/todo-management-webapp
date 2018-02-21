<template>
    <div class="container text-center">
        <form action="/" method="POST" class="form-signin">
            <h3 class="mb-3 font-weight-normal">Please sign in</h3>
            <input type="text" id="username" name="username" class="form-control" placeholder="Username" required autofocus>
            <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <a href="/register" class="btn btn-lg btn-secondary btn-block">Register</a>
        </form>
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
    max-width: 350px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.form-signin .form-control {
    position: relative;
    padding: 10px;
}
.form-signin .form-control:focus {
    z-index: 2;
}
.form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
.form-signin input[type="text"]:focus {
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
}
.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.form-signin input[type="password"]:focus {
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
}
</style>