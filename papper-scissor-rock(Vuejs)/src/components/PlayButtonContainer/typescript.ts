import { defineComponent } from "vue";
import  DisplayTimerBoxContainer from './../DisplayTimerBoxContainer/index.vue';

const playArray:any = [];


 const dataProps:any = {  
    ms:1000,
    intervalCount:0,
    player1Choice:0,
    player2Choice:0,
  
}
 
const _play = ($this:any):any =>{
  const emit:any = $this;
  $this = $this.dataProps;
  
  
  
  
      ++$this.intervalCount
      //clearInterval(pointer)
     
  
    const pointer = setInterval(($this:any)=>{
    
         
      if(++$this.intervalCount > 3)
      {
        
       $this.intervalCount = 0;
       $this.player1Choice = (Math.floor(Math.random() * 3)) + 1;
       $this.player2Choice = (Math.floor(Math.random() * 3)) + 1;
      
       emit.$emit('playersChoice',$this);
        
       playArray.forEach((element:any) => {
          clearInterval(element);
          
        });
      }
        

},$this.ms,$this);
playArray.push(pointer);
  
  
  

}


const typescript:any  = defineComponent({
  name: 'PlayButtonContainer',
  data(){return {dataProps}},
  methods:{
    play(){
          _play(this);
         
    }

    
  },
  
  components: {
    DisplayTimerBoxContainer
  }
});

export default typescript;