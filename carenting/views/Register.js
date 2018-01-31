/**
 * Created by Dimitris on 4/30/2017.
 */
let rgstr = `
<div class="container">
<row> 
    <div class="col-lg-12"> 
    <template v-if="steps[1]"> 
        <h1> Register as:</h1>
        <card>
            <card-block >
            <div style="font-size: 1.5em;">
                    <input type="radio" name="a" class="" value="renter" v-model="user.type">  
                    Renter
                    <input type="radio" name="a" class="custom-radio" value="owner" v-model="user.type"> 
                    Car Owner
             </div>
            </card-block>
            <div class="card-footer">
                <span class="display-4"> 
                      <button class="btn btn-lg btn-success" @click="nextStep(1,2)" :disabled="!user.type"> 
                       Next 
                        <i class="fa fa-arrow-right"> </i>
                      </button>  
                </span>
            </div>
        </card>
    </template>    

    <template v-if="steps[2]"> 
        <h1> Your Details </h1>
        <card>
            <card-block >
                <form-inline class="mb-3"> 
                   username: <input required class="form-control mr-3" type="text" v-model="user.username" @keyup="checkUsername(user.username)"> 
                    Password: <input required class="form-control mr-3" type="password" v-model="user.password" @keyup="checkPassword(user.password)">            
                </form-inline>   
                 <form-inline class="mb-3"> 
                    First Name: <input class="form-control mr-3" type="text" v-model="user.firstname" @keyup="checkNames(user.firstname)">
                    Last Name: <input class="form-control" type="text" v-model="user.lastname" @keyup="checkNames(user.lastname)"> 
                </form-inline>
                <form-group> 
                    Date of Birth : <input type="date" v-model="user.age" class="form-control mr-3" @keyup="user.procceed()">
                    email: <input type="email" v-model="user.email" class="form-control mr-3" @keyup="checkEmail(user.email)">
                    phone: <input type="text" v-model="user.phone" class="form-control mr-3" @keyup="user.procceed()">
                    Address  : <input type="search" v-model="user.address" class="form-control mr-3" @keyup="user.procceed()">
                    Gender : 
                    <select v-model="user.gender" class="form-control mr-3" @click="user.procceed()"> 
                         <option selecvalue="female"> Female</option>
                         <option value="male"> Male </option>
                    </select>
                    <template v-if=" user.type =='renter'">
                        Driver since: <input type="date" v-model="user.experience" class="form-control mr-3" @keyup="user.procceed()">                
                    </template>
                </form-group>
            </card-block>
            <div class="card-footer">
              <button class="btn btn-lg btn-danger" @click="nextStep(2,1)"> 
                  Back 
                  <i class="fa fa-arrow-left"> </i>
              </button>  
              <button class="btn btn-lg btn-success" :disabled="!user.completed" @click="nextStep(2,3)"> 
                  Next 
                  <i class="fa fa-arrow-right"> </i>
              </button>
            </div>
        </card>
    </template> 
    
    <template v-if="steps[3]"> 
        <h1> Register as:</h1>
        <card>
            <card-block>
            <table class="table"> 
             <tr><td> registered as: </td> <td> {{user.type}}</td></tr>
             <tr><td>Username</td><td> {{user.username}}</td></tr>
             <tr><td>Lastname</td><td> {{user.lastname}}</td></tr>
             <tr><td>Firstname</td><td> {{user.firstname}}</td></tr>
             <tr><td>Your Address</td><td> {{user.address}}</td></tr>
             <tr><td> Born at</td><td> {{user.age}}</td></tr>
             <tr><td>Your phone </td><td> {{user.phone}}</td></tr>
             <tr><td>e-mail</td><td> {{user.email}}</td></tr>
             <tr><td>Gender</td><td> {{user.gender}}</td></tr>
             <tr v-if="user.experience"><td> Driver since </td> <td> {{user.experience}}</td></tr>
            </table>
            </card-block>
            <div class="card-footer" v-if="!user.registered">  
              <button class="btn btn-lg btn-danger" @click="nextStep(3,2)"> 
                  Back 
                  <i class="fa fa-arrow-left"> </i>
              </button>
                <button class="btn btn-lg btn-success"  @click="complete">
                  Complete Registration 
                  <i class="fa fa-check"> </i> 
              </button>
            </div>
        </card>
    </template>
    <div v-if="validations.passCheck" class="alert" :class="{'alert-success':validations.passCheck.result, 'alert-danger':!validations.passCheck.result}">
    <strong> password: must have:</strong> {{validations.passCheck.details}}</div>
        <div v-if="validations.userCheck" class="alert" :class="{'alert-success':validations.userCheck.result, 'alert-danger':!validations.userCheck.result}">
    <strong> username must have:</strong> {{validations.userCheck.  details}}</div> 
            <div v-if="validations.emailCheck" class="alert" :class="{'alert-success':validations.emailCheck.result, 'alert-danger':!validations.emailCheck.result}">
    <strong> emails :</strong> {{validations.emailCheck.details}}</div>    
      <div v-if="validations.namesCheck" class="alert" :class="{'alert-success':validations.namesCheck.result, 'alert-danger':!validations.namesCheck.result}">
    <strong> names:</strong> {{validations.namesCheck.details}}</div>    
    <div v-for="m in user.msg.success" class="alert alert-success"> {{m.msg}} </div>
    <div v-for="m in user.msg.error" class="alert alert-success"> {{m.msg}} </div>
    </div>      
    </div>
</row>
</div>
`;

