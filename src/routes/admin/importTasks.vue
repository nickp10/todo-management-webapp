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
                    <h4 class="my-0 font-weight-normal">Import Tasks</h4>
                </div>
                <div class="alert alert-primary">
                    <i class="fa fa-info-circle"></i>&nbsp;
                    The uploaded file should be a comma-separated CSV. The order of the columns should be:
                    <br /><br />
                    <strong>Title</strong>, <strong>Description</strong>, Assignee, Deadline{{customFieldsStr}}
                </div>
                <div class="card-body">
                    <form action="/admin/tasks/import" method="POST" class="form-importtasks" enctype="multipart/form-data">
                        <div class="form-group row input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="importFile" name="importFile" onchange="$('#importFileLabel').html(this.files[0].name)" />
                                <label class="custom-file-label" for="importFile" id="importFileLabel">Choose file</label>
                            </div>
                        </div>
                        <div class="text-center">
                            <input type="submit" class="btn btn-primary" value="Upload" />
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
    max-width: 800px;
    padding-top: 40px;
    padding-bottom: 40px;
}
.alert-primary {
    margin: 1.25rem 1.25rem 0 1.25rem;
    text-align: left;
}
.card-deck {
    margin-top: 10px;
}
.input-group {
    margin-left: 5px;
    margin-right: 5px;
    width: auto;
}
label {
    text-align: left;
}
</style>