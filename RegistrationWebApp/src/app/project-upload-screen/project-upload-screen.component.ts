import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { UploadFileService } from '../services/upload-file.service';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FileUpload } from '../fileupload';
import { Project } from '../project';


@Component({
  selector: 'app-project-upload-screen',
  templateUrl: './project-upload-screen.component.html',
  styleUrls: ['./project-upload-screen.component.css']
})
export class ProjectUploadScreenComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  project: Project;
  projectform: FormGroup; // tracks the value and validity state of a group of FormControl
  projectError: boolean; //if true -> there is an error in the project form
  progress: { percentage: number } = { percentage: 0 };
  fields;
  projectField: string; // if the student is selected "another" field of research, we will use this
  projectStatus;


  constructor(public db: DatabaseService, public auth: AuthService, public uploadService: UploadFileService) {
    this.fields = [
      "מתמטיקה", "מדעי החיים", "כימיה",
      "הנדסה/טכנולוגיה", "היסטוריה",
      "מדעי הסביבה", "פיזיקה", "מדעי המחשב", "מדעי החברה", "אחר"];
    this.projectStatus = ["עוד לא התחלתי את העבודה המעשית",
      "עוד לא סיימתי את העבודה המעשית ואין לי תוצאות",
      "עוד לא סיימתי את העבודה המעשית אך יש לי תוצאות חלקיות",
      "סיימתי את כל העבודה המעשית ואני בכתיבת העבודה"];
    this.project = new Project();
    this.validateForm();
    this.projectError = false; // default- no registration form errors
  }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined; //reset ? 
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress);
  }

  public addProject() {
    if (this.CheckIfEmptyField(this.project.user2mail)) { // 1 participant
      this.projectform.get('partner2').clearValidators();
      this.projectform.get('partner2').updateValueAndValidity(); //clear error
    }
    if (this.CheckIfEmptyField(this.project.user3mail)) {//2 participants
      this.projectform.get('partner3').clearValidators();
      this.projectform.get('partner3').updateValueAndValidity(); // clear error
    }
    if (this.CheckIfEmptyField(this.project.school_contact_mail)) { // no theacher
      this.projectform.get('email_school').clearValidators();
      this.projectform.get('email_school').updateValueAndValidity(); //clear error
    }
    if (this.project.project_field != "אחר") { //project_field != other
      this.projectform.get('other').clearValidators();
      this.projectform.get('other').updateValueAndValidity(); //clear error
    }
    else {
      this.project.project_field = this.projectField;
    }
    if (!this.projectform.valid) { // validate errors
      this.projectError = true; // form error
      console.log(this.projectform); //show errors
      return;
    }
    this.projectError = false;
    this.project.project_file = this.currentFileUpload; // assigned file in project field
    this.db.addProjectToDB(this.project).then(() => {
      this.db.getUser(this.project.user1mail, this.project.user2mail, this.project.user3mail).then(() => {
        this.db.setMetaData();
        setTimeout(() => {
          var proj_id = this.db.getProjectID(this.project.project_name);
          this.db.selectedUser[0].project = proj_id;
          this.db.selectedUser[0].teacher = this.project.school_contact_mail;
          this.db.selectedUser[1].project = proj_id;
          this.db.selectedUser[1].teacher = this.project.school_contact_mail;
          this.db.selectedUser[2].project = proj_id;
          this.db.selectedUser[2].teacher = this.project.school_contact_mail;
          this.db.asignProjectToUser(this.db.selectedUser[0].email, 0);
          this.db.asignProjectToUser(this.db.selectedUser[1].email, 1);
          this.db.asignProjectToUser(this.db.selectedUser[2].email, 2);
        }, 2000)
        alert("הפרוייקט הועלה בהצלחה");
      });
    });
  }

  public validateForm() {
    // Limitations on fields in the registration form
    this.projectform = new FormGroup({
      'partner1': new FormControl(this.project.user1mail, [
        // my Email is required, must be in email format.
        Validators.required,
        Validators.email
      ]),
      'partner2': new FormControl(this.project.user2mail, [
        //must be in email format.
        Validators.email
      ]),
      'partner3': new FormControl(this.project.user3mail, [
        //must be in email format.
        Validators.email
      ]),
      'projectname': new FormControl(this.project.user3mail, [
        //projectname is required.
        Validators.required
      ]),
      'email_school': new FormControl(this.project.user3mail, [
        // must be in email format.
        //Validators.required,
        Validators.email
      ]),
      'project_field': new FormControl(this.project.user3mail, [
        //projectname is required.
        Validators.required
      ]),
      'other': new FormControl(this.projectField, [
        //projectname is required.
        Validators.required
      ]),
    });
  }

  // gets - link the formControls to html
  get partner1() { return this.projectform.get('partner1'); }
  get partner2() { return this.projectform.get('partner2'); }
  get partner3() { return this.projectform.get('partner3'); }
  get projectname() { return this.projectform.get('projectname'); }
  get email_school() { return this.projectform.get('email_school'); }
  get project_field() { return this.projectform.get('project_field'); }
  get other() { return this.projectform.get('other'); }

  // get location() { return this.projectform.get('location'); }
  // get type() { return this.projectform.get('type'); }
  // get status() { return this.projectform.get('status'); }
  // get fileupload() { return this.projectform.get('fileupload'); }
  // get target() { return this.projectform.get('target'); }
  // get background() { return this.projectform.get('background'); }
  // get description() { return this.projectform.get('description'); }
  // get scope() { return this.projectform.get('scope'); }
  // get inovetion() { return this.projectform.get('inovetion'); }
  // get advantages() { return this.projectform.get('advantages'); }
  // get retrospective() { return this.projectform.get('retrospective'); }


  //check if a field is empty
  public CheckIfEmptyField(field: string) {
    if (field == undefined || field == '')
      return true; // field is empty
    else
      return false;
  }


}