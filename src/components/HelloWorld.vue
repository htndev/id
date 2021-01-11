<template>
  <div class="hello">
    <b-button type="is-primary" @click="onClick">Click me</b-button>

    <b-notification v-model="isActive" has-icon type="is-danger">wtf</b-notification>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  isActive = false;
  onClick() {
    this.isActive = !this.isActive;
  }
}
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
