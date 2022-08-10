<script lang="ts">

 import typescript from './typescript';
 
 export default typescript;


</script>
<style scoped>
@import url('./css/styles.css');

</style>

<template>
  
  <div  class="PlayButtonContainer-pagecontainer">
    <DisplayTimerBoxContainer :intervalCount="dataProps.intervalCount" />
     <u class="PlayButtonContainer-result-text" v-if="dataProps.player1Choice > dataProps.player2Choice">Player 1 Wins!!!</u>
      <u class="PlayButtonContainer-result-text" v-if="dataProps.player1Choice < dataProps.player2Choice">Player 2 Wins!!!</u>
       <u class="PlayButtonContainer-result-text" v-if="dataProps.player1Choice === dataProps.player2Choice">Draw Game!!!</u>
    <div @click="play" role="button"  tabindex="0" class="PlayButtonContainer-buttoncontainer">
     
      <u  class="PlayButtonContainer-text">
           Play!
      </u>
    </div>   
      
  </div>
  
  
</template>




