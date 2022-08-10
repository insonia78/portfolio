import { defineComponent } from "vue";
import GameHeaderDetailsContainer from './../GameHeaderDetailsContainer/index.vue';
const typescript:any  = defineComponent({
  name: 'GameHeaderContainer',
  components: {
    GameHeaderDetailsContainer
  }
});

export default typescript;