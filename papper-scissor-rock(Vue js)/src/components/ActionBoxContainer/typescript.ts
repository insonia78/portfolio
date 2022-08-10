import { defineComponent } from "vue";

const typescript:any  = defineComponent({
  name: 'ActionBoxContainer',
  props: ['player1Choice','player2Choice'],
  methods:{
    selectImage(value:any){
      switch(value){
        case 1: return '<i tabindex="0" class="fa fa-scissors ActionBoxContainer-papper-scissor-rock-properties"></i>';
        case 2: return '<i tabindex="0" class="fa fa-hand-rock-o" ></i>';
        case 3: return '<i tabindex="0" class="fa fa-hand-paper-o" aria-hidden="true"></i>'
        default:""
  
      }
  }
}
  // components: {
  //   ApplicationContainer
  // }
});

export default typescript;