const Register = {
    template: rgstr,
    data: () => {
        return {
            steps: {
                1: true,
                2: false,
                3: false
            },
            user: new Registration(),
            validations: {
                userNotSame:false,
                userCheck:{},
                username: Valguard.make.validation({
                    have: ['!specialSymbols'],
                    is: {'>=': 5}
                }),
                passCheck:{},
                password: Valguard.make.validation({
                    have: ['specialSymbols', 'numbers', 'uppercase', 'lowercase'],
                    is: {'>=': 6}
                }),
                emailCheck:{},
                namesCheck:{},
                names: Valguard.make.validation({
                   have:['!specialSymbols','!numbers']
                }),
                //ενδεικτικά μερικά αυτόματα disposable email domain
                email:Valguard.make.email({
                    banned:[
                        'mailinator.com',
                        'mailinator.net',
                        'mail.mezimages.net',
                        'mail2rss.org',
                        'mail333.com',
                        'mail4trash.com',
                    ]
                })
            }
        }
    },
    beforeCreate: function () {

    },
    methods: {
        checkNames(name){
            let results = this.validations.names(name   );
            this.validations.namesCheck= results;
            if (results.result) {
                console.log(results);
                this.validation.namesCheck= results;
                this.user.procceed()
            } else {
                this.user.completed = false;

            }
        },
        checkUsername(username) {
            this.user.applyUsername(username)
                .then(() => {
                    let results = this.validations.username(username);
                    this.validations.userCheck  = results;
                    console.log(results);
                    if (results.result) {
                        this.user.procceed();
                    } else {
                        this.user.completed = false;
                    }
                })
        },
        checkPassword(password) {
                let results = this.validations.password(password);
                this.validations.passCheck = results;
                if (results.result) {
                    console.log(results);
                    this.validation.passCheck = results;
                    this.user.procceed()
                } else {
                    this.user.completed = false;

                }
        },
        checkEmail(email){
          let results = this.validations.email(email);
          this.validations.emailCheck = results;
          if(results.result){
               this.user.procceed()
          }else{
              this.user.completed = false;
          }
        },
        onSubmit() {

        },
        nextStep(prev, next) {
            console.log('hi');
            this.steps[prev] = false;
            this.steps[next] = true;
        },
        complete() {
            this.user.register();
        }

    }

};
