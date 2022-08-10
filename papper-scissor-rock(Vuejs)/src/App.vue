<script lang="ts">
import { defineComponent } from 'vue';
import ApplicationContainer from './components/ApplicationContainer/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    ApplicationContainer
  }
});
</script>
 

<template>
  <div style="width:inherit; min-height:inherit;height:auto;">
   
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
  <ApplicationContainer />
  </div>
</template>



<style>
body{
  margin:0px;
  width:100%;
    min-height:100vh;
    height:auto;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    width: 100%;
    min-height: inherit;
    height: auto;
 
}
@media only screen and  ( min-width : 1701px ){
   body{
     font-size:large;
     }

  
}


@media only screen and  ( max-width : 1500px ){
   body{
     font-size:.85em;
     }

  
}
@media only screen and  ( max-width : 1400px ){
   body{
     font-size:.75em;
     }

  
}



@media only screen and  ( max-width : 1080px ){
   body{
     font-size:.6em;
     }

  
}
@media only screen and  ( max-width : 990px ){
   body{
     font-size:xx-small;
     }

  
}
@media only screen and  ( max-width : 850px ){
   body{
     font-size:.45em;
     }

  
}
@media only screen and  ( max-width : 790px ){
   body{
     font-size:.4em;
     }

  
}
@media only screen and  ( max-width : 700px ){
   body{
     font-size:.35em;
     }

  
}
@media only screen and  ( max-width : 700px ){
   body{
     font-size:.33em;
     }

  
}
@media only screen and  ( max-width : 600px ){
   body{
     font-size:.3em;
     }

  
}
@media only screen and  ( max-width : 520px ){
   body{
     font-size:.28em;
     }

  
}
@media only screen and  ( max-width : 480px ){
   body{
     font-size:.22em;
     }

  
}
@media only screen and  ( max-width : 400px ){
   body{
     font-size:.2em;
     }

  
}
@media only screen and  ( max-width : 330px ){
   body{
     font-size:.15em;
     }

  
}
@media only screen and  ( max-width : 280px ){
   body{
     font-size:.13em;
     }

  
}

</style>
