/**
 * Created by Dimitris on 4/25/2017.
 */
Vue.component('card-head',{
   template:`<div class="card-header">
                    <h5 class="pb-0"> 
                    <slot> </slot>
                    </h5>
                    </div>
                    `
});
Vue.component('card-block',{
    template: `<div class="card-block"><slot></slot></div>`
});
Vue.component('btn-group',{
  template: '<div class="btn-group"><slot></slot></div>'
});
Vue.component('row',{
    template:`<div class="row"><slot></slot></div>`
});
Vue.component('list-group',{
   template:`<ul class="list-group list-group-flush"><slot></slot></ul>`
});
Vue.component('card',{
    template:`<div class="card mb-3" ><slot></slot></div>`
});

Vue.component('form-inline',{
   template:'<div class="form-inline"> <slot></slot> </div>'
});
Vue.component('form-group',{
    template:'<div class="form-group"><slot></slot></div>'
});

Vue.component('list-item',{
    template:'<li class="list-group-item "><slot></slot></li>'
});
Vue.component('jumbotron-full',{
    template:`<div class="jumbotron jumbotron-fluid">
  <div class="container">
   <slot></slot>
  </div>
</div>`
});

Vue.component('modal-button',{
    template:`<button data-toggle="modal"><slot></slot></button>`
    }
);

Vue.component('modal',{
   template:`
<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
     <slot> </slot>
    </div>
  </div>
</div>`
});

Vue.component('select-media',{
    data:function () {
        return{
            active:false,
            filesRightNow:[]
        }
    },
    created:function () {
    },
    methods:{
        activated:function(e){
            console.log('h2222');
            $('#select-media').modal('show');
            console.log('hi');
            this.active = true;
            fetch(url+'type=GetFiles').then(resp=>resp.json()).then(resp=> this.filesRightNow= resp);
        }
    },
    template:`

    <div class="card-group">
    
    <button @click="activated" class="btn btn-primary"> Επιλογή</button>
    <modal id="select-media"> 
        <div class="modal-header"> 
           <h2>Επιλογή απο την Βιβλιοθήκη:</h2> 
        </div> 
        <div  v-show="active" class="modal-body">
      
          <card class="d-inline-block  m-1"
                  v-model="filesRightNow"
                  v-for="img in filesRightNow"
                  style=" background:#1d1e1f; height: 100px; overflow: hidden; position: relative;"> 
                <img class="card-img-top" style="background:#1d1e1f; width:150px;" :src="'api/'+img">  
                <!--<div class="card-group">
                    <div  class="btn-group"
                          style="position:absolute; left:0; bottom:0;"> 
                        <button class="btn btn-sm btn-danger"> <i class="fa fa-remove"></i></button>
                    </div>
               </div> -->
        
             </card>
        </div>
    </modal>
    </div>
  

`
})