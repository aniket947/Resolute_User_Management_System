import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ums-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent {
  selectedUser: User | undefined;
  addUserForm!: FormGroup;
  selectedUserData: User | undefined;
  allUsersList: User[] | undefined = [];

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.createUserForm();
    if (this.usersService.selectedUser) {
      this.allUsersList = this.usersService.allUsers;
      this.selectedUserData = this.usersService.selectedUser;
      this.addUserForm.patchValue(this.selectedUserData);
    }
  }

  createUserForm() {
    this.addUserForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9]{1,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]),
    })
  }

  get f() {
    return this.addUserForm.controls;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  createUser() {
    this.addUserForm.markAllAsTouched();
    const existingUser: any = this.usersService.allUsers?.filter(name => name.name == this.addUserForm.value.name);
    if (existingUser?.length > 0) {
      alert('User already Exist');
      return;
    }
    if (this.addUserForm.invalid) {
      return;
    }
    if (!this.isUserExist()) {
      const selectedUser: User = {
        name: this.addUserForm.value.name,
        role: this.addUserForm.value.role,
        email: this.addUserForm.value.email,
        id: uuid()
      };
      this.usersService.addUser(selectedUser);
      this.addUserForm.reset();
      this.router.navigateByUrl('/users');// After saving, navigating to dashboard
    }
    else {
      alert('User already Exist');
    }
  }

  isUserExist(): boolean {
    const existRecord = this.usersService.allUsers?.filter(user => user.name == this.addUserForm.value.firstName && user.id != this.addUserForm.value.id);
    return existRecord?.length ? true : false;
  }
  
  updateUser() {
    this.addUserForm.markAllAsTouched();
    if (this.addUserForm.invalid) {
      return;
    }
    if (!this.isUserExist()) {
      let selctedUserIndex = this.usersService.allUsers?.findIndex((user: User) => user.id == this.selectedUserData?.id);
      if (selctedUserIndex != undefined && selctedUserIndex != null && selctedUserIndex > -1) {
        this.usersService.allUsers?.splice(selctedUserIndex, 1, this.addUserForm.value);
      }
      this.router.navigate(['/users']);
    } else {
      alert('User already Exist');
    }
  }

  backToUserlist() {
    history.back();
  }
}
