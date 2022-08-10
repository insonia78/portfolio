import { defineComponent } from "vue";

const typescript:any  = defineComponent({
  name: 'DisplayTimerBoxContainer',
  props:['intervalCount','player1Choice', 'player2Choice']
  // components: {
  //   ApplicationContainer
  // }
});

export default typescript;