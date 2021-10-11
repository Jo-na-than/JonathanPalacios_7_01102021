<template>
    <div class="alert alert-danger mx-auto mt-5 mb-5" role="alert">
        {{error}}
    </div>
</template>

<script>
export default {
    name: "Error",
    props: [ 'error']
}
</script>