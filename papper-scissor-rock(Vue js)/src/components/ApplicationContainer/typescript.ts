import { defineComponent } from "vue";
import GameContainer from './../GameContainer/index.vue';
const typescript:any  = defineComponent({
  name: 'ApplicationContainer',
  components: {
    GameContainer
  }
});

export default typescript;