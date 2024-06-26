import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { v4 as uuid } from 'uuid';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { arrayObjectSort } from 'src/app/shared/utils/array-methods.utils';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ums-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  showLoader: boolean = true;
  displayedColumns: string[] = ['Name', 'Email', 'Role', 'Actions'];
  userList: User[] = [];
  allUserSubs: Subscription | undefined;
  sortedData: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog

  ) { }
  ngOnInit() {
    this.showLoader = true;
    if (this.usersService.isReload) {
      this.allUserSubs = this.usersService.getAllUsers().subscribe((resUserData: any) => {
        this.usersService.allUsers = this.mapUserData(resUserData);
        this.reloadUserList();
        this.usersService.isReload = false;
      })
    } else {
      this.reloadUserList();
    }
  }

  ngAfterViewInit() {
    this.sortedData.paginator = this.paginator;
  }

  reloadUserList() {
    this.sortedData = this.usersService.allUsers;
    this.showLoader = false;
  }

  mapUserData(data: User[] | undefined) {//Update unique id to each record
    return data?.map(rec => {
      rec.id = uuid()
      return rec;
    })
  }

  sortData(sort: Sort) {
    const data: User[] = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = arrayObjectSort(data, "price", sort.direction == 'asc');
  }

  searchUsers($event: any) {
    let filterData = this.usersService.allUsers;
    let searchKey = $event.target.value;
    if (searchKey) {
      filterData = filterData?.filter((item: User) => (item?.name?.toLowerCase().includes(searchKey.toLowerCase()) || item?.email?.toLowerCase().includes(searchKey.toLowerCase())));
    }
    this.sortedData = filterData;
  }
  
  addUser() {
    this.usersService.selectedUser = {
      name: "",
      role: "",
      email: "",
      id: "0"
    }
    this.router.navigateByUrl('/add-user');
  }

  editUser(data: User) {
    this.usersService.selectedUser = data;
    this.router.navigateByUrl('/add-user');
  }

  deleteUser(id: any) {
    const selctedUserIndex = this.usersService.allUsers?.findIndex((user: User) => user.id == id);
    if (selctedUserIndex != undefined && selctedUserIndex != null && selctedUserIndex > -1) {
      let allUsers = Object.assign([], this.usersService.allUsers);
      allUsers?.splice(selctedUserIndex, 1);
      this.usersService.allUsers = allUsers;
      alert('User deleted Succesfully');
      this.reloadUserList();
    }
  }

  openConfirmationDialog(user: User) {
    if (confirm("Are you sure, you want to remove this User") == true) {
      this.deleteUser(user.id);
    }
  }

  ngOnDestroy() {
    this.allUserSubs?.unsubscribe(); //unsubscribing get user api subscription
  }

}
