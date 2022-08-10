<script lang="ts">

 import typescript from './typescript';

 export default typescript;


</script>
<style >
@import url('./css/styles.css');

</style>

<template>
  <div class="GameComponent-pagecontainer">
      <div>
        <GameHeaderContainer />        
      </div>  
      <div class="GameComponent-actioncontainer">
        <ActionBoxContainer :player1Choice="player1Choice" />
        <PlayButtonContainer @playersChoice="getValueplayersChoice($event)" />
        <ActionBoxContainer :player2Choice="player2Choice"/>     
      </div>
  </div>
      
  
  
  
</template>




