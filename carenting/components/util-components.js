/**
 * Created by Dimitris on 4/30/2017.
 */

Vue.component( 'form-search' ,{
    template: `
<card-block>
        <form-group  class="d-inline-block"> 
            <label for="date"> Ημέρα </label>
            <input id="date" class="form-control" v-model="date" type="date" :min="minDate">
        </form-group> 
        <form-group class="d-inline-block"> 
            <label for="timeFrom"> Από </label>
            <input id="timeFrom" class="form-control" type="time">
        </form-group> 
        <form-group class="d-inline-block"> 
            <label for="timeTo"> Εώς</label>
            <input id="timeTo" class="form-control" type="time">
        </form-group>
        <form-group class="d-inline-block"> 
            <label for="location"> Τοποθεσία</label>
         <gmap-autocomplete class="form-control" id="location" 
                            v-model="location"                            
                            >
      </gmap-autocomplete>
        </form-group>
        <form-group> 
            <button class="btn btn-success"> Αναζήτηση</button>
        </form-group>

</card-block>
`,
    data: () => {
        return {
            location:'athens',
            date:dateNow(),
            minDate:dateNow()
        }
    },
    beforeCreate: function () {

    },

    methods: {}
});

Vue.component('form-upload',{
    template:`
            <div class="card-group">
            <form-inline style="width: 100%" id="fileUpload">
                  <input style="width: 100%" @change="onFileChange" type="file" multiple class="btn btn-outline-primary"> 
             </form-inline> 
             <div class="card" v-show="previewShow"> 
             <div class="card-header">Προεπισκόπηση:</div>
             <div class="card-group">
             <card class="d-inline-block"
                  v-model="preview"
                  v-for="img in preview"> 
                <img class="card-img-top" style="width:150px;" :src="img">
             </card>
            <list-group>
                <list-item v-for="file in uploading"> 
                     <span class="mr-3"> {{file.status}}</span>
                    <div v-show="file.status=='uploading'?true:false" class="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 60%"> 
                    </div>
                </list-item>
            </list-group>
             </div>
             
            <div class="card-footer"> 
            <button @click="uploadFiles" class="btn btn-success">Προσθήκη <i class="fa fa-plus"></i></button>
            </div>
             </div>
            </div>
            
          
   
   
`,
    data:function () {
        return {
            id:this.initialID,
            uploading:[],
            toBeUploaded:[],
            preview:[],
            previewShow:false
        }
    },
    props:['initialID'],

    methods:{
        uploadFiles:function(){
            console.log(this.id);
            this.preview=[];
            let data2 = /*new FormData();*/ this.toBeUploaded;
            //data.append('files',this.toBeUploaded);
            let input = document.querySelector('input[type="file"]');
            _this = this;
            for(i=0; i<input.files.length;i++){
                let data = new FormData();
                this.uploading.push({file:input.files[i],status:'uploading'});
                data.append('file', input.files[i]);
                data.append('id',this.id);
                fetch(url+'type=FileUpload&order='+i,{
                    method:"POST",
                    body:data
                })
                    .then(resp=>resp.json())
                    .then(resp=>{
                        console.log(resp);
                        if(resp.uploaded){
                            this.uploading[resp.order].status = "completed";
                            this.$emit('uploaded', resp.uploaded);
                        }else if(resp.error){
                            this.uploading[resp.order].status = resp.error;
                        }
                    });

            }
        },
        onFileChange(e) {
            this.uploading=[];
            this.previewShow = true;
            this.preview=[];
            this.toBeUploaded = e.target.files || e.dataTransfer.files;

            if (!this.toBeUploaded.length)
                return;
            console.log(this.toBeUploaded);
            for(i=0;i<this.toBeUploaded.length;i++){
                let file =  this.toBeUploaded[i];
                console.log(file);
                this.previewImage(file);
            }
        },
        addFiles:()=>{
            let form = document.getElementById('fileUpload');
            let data = new FormData(form);
            console.log(data);
        },
        previewImage:function(file){
            let image = new Image();
            let reader = new FileReader();
            let _this = this;
            console.log(this.preview);
            reader.onload = (e) => {
                _this.preview.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }




});

Vue.component('car-card',{
    template:` 
 <card> 
    <card-head> Μοντέλο </card-head>   
     <div class="card-group">
             <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner" role="listbox">
            <div class="carousel-item active">
              <img class="d-block img-fluid" src="..." alt="First slide">
            </div>
            <div class="carousel-item">
              <img class="d-block img-fluid" src="..." alt="Second slide">
            </div>
            <div class="carousel-item">
              <img class="d-block img-fluid" src="..." alt="Third slide">
            </div>
          </div>
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
    </div>
        <list-group>    
            <list-item> Τοποθεσία : </list-item>
            <list-item> Ιδιοκτήτης :</list-item>
        </list-group>
 </card>`

});