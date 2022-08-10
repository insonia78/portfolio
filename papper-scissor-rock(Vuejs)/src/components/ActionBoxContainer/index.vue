<script lang="ts">

 import typescript from './typescript';

 export default typescript;

 const selectImage = (value:any)=>{
    switch(value){
      case 1: return '<i tabindex="0" class="fa fa-scissors ActionBoxContainer-papper-scissor-rock-properties"></i>';
      case 2: return '<i tabindex="0" class="fa fa-hand-rock-o" ></i>';
      case 3: return '<i tabindex="0" class="fa fa-hand-paper-o" aria-hidden="true"></i>'
      default:

    }
 }
</script>
<style scoped>
@import url('./css/styles.css');

</style>

<template>

  <div class="ActionBoxContainer-pagecontainer">
    
    <div  class="ActionBoxContainer-icons-text-container" v-if="player1Choice === 1 || player2Choice === 1"> <i tabindex="0" style="transform: rotate(-90deg);" class="fa fa-scissors ActionBoxContainer-papper-scissor-rock-properties"></i><br/><u>Scissors</u> </div>
    <div class="ActionBoxContainer-icons-text-container" v-if="player1Choice === 2 || player2Choice === 2"> <i tabindex="0" class="fa fa-hand-rock-o ActionBoxContainer-papper-scissor-rock-properties" ></i><br/><u>Rock</u></div> 
    <div class="ActionBoxContainer-icons-text-container" v-if="player1Choice === 3 || player2Choice === 3"><i tabindex="0" class="fa fa-hand-paper-o ActionBoxContainer-papper-scissor-rock-properties" aria-hidden="true"></i><br/><u>Papper</u></div>
  </div>
  
  
</template>




