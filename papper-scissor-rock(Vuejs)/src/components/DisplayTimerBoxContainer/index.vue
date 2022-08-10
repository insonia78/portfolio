<script lang="ts">

 import typescript from './typescript';

 export default typescript;


</script>
<style scoped>
@import url('./css/styles.css');

</style>

<template>
  <div v-if="intervalCount > 0" class="DisplayTimerBoxContainer-pagecontainer">
         <div class="DisplayTimerBoxContainer-text">{{intervalCount}}</div>
      
  </div>
  
  
</template>




