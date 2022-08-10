import { defineComponent } from "vue";
import ActionBoxContainer from './../ActionBoxContainer/index.vue';
import PlayButtonContainer from './../PlayButtonContainer/index.vue';
import GameHeaderContainer from './../GameHeaderContainer/index.vue';

const typescript:any  = defineComponent({
  name: 'GameContainer',
  components: {
    ActionBoxContainer,
    PlayButtonContainer,
    GameHeaderContainer
    
  },
  data(){
    return {
      player1Choice:0,
      player2Choice:0
    }
  },
  methods:{
    getValueplayersChoice(value:any){
      console.log("value",value)
      this.player1Choice= value.player1Choice;
      this.player2Choice= value.player2Choice;
    },
    
  }
});

export default typescript;