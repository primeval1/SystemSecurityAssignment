/**
 * Created by Dimitris on 4/30/2017.
 */
tmplogin = `
    <row>
    <div class="container w-25"> 
        <div class="col-lg-12"> 
            <h1> Login </h1>
            <form class="form-group"> 
                <label for="#username"> Username: </label>
                <input @keyup="checkIfComplete" v-model = "username"  class="form-control w-100" type="text"  id="username" >
                <label for="#password"> Password: </label>
                <input @keyup="checkIfComplete" v-model="password" class="form-control w-100 mb-3" type="password"  id="password">
                <button class="btn  btn-primary" type="submit" @click="submit" :disabled = "disableSubmit"> Login </button>
            </form>
            <list-group v-if="system.msg.error"> 
                <list-item class="alert alert-danger" v-for="error in system.msg.error"> {{error.msg}} </list-item>
            </list-group>
        </div>
    </div>

    </row>
`;

const Login = {
    template: tmplogin,
    data: () => {
        return {
            system: system,
            password:null,
            username: null,
            disableSubmit :true
        }
    },
    beforeCreate: function () {
    },

    methods: {
        checkIfComplete(){
              if(this.password == null && this.username == null){
                  this.disableSubmit = true;//returns true/false;
            }else if(this.password !== null && this.username !== null ){
                  this.disableSubmit = false;
              }
        }
        ,
        submit(){
            this.system.login(this.password,this.username);
            console.log(system);
        }
    }
};
