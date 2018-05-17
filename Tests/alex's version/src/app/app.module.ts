import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FooterComponent } from './footer/footer.component';
import { AppComponent } from './app.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import {DatabaseService} from './services/database.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './services/app-routing.module';
import { AuthService } from './services/auth.service'
import { FormsModule, FormGroup,FormBuilder ,Validators,ReactiveFormsModule  } from '@angular/forms';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuardService } from './services/auth-guard.service'


@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent,
    LoginScreenComponent,
    FooterComponent,
    UserHomePageComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule, 
    AngularFireStorageModule, 
    AngularFireDatabaseModule,
    AppRoutingModule
  ],
  providers: [
    DatabaseService,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